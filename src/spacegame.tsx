import React, { useEffect } from "react";
import useStore from "./store/useStore";
import { Canvas } from "@react-three/fiber";
import { Typography } from 'antd';
import CelestialObject from "./spaceobjects/CelestialObject";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import {
  AccumulativeShadows,
  OrbitControls,
  RandomizedLight,
  Stars,
} from "@react-three/drei";

import Ship from "./spaceobjects/Ship";
import Construction from "./spaceobjects/Construction";

interface Props {
  startPlanet: "planet1" | "planet2" | "planet3" | "planet5" | "planet6";
  startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const SpaceGame: React.FC<Props> = ({ startPlanet, startShip }) => {
  const store = useStore()
  useEffect(() => {
    store.addCelestialObject(startPlanet, [-55, 0, -20], 50)
    store.addCelestialObject("asteroid", [0,5,0], 0.01)
    store.addCelestialObject("asteroid-minerals", [34, 5, 3])
    store.addCelestialObject("asteroid-minerals", [34, 5, 6])
    store.addCelestialObject("asteroid-minerals", [34, 5, 9])
    store.addCelestialObject("asteroid-minerals", [34, 5, 12])
    store.addCelestialObject("blackhole", [-166, 3, 246], 9)
    store.addShip(startShip, [8,1,0], 0.004)
    store.addShip(startShip, [10,2,0], 0.004)
    store.addShip(startShip, [12,3,0], 0.004)
    store.addConstruction("spacestation3", [14, 0, 34], 0.055)
    store.addConstruction("spacestation2", [24, 6, 64], 0.055)
  }, [])

  const aspect = window.innerWidth / window.innerHeight;
  const zoom = 100; // Adjust as needed for starfield density

  const frustumHeight = 2 * zoom; // Assuming zoom behaves similarly to FOV
  const frustumWidth = frustumHeight * aspect;

  const left = -frustumWidth;
  const right = frustumWidth;
  const top = frustumHeight;
  const bottom = -frustumHeight;
  return (
    <div>
      <div style={{position: 'absolute', zIndex: 8123781237812, bottom: 25, left: 25}}>
        <Typography style={{color: 'green'}}>Selected: {store.destination}</Typography>
        <Typography style={{color: 'green'}}>Origin: {store.origin}</Typography>
      </div>
    <Canvas
      camera={{
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        far: 40000,
        near: 0.1,
      }}
      style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}
    >
      <EffectComposer>
        <Bloom
          intensity={0.2}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.5}
        />

        <spotLight
          position={[0, 15, 0]}
          angle={30}
          penumbra={5}
          castShadow
          intensity={0.5}
          shadow-bias={-0.0001}
        />
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.5} />
        <Stars radius={5000} count={1500} factor={4} saturation={1} />

        <OrbitControls />

        <AccumulativeShadows
          position={[0, -1.16, 0]}
          frames={100}
          alphaTest={0.9}
          scale={10}
        >
          <RandomizedLight
            amount={8}
            radius={55}
            ambient={0.5}
            position={[1, 5, -1]}
          />
        </AccumulativeShadows>
      </EffectComposer>

      {store.celestialObjects.map((co) => (
        <CelestialObject key={co.id} celestialObject={co} />
      ))}
      {store.ships.map((ship) => (
        <Ship key={ship.id} ship={ship} />
      ))}
      {store.constructions.map((c) => (
        <Construction key={c.id} construction={c} />
      ))}
    </Canvas>
    </div>
  );
};

export default SpaceGame;
