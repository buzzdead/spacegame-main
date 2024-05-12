import useStore, { useShallowStore } from "../../store/UseStore";
import { TextureLoader, Vector3 } from "three";
import ShipExplosion from "../../spaceobjects/tools/test/ShipExplosion";
import { useMemo } from "react";

export const ExplosionEffects = () => {
  const { explosions, removeExplosion } = useShallowStore(["explosions", "setExplosions", "removeExplosion"])
  const particle = useMemo(() => {
    return require("./explosion00.png");
  }, []);
  const texture2 = useMemo(() => {
    const p = require('./flame_04.png')
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
