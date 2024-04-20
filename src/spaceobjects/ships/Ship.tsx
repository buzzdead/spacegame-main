import { FC, ElementRef, useState, useEffect } from "react";
import { Suspense, useRef } from "react";
import { Vector3, Quaternion, Mesh, MeshStandardMaterial } from "three";
import { SGS, useShallowStore } from "../../store/useStore";
import { useFrame, useThree } from "@react-three/fiber";
import SelectedIcon from "../tools/pyramidMesh";
import UseSoundEffect from "../../hooks/SoundEffect";
import useKeyboard from "../keys";
import { useAsset } from "../useAsset";
import { Ignition } from "./Ignition";
import { HarvestLaser } from "./HarvestLaser";
import { LaserCannon, useLaser } from "./LaserCannon";
interface Props {
  ship: SGS["Ship"];
}

const Ship: FC<Props> = ({ ship }) => {
  const { destination, origin, setSelected, selected ,setResources} = useShallowStore(["destination", "origin", "setSelected", "selected", "setResources"])

  const [shipsOrigin, setShipsOrigin] = useState<Vector3>();
  const [shipsDestination, setShipsDestination] = useState<Vector3>();
  const keyMap = useKeyboard();
  const { glbPath, position, scale } = ship;
  const [isTraveling, setIsTraveling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const scene = useAsset(glbPath, scale || 1);
  const { camera } = useThree();
  const { fireLaser, fire, calculateLaserSound } = useLaser({
    camera: camera,
    scene: scene,
  });

  scene.rotation.set(0, -1.55, 0);
  if (ship.assetId === "fighter") {
    scene.children[0].rotation.y = -55;
  }

  const { sound: miningSound, calculateVolume: calculateMiningSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/mining.mp3",
      scene: scene,
      minVolume: 0.05,
      camera: camera,
    });
  const { sound: motorSound, calculateVolume: calculateMotorSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/sc.mp3",
      scene: scene,
      camera: camera,
    });

  const meshes: Mesh[] = scene.children as Mesh[];
  for (let i = 0; i < meshes.length; i++) {
    const newMaterial = meshes[i].material as MeshStandardMaterial;
    newMaterial.color.set(ship.assetId === "fighter" ? "darkorange" : "orange"); // Green
    newMaterial.color.multiplyScalar(2.5);
    meshes[i].material = newMaterial;
  }
  /*   const glowMaterial = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(0x00ff80) }, // Neon green color
      glowStrength: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // Important for blend effects like glows
  }); */
  const selectD = selected.find((s) => s.id === ship.id);
  const isFighter = ship.assetId === "fighter";
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

    if (distance < (isReturning ? 12 : 7)) {
      if (isTraveling) {
        setIsTraveling(false);
        setIsHarvesting(true);
        setTimeout(() => {
          setIsReturning(true);
          setIsHarvesting(false);
        }, 5000);
      } else if (isReturning) {
        setIsReturning(false);
        setTimeout(() => {
          setIsTraveling(true);
          setResources(500);
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
    keyMap["KeyF"] && selectD && isFighter && fireLaser();
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
  });

  useEffect(() => {
    if(isHarvesting) miningSound?.play()
    else miningSound?.stop()
    if(isTraveling || isReturning) motorSound?.play()
    else motorSound?.pause() 
  },[isTraveling, isReturning, isHarvesting])
  useEffect(() => {
    if (meshRef.current && (isTraveling || isReturning)) {
      const distance = camera.position.distanceTo(meshRef.current.position);
      calculateMiningSound(distance);
      calculateMotorSound(distance);
      calculateLaserSound(distance);
    }
  }, [camera, isTraveling, isReturning])

  const handleOnClick = (e: any) => {
    e.stopPropagation();
    if (isFighter && e.ctrlKey) fireLaser();
    else setSelected(ship.id);
  };

  return (
    <Suspense fallback={null}>
      <mesh onClick={handleOnClick} ref={meshRef} position={position}>
        {selectD && (
          <SelectedIcon
            color={0x00ff80}
            position={
              isFighter ? new Vector3(-4, 2.5, -1.5) : new Vector3(0, 2.5, 2)
            }
          />
        )}
        {selectD && isFighter && (
          <SelectedIcon
            color="red"
            position={new Vector3(-4, 4, -1.5)}
            fireIcon
            handleFire={fireLaser}
          />
        )}
        <primitive object={scene} />
        {isFighter && (
          <LaserCannon
            position={scene.position}
            target={new Vector3(0, 0, 0)}
            fire={fire}
          />
        )}
        {(isTraveling || isReturning) && <Ignition isFighter={isFighter} />}
        {isHarvesting && ship.assetId !== "fighter" && (
          <HarvestLaser isHarvesting={isHarvesting} />
        )}
      </mesh>
    </Suspense>
  );
};

export default Ship;
