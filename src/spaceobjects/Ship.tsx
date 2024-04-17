import { FC, ElementRef, useState, useEffect } from "react";
import { Suspense, useRef } from "react";
import { Vector3, Quaternion, Mesh, MeshStandardMaterial } from "three";
import { useGLTF } from "@react-three/drei";
import useStore, { SGS } from "../store/useStore";
import { useFrame, useThree } from "@react-three/fiber";
import RocketBooster from "./RocketBooster";
import SelectedIcon from "./tools/pyramidMesh";
import UseSoundEffect from "../hooks/SoundEffect";
import Laser from "./weapons/Laser";
interface Props {
  ship: SGS["Ship"];
}

const Ship: FC<Props> = ({ ship }) => {
  const {
    destination,
    origin,
    setSelected,
    selected,
    setResources,
  } = useStore();
  const [shipsOrigin, setShipsOrigin] = useState<Vector3>();
  const [shipsDestination, setShipsDestination] = useState<Vector3>();
  const [fire, setFire] = useState(false)
  const { glbPath, position, scale } = ship;
  const [isTraveling, setIsTraveling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const { scene } = useGLTF(glbPath);
  const theScene = scene.clone();
  if(ship.assetId === "fighter") {theScene.children[0].rotation.y = -55}
  const meshes: Mesh[] = theScene.children as Mesh[]; 

  // Assuming a MeshStandardMaterial:
  for(let i = 0; i < meshes.length; i++){
    const newMaterial = meshes[i].material as MeshStandardMaterial;
    newMaterial.color.set(ship.assetId === "fighter" ? 'darkorange' : 'orange'); // Green
    newMaterial.color.multiplyScalar(2.5)
    meshes[i].material = newMaterial;
  }
  
 
  const { camera } = useThree();
  const { sound: miningSound, calculateVolume: calculateMiningSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/mining.mp3",
      scene: theScene,
      minVolume: 0.05,
      camera: camera,
    });
  const { sound: motorSound, calculateVolume: calculateMotorSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/sc.mp3",
      scene: theScene,
      camera: camera,
    });
  const { sound: laserSound, calculateVolume: calculateLaserSound } = 
    UseSoundEffect({
      sfxPath: '/assets/sounds/laser.mp3',
      scene: theScene,
      camera: camera
    })

/*   const glowMaterial = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(0x00ff80) }, // Neon green color
      glowStrength: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // Important for blend effects like glows
  }); */

  useEffect(() => {
    if (!selected.find((s) => s.id === ship.id)) return;
    if (destination !== shipsDestination) {
      setShipsDestination(destination);
    }
    if (origin !== shipsOrigin) {
      setShipsOrigin(origin);
    }
  }, [destination, origin]);

  useEffect(() => {
    if (shipsOrigin && shipsDestination) {
      setIsTraveling(true);
      motorSound?.play();
      setSelected(ship.id);
    }
  }, [shipsOrigin, shipsDestination]);

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

    if (distance < 6.5) {
      motorSound?.pause();
      if (isTraveling) {
        setIsTraveling(false);
        setIsHarvesting(true);
        miningSound?.play();
        setTimeout(() => {
          setIsReturning(true);
          setIsHarvesting(false);
          motorSound?.play();
          miningSound?.stop();
        }, 5000);
      } else if (isReturning) {
        setIsReturning(false);
        setTimeout(() => {
          setIsTraveling(true);
          setResources(500);
          motorSound?.play();
        }, 3000);
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
    if (
      meshRef.current &&
      shipsDestination &&
      shipsOrigin &&
      (isTraveling || isReturning)
    ) {
      const targetPosition = isTraveling ? shipsDestination : shipsOrigin;
      const { direction, targetQuaternion } =
        calculateDirectionAndRotation(targetPosition);

      direction &&
        updateShipPosition(direction, targetQuaternion, targetPosition);
    }
    if (meshRef.current && (isTraveling || isReturning)) {
      const distance = camera.position.distanceTo(meshRef.current.position);
      calculateMiningSound(distance);
      calculateMotorSound(distance);
    }
  });

  const handleOnClick = (e: any) => {
    if(ship.assetId === "fighter" && e.ctrlKey) {setFire(!fire); laserSound?.stop(); laserSound?.play()}
    else setSelected(ship.id)
  }

  return (
    <Suspense fallback={null}>
      <mesh
        onClick={handleOnClick}
        ref={meshRef}
        position={position}
      >
        {selected.find((s) => s.id === ship.id) && (
          <SelectedIcon color={0x00ff80} position={new Vector3(0, 1.5, 2)} />
        )}
        <primitive onRightClick={() => console.log("adisujnhf")} object={theScene} />
        {ship.assetId === "fighter" && <group><Laser fire={fire} origin={theScene.position} target={new Vector3(0,0,0)}/><Laser fire={fire} second origin={theScene.position} target={new Vector3(0,0,0)}/></group>}
        {(isTraveling || isReturning) && (
          <group>
            <RocketBooster
              position={new Vector3(ship.assetId === "fighter" ? -3.3 : 1.04 / 100, 0.75 / 100, ship.assetId === "fighter" ? -4.5 : -0.3)}
            />
            <RocketBooster position={new Vector3(ship.assetId === "fighter" ? -5.3 : 1.04 / 100, 0.75 / 100, ship.assetId === "fighter" ? - 4.5 : -0)} />
          </group>
        )}
        {isHarvesting && ship.assetId !== "fighter" && (
          <group>
            <RocketBooster
              isHarvesting={isHarvesting}
              position={new Vector3(1.04 / 100, 0.75 / 100, 4.75)}
            />
            <RocketBooster
              isHarvesting={isHarvesting}
              position={new Vector3(1.04 / 100, 0.75 / 100, 5.25)}
            />
            <RocketBooster
              isHarvesting={isHarvesting}
              position={new Vector3(1.04 / 100, 0.75 / 100, 5.75)}
            />
          </group>
        )}
      </mesh>
    </Suspense>
  );
};

export default Ship;
