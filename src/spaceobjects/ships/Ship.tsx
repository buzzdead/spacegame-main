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
    isFighting,
    isTraveling,
    calculateDirectionAndRotation,
    shipsDestination,
    shipsOrigin,
    updateShipPosition,
    setIsFighting
  } = UseNavigation({ shipId: ship.id, meshRef, shipType: ship.assetId });
  // move this into lasercannon.tsx
  const { fireLaser, fire } = useLaser()

  const selectD = selected.find((s) => s.id === ship.id);
  const isFighter = ship.assetId === "fighter";
  const isHawk = ship.assetId === "hawk"
  const isLaserCannon = isFighter || isHawk


  useFrame(() => {
      // move this into lasercannon.tsx, possible solution is to bind mouse, keep like this until actually having the attack move in place
    keyMap["KeyF"] && selectD && isLaserCannon && fireLaser();
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
  return (
    <Suspense fallback={null}>
      <mesh onClick={handleOnClick} ref={meshRef} position={position}>
        <ShipSound
          isHarvesting={isHarvesting}
          isReturning={isReturning}
          isTraveling={isTraveling}
          meshRef={meshRef}
          fire={fire}
        />
        {selectD && (
          <SelectedIcon
            color={0x00ff80}
            position={
              isFighter ? new Vector3(-4, 2.5, -1.5) : new Vector3(0, 2.5, 2)
            }
          />
        )}
        <primitive object={scene} />
        {(isFighter || ship.assetId === "hawk") && (
          <LaserCannon
            position={meshRef.current ? meshRef.current.position : new Vector3(0,0,0)}
            setFightDone={() => setIsFighting(false)}
            target={shipsDestination || new Vector3(0,0,0)}
            color={isHawk ? 'green' : 'red'}
            fire={isFighting}
          />
        )}
        {(isTraveling || isReturning) && <Ignition type={ship.assetId} />}
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
