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
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import {
  LightningStrike,
  SmokeSphere,
} from "../spaceobjects/tools/nebula/nebulaSystem";
import useStore from "../store/UseStore";
import { dampWithEase, getRandomPosition } from "../util";
import { DAMP_SETTINGS, PORTAL_HEIGHT, PORTAL_WIDTH } from "../constants";
import { useTexture } from "../hooks/Texture";
import { useKeyboard } from "../hooks/Keys";

interface Props {
  position: Vector3;
  forceDev?: boolean
}

export const PortalScene = ({ position, forceDev = false }: Props) => {
  const smokeTexture = useTexture('blackSmoke15.png')
 const lightningTexture = useTexture('flash01.png')
 const keyMap = useKeyboard()
 const smokeDecay = useRef(0)
 const [smoke, setSmoke] = useState(false)
  const ref = useRef<Mesh<
    BufferGeometry<NormalBufferAttributes>,
    Material | Material[],
    Object3DEventMap
  > | null>(null);
  const [state, setState] = useState({ h: 5, w: 2.5, d: 0.25, r: 1, s: 1 });
  const [isOpen, setIsOpen] = useState(false);
  const stateRef = useRef(state);
  const start = useRef(false);
  const timer = useRef(0);

  const startUp = () => {
    setSmoke(true)
    setTimeout(() => start.current = true, 10000)
  }

  useEffect(() => {
    !forceDev && startUp()
  }, [])

  const resetPortal = () => {
    timer.current = 0;
    smokeDecay.current = 0;
    if (ref.current) ref.current.position.y = position.y;
    setTimeout(() => (start.current = true), 1000);
  };

  useFrame((_state, delta) => {
    if(keyMap && keyMap["KeyF"]) { startUp(); }
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
    if(!isOpen && state.h > 200) smokeDecay.current = 22.5
  });

  return (
    <RoundedBox
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
      <SpawnPortal resetPortal={resetPortal} pos={position} shouldMove={isOpen} />
    </RoundedBox>
  );
};

interface Prop {
  shouldMove: boolean;
  pos: Vector3;
  resetPortal: () => void
}
const Portal = ({ shouldMove, pos, resetPortal }: Prop) => {
  return (
    <MeshPortalMaterial blend={2} side={DoubleSide}>
      <ambientLight intensity={5} />
      <StaticRotatingPortal pos={pos}/>
      <PhasedShips resetPortal={resetPortal} shouldMove={shouldMove} pos={pos} />
    </MeshPortalMaterial>
  );
};

const SpawnPortal = React.memo(
  Portal,
  (prevProps, nextProps) => prevProps.shouldMove === nextProps.shouldMove
);

interface StaticPortal {
  pos: Vector3
}

const RotatingPortal = ({pos}: StaticPortal) => {
  const portal = useAsset("/assets/theworld3.glb", 2111).clone();
  const {camera } = useThree()

  portal.rotation.x += Math.random()
  useFrame(() => {
    const dst = camera.position.distanceTo(pos)
    if(dst > 1500 && dst < 3000 && portal.scale.x === 2111)
      portal.scale.set(4300, 4300, 4300)
    else if (dst < 1500 && portal.scale.x >= 4300)
      portal.scale.set(2111, 2111, 2111)
    else if (dst > 3000 && portal.scale.x <= 8000)
        portal.scale.set(8000, 8000, 8000)
    portal.rotation.y += 0.001;
  });
  return <primitive object={portal} />;
};

const StaticRotatingPortal = React.memo(RotatingPortal, () => true);

interface ShipProps {
  shouldMove: boolean;
  pos: Vector3;
  resetPortal: () => void
}
const PhasedShips = ({ shouldMove, pos, resetPortal }: ShipProps) => {
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

  useEffect(() => {
    //if(phasedShips.filter(ps => ps.stop).length === 0) resetPortal()
  }, [update])

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
          addEnemyShip(mw, 350, new Vector3(0, 0, 0));
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

export const MemoizedPortalScene = React.memo(PortalScene, () => true)