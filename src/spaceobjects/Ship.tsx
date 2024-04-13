import { FC, ElementRef, useState, useEffect } from "react";
import { Suspense, useRef } from "react";
import {
  Vector3,
  Quaternion,
  PositionalAudio,
  AudioListener,
  AudioLoader,
  Mesh,
  MeshPhongMaterial,
  ConeGeometry,
  ShaderMaterial,
  Color
} from "three";
import { useGLTF } from "@react-three/drei";
import useStore, { SGS } from "../store/useStore";
import { useFrame, useThree } from "@react-three/fiber";
import RocketBooster from "./RocketBooster";
import fragmentShader from './shaders/glowFragmentShader'
import vertexShader from './shaders/glowVertexShader'
interface Props {
  ship: SGS["Ship"];
}

const Ship: FC<Props> = ({ ship }) => {
  const { destination, origin, setOrigin, setSelected, selected, setResources } = useStore();
  const [shipsOrigin, setShipsOrigin] = useState<Vector3>()
  const [shipsDestination, setShipsDestination] = useState<Vector3>()
  const { glbPath, position, scale } = ship;
  const [isTraveling, setIsTraveling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const { scene } = useGLTF(glbPath);
  const theScene = scene.clone()
  const { camera } = useThree();
  const glowMaterial = new ShaderMaterial({
    uniforms: {
        glowColor: { value: new Color(0x00FF80) }, // Neon green color
        glowStrength: { value: 1.0 } 
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true // Important for blend effects like glows
});

const geometry = new ConeGeometry(0.25, 1, 4); // Radius, height, number of sides = 4
const material = new MeshPhongMaterial({ color: 0x00FF80 });
const pyramidMesh = new Mesh(geometry, material);
pyramidMesh.position.set(0, 1.5, 2)
pyramidMesh.rotation.x = 3.22

  useEffect(() => {
    if(!selected.includes(ship.id)) return
        if(destination !== shipsDestination)
          {
            setShipsDestination(destination)
          }
        if(origin !== shipsOrigin) 
          {
            setShipsOrigin(origin)
          }
  }, [destination, origin])

  useEffect(() => {
    if(shipsOrigin && shipsDestination) 
      {
      setIsTraveling(true)
      sound.setLoop(true);
      !sound.isPlaying && sound.play()
      setSelected(ship.id)
      }
  }, [shipsOrigin, shipsDestination])

  const listener = new AudioListener();
  camera.add(listener);
  const audioLoader = new AudioLoader();
  const sound = new PositionalAudio(listener);
  audioLoader.load("/assets/sounds/sc.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true); // Loop if you want the sound to continue
    sound.play();
    sound.setVolume(0.1)
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

    if (distance < 5) {
      if (isTraveling) {
        setIsTraveling(false);
        setTimeout(() => setIsReturning(true), 3000);
      } else if (isReturning) {
        setIsReturning(false);
        setTimeout(() =>{ setIsTraveling(true); setResources(500) }, 3000);
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
    if (meshRef.current && shipsDestination && shipsOrigin && (isTraveling || isReturning)) {
      const targetPosition = isTraveling ? shipsDestination : shipsOrigin;
      const { direction, targetQuaternion } =
        calculateDirectionAndRotation(targetPosition);

      direction &&
        updateShipPosition(direction, targetQuaternion, targetPosition);
    }
    if (meshRef.current && (isTraveling || isReturning)) {
      const distance = camera.position.distanceTo(meshRef.current.position);
      sound.setVolume(calculateVolume(distance));
    }
  });
  function calculateVolume(distance: number) {
    // Adjust these parameters based on your desired sound behavior
    const maxDistance = 75;
    const minVolume = 0.1;

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
        onClick={() => setSelected(ship.id)}
        ref={meshRef}
        position={position}
      >
        <directionalLight position={[10, 15, 15]} castShadow intensity={.1} />
       {selected.includes(ship.id) && <primitive object={pyramidMesh} />}
        <primitive object={theScene} />
        {(isTraveling || isReturning) && (
          <group>
            <RocketBooster
              position={new Vector3(1.04 / 100, 0.75 / 100, -0.3)}
            />
           <RocketBooster
              position={new Vector3(1.04 / 100, 0.75 / 100, -0)}
            />
          </group>
        )}
      </mesh>
    </Suspense>
  );
};

export default Ship;
