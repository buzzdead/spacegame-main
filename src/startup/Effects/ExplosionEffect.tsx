import useStore, { useShallowStore } from "../../store/UseStore";
import { TextureLoader, Vector3 } from "three";
import ShipExplosion from "../../spaceobjects/tools/test/ShipExplosion";
import { useMemo } from "react";

export const ExplosionEffects = () => {
  const { explosions, removeExplosion } = useShallowStore(["explosions", "setExplosions", "removeExplosion"])
  const particle = useMemo(() => {
    return require("./explosion00.png");
  }, []);

  const texture = useMemo(() => {
    return new TextureLoader().load(particle);
  }, []);

  return (
    <group>
      {explosions.map((e) => (
        <ShipExplosion
          onEnd={() => removeExplosion(e.id)}
          texture={texture}
          key={e.id}
          explosion={e}
        />
      ))}
    </group>
  );
};
