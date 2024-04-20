import { FC, ElementRef, Suspense, useRef } from "react";
import { Vector3, Group, Object3DEventMap } from "three";
import { SGS, useShallowStore } from "../../store/useStore";
import { useFrame, useThree } from "@react-three/fiber";
import SelectedIcon from "../tools/pyramidMesh";
import useKeyboard from "../keys";
import { Ignition } from "./Ignition";
import { HarvestLaser } from "./HarvestLaser";
import { LaserCannon, useLaser } from "./LaserCannon";
import UseNavigation from "./UseNavigation";
import ShipSound from "./ShipSound";

interface Props {
  ship: SGS["Ship"];
  scene: Group<Object3DEventMap>
}

const Ship: FC<Props> = ({ ship, scene }) => {
  const { setSelected, selected } = useShallowStore([
    "setSelected",
    "selected",
  ]);

  const keyMap = useKeyboard();
  const { glbPath, position, scale } = ship;
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const {
    isHarvesting,
    isReturning,
    isTraveling,
    calculateDirectionAndRotation,
    shipsDestination,
    shipsOrigin,
    updateShipPosition,
  } = UseNavigation({ shipId: ship.id, meshRef });
  const { camera } = useThree();
  // move this into lasercannon.tsx
  const { fireLaser, fire, calculateLaserSound } = useLaser()

  const selectD = selected.find((s) => s.id === ship.id);
  const isFighter = ship.assetId === "fighter";


  useFrame(() => {
      // move this into lasercannon.tsx
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

  const handleOnClick = (e: any) => {
    e.stopPropagation();
    if (isFighter && e.ctrlKey) fireLaser();
    else setSelected(ship.id);
  };
  console.log("rendering123")
  return (
    <Suspense fallback={null}>
      <mesh onClick={handleOnClick} ref={meshRef} position={position}>
        <ShipSound
          isHarvesting={isHarvesting}
          isReturning={isReturning}
          isTraveling={isTraveling}
          meshRef={meshRef}
          calculateLaserSound={calculateLaserSound}
        />
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

/*   const glowMaterial = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(0x00ff80) }, // Neon green color
      glowStrength: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // Important for blend effects like glows
  }); */
