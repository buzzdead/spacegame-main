import { MeshPortalMaterial, RoundedBox } from "@react-three/drei";
import {
  BufferGeometry,
  DoubleSide,
  Group,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
  Vector3,
} from "three";
import { useAsset } from "../hooks/Asset";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import React from "react";
import {
  LightningStrike,
  SmokeSphere,
} from "../spaceobjects/tools/nebula/nebulaSystem";
import { useKeyboard } from "../hooks/Keys";
import useStore from "../store/UseStore";
import { dampWithEase, getRandomPosition } from "../util";
import { DAMP_SETTINGS, PORTAL_HEIGHT, PORTAL_WIDTH } from "../constants";
import { useTexture } from "../hooks/Texture";

interface Props {
  position: Vector3;
}

export const PortalScene = ({ position }: Props) => {
  
  const smokeTexture = useTexture('blackSmoke15.png')
 const lightningTexture = useTexture('flash01.png')
 const smokeDecay = useRef(0)
 const [smoke, setSmoke] = useState(false)
  const ref = useRef<Mesh<
    BufferGeometry<NormalBufferAttributes>,
    Material | Material[],
    Object3DEventMap
  > | null>(null);
  const [state, setState] = useState({ h: 5, w: 2.5, d: 0.25, r: 1, s: 1 });
  const [isOpen, setIsOpen] = useState(false);
  const keyMap = useKeyboard();
  const stateRef = useRef(state);
  const start = useRef(false);
  const timer = useRef(0);

  const resetPortal = () => {
    timer.current = 0;
    smokeDecay.current = 0;
    if (ref.current) ref.current.position.y = position.y;
    setTimeout(() => (start.current = true), 1000);
  };

  useFrame((_state, delta) => {
    if (keyMap && keyMap["KeyF"]) {
      resetPortal();
    }
    if(keyMap && keyMap["KeyG"]) {
      setSmoke(!smoke)
    }
    if (start.current) {
      timer.current += 1;
      if (timer.current % 3 > 0) return;

      const running = DAMP_SETTINGS.map((ds) =>
        dampWithEase({ ...ds, delta, stateRef, isOpen })
      ).reduce((acc: number, val) => acc + val, 0);
      if (running > 0) {
        setState({ ...stateRef.current });
        if (ref.current) ref.current.position.y += isOpen ? 0.04 : -0.04;
      } else {
        setState({ ...stateRef.current });
        setIsOpen(!isOpen);
        start.current = false;
      }
    }
    if(!isOpen && state.h > 200) smokeDecay.current = 1.5
  });

  return (
    <RoundedBox
      onClick={resetPortal}
      ref={ref}
      smoothness={state.s}
      radius={state.r}
      position={position || new Vector3(0, 0, 0)}
      args={[state.w, state.h, state.d]}
    >
      {smoke && state.h < 490 && <SmokeSphere decay={smokeDecay.current} texture={smokeTexture} position={position} />}
      {smoke && state.h < 290 && (
        <LightningStrike texture={lightningTexture} position={position} />
      )}
      <SpawnPortal pos={position} shouldMove={isOpen} />
    </RoundedBox>
  );
};

interface Prop {
  shouldMove: boolean;
  pos: Vector3;
}
const Portal = ({ shouldMove, pos }: Prop) => {
  return (
    <MeshPortalMaterial blend={2} side={DoubleSide}>
      <ambientLight intensity={5} />
      <StaticRotatingPortal />
      <PhasedShips shouldMove={shouldMove} pos={pos} />
    </MeshPortalMaterial>
  );
};

const SpawnPortal = React.memo(
  Portal,
  (prevProps, nextProps) => prevProps.shouldMove === nextProps.shouldMove
);

const RotatingPortal = () => {
  const portal = useAsset("/assets/theworld3.glb", 2111);

  portal.rotation.x += 0.55;
  useFrame(() => {
    portal.rotation.y += 0.001;
  });
  return <primitive object={portal} />;
};

const StaticRotatingPortal = React.memo(RotatingPortal, () => true);

interface ShipProps {
  shouldMove: boolean;
  pos: Vector3;
}
const PhasedShips = ({ shouldMove, pos }: ShipProps) => {
  const addEnemyShip = useStore((state) => state.addEnemyShip);
  const [update, set] = useState(false);
  const [phasedShips, setPs] = useState<
    { ship: Group<Object3DEventMap>; stop: boolean }[]
  >([]);
  const enemyShip = useAsset("/assets/spaceships/cruiser.glb", 0.2);
  
   useMemo(() => {
    if (shouldMove) return;

    const ps: { ship: Group<Object3DEventMap>; stop: boolean }[] = [
      { ship: enemyShip, stop: false },
    ];
    for (let i = 0; i < 5; i++) {
      const newShip = enemyShip.clone();
      const randomPosition = getRandomPosition(
        PORTAL_WIDTH - 50,
        PORTAL_HEIGHT - 100
      );
      newShip.position.set(randomPosition.x, randomPosition.y, 15);
      newShip.rotation.set(0, 1.55, 0);
      ps.push({ ship: newShip, stop: false });
    }
    setPs(ps);

  }, [shouldMove]);

  enemyShip.position.set(0, 10, 15);
  enemyShip.rotation.set(0, 1.55, 0);
  useFrame(() => {
    if (shouldMove) {
      phasedShips.forEach((ps, id) => {
        if (ps.stop) return;
        ps.ship.position.z -= 1 / (id + 1);
        if (ps.ship.position.z < -25) {
          const thePos = pos.clone();
          const mw = thePos.add(ps.ship.position.clone());
          mw.y -= 5;
          addEnemyShip(mw, 350, new Vector3(0, 1.55, 0));
          ps.stop = true;
          set(!update);
        }
      });
    }
  });
  return (
    <group>
      {phasedShips.map((ps, id) => {
        return ps.stop ? null : <primitive key={id} object={ps.ship} />;
      })}
    </group>
  );
};
