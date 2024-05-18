import useStore, { useShallowStore } from "../../store/UseStore";
import { TextureLoader, Vector3 } from "three";
import ShipExplosion, { ShipBeam } from "../../spaceobjects/tools/test/ShipExplosion";
import { useMemo } from "react";

export const ExplosionEffects = () => {
  const { explosions, removeExplosion, enemyShips } = useShallowStore(["explosions", "setExplosions", "removeExplosion", "enemyShips"])
  const particle = useMemo(() => {
    return require("./explosion00.png");
  }, []);
  const texture2 = useMemo(() => {
    const p = require('./flame_04.png')
    return new TextureLoader().load(p);
  }, [])
  const texture3 = useMemo(() => {
    const p = require('./light_01.png')
    return new TextureLoader().load(p);
  }, [])
  const texture = useMemo(() => {
    return new TextureLoader().load(particle);
  }, []);
  return (
    <group>
      {explosions.map((e) => (
        <ShipExplosion
          onEnd={() => removeExplosion(e.id)}
          texture={e.size === "Small" ? texture2 : texture}
          key={e.id}
          explosion={e}
        />
      ))}
    </group>
  );
};
