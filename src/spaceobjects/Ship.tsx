import { FC, ElementRef, useState } from "react";
import { Suspense, useRef } from "react";
import {
  Vector3,
  Quaternion,
  PositionalAudio,
  AudioListener,
  AudioLoader,
} from "three";
import { useGLTF } from "@react-three/drei";
import useStore, { SGS } from "../store/useStore";
import { useFrame, useThree } from "@react-three/fiber";
import RocketBooster from "./RocketBooster";
interface Props {
  ship: SGS["Ship"];
}

const Ship: FC<Props> = ({ ship }) => {
  const { constructions, destination, origin, setOrigin } = useStore();
  const constructionPos = constructions.find(p => p.assetId === "spacestation3")
  const originPos = constructionPos?.position || new Vector3(0,0,0);

  const { glbPath, position, scale } = ship;
  const [isTraveling, setIsTraveling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const { scene } = useGLTF(glbPath);
  const theScene = scene.clone()
  const { camera } = useThree();

  const listener = new AudioListener();
  camera.add(listener);
  const audioLoader = new AudioLoader();
  const sound = new PositionalAudio(listener);
  audioLoader.load("/assets/sounds/cargo-sound.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true); // Loop if you want the sound to continue
    sound.play();
    sound.pause()
  });
  theScene.add(sound);
  sound.setRefDistance(20); // Example ref distance
  sound.setRolloffFactor(1); // Adjust for realistic attenuation
  theScene.rotation.set(0, -1.55, 0);
  scale && theScene.scale.set(scale, scale, scale);

  const calculateDirectionAndRotation = (targetPosition: Vector3) => {
    if (!meshRef.current) return {};
    const direction = new Vector3()
      .subVectors(targetPosition, meshRef.current.position)
      .normalize();

    const targetQuaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1), // Assuming front of your ship is along +Z
      direction
    );

    return { direction, targetQuaternion };
  };
  const updateShipPosition = (
    direction: Vector3,
    targetQuaternion: Quaternion,
    targetPosition: Vector3
  ) => {
    if (!meshRef.current) return;
    const distance = meshRef.current.position.distanceTo(targetPosition);

    if (distance < 3) {
      if (isTraveling) {
        setIsTraveling(false);
        setTimeout(() => setIsReturning(true), 3000);
      } else if (isReturning) {
        setIsReturning(false);
        setTimeout(() => setIsTraveling(true), 3000);
      }

      // Reset position to new target
    }

    const speedFactor = Math.max(5); // Adjust for sensitivity
    meshRef.current.position.add(
      direction.multiplyScalar((55 * speedFactor) / 5000)
    );

    meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
  };

  useFrame(() => {
    if (meshRef.current && destination && (isTraveling || isReturning)) {
      !sound.isPlaying && sound.play()
      const targetPosition = isTraveling ? destination : originPos;
      const { direction, targetQuaternion } =
        calculateDirectionAndRotation(targetPosition);

      direction &&
        updateShipPosition(direction, targetQuaternion, targetPosition);
    }
    if (meshRef.current) {
      const distance = camera.position.distanceTo(meshRef.current.position);
      sound.setVolume(calculateVolume(distance));
    }
  });
  function calculateVolume(distance: number) {
    // Adjust these parameters based on your desired sound behavior
    const maxDistance = 75;
    const minVolume = 0.05;

    let volume = 0.15 - Math.min(1, distance / maxDistance); // Linear decrease
    volume = Math.max(minVolume, volume); // Clamp to a minimum

    return volume;
  }

  const handleSetTravel = () => {
    if(meshRef.current) setOrigin(position)
      setIsTraveling(!isTraveling)
  }

  return (
    <Suspense fallback={null}>
      <mesh
        onClick={handleSetTravel}
        ref={meshRef}
        position={position}
      >
        <directionalLight position={[10, 15, 15]} castShadow intensity={.1} />

        <primitive object={theScene} />
        {(isTraveling || isReturning) && (
          <group>
            <RocketBooster
              position={new Vector3(1.04 / 100, 0.75 / 100, -0.3)}
            />
           
          </group>
        )}
      </mesh>
    </Suspense>
  );
};

export default Ship;
