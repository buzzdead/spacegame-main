import React, { useRef, useState } from "react";
import useStore from "./store/useStore";
import { Canvas, useFrame } from "@react-three/fiber";
import CelestialObject from "./spaceobjects/CelestialObject";
import { LayerMaterial, Color, Depth } from "lamina";
import { BackSide, Group, Object3DEventMap } from "three";

import {
  AccumulativeShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  PerformanceMonitor,
  RandomizedLight,
  Stars,
} from "@react-three/drei";

import Ship from "./spaceobjects/Ship";
import Construction from "./spaceobjects/Construction";

interface Props {
  startPlanet: "planet1" | "planet2" | "planet3";
  startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const SpaceGame: React.FC<Props> = ({ startPlanet, startShip }) => {
  const [degrade, setDegrade] = useState(false);
  const celestialObjects = useStore((state) => state.celestialObjects).filter(
    (co) => co.id === startPlanet || co.id === "asteroid" || co.id === "asteroid-minerals"
  );
  const ships = useStore((state) => state.ships).filter(
    (ship) => ship.id === startShip
  );
  const constructions = useStore((state) => state.constructions).filter(
    (c) => c.id === "spacestation1" || c.id === "spacestation3")

  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}
    >
      <spotLight
        position={[0, 15, 0]}
        angle={30}
        penumbra={5}
        castShadow
        intensity={2}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={1.5} />
      <Stars radius={100} count={500} factor={4} saturation={0} fade={true} />
      <OrbitControls />

      {celestialObjects.map((co) => (
        <CelestialObject celestialObject={co} />
      ))}
      {ships.map((ship) => (
        <Ship ship={ship} />
      ))}
      {constructions.map((c) => (
        <Construction construction={c} />
      ))}
      <AccumulativeShadows
        position={[0, -1.16, 0]}
        frames={100}
        alphaTest={0.9}
        scale={10}
      >
        <RandomizedLight
          amount={8}
          radius={10}
          ambient={0.5}
          position={[1, 5, -1]}
        />
      </AccumulativeShadows>
     
    </Canvas>
  );
};

function Lightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }) {
  const groupRef = useRef<Group<Object3DEventMap>>(null);
  useFrame((state, delta) => {
    if(!groupRef.current) return
    (groupRef.current.position.z += delta * 10) > 20 &&
      (groupRef.current.position.z = -60);
  });
  return (
  
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <LayerMaterial side={BackSide}>
          <Color color="#444" alpha={1} mode="normal" />
          <Depth
            colorA="black"
            colorB="black"
            alpha={0.85}
            mode="multiply"
            near={0}
            far={300}
            origin={[100, 100, 100]}
          />
        </LayerMaterial>
      </mesh>
  );
}

export default SpaceGame;
