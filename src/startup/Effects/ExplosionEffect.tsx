import { useShallowStore } from "../../store/UseStore";
import {ShipExplosion, SmokeSphere } from "../../spaceobjects/tools/nebula/nebulaSystem";
import { useTexture } from "../../hooks/Texture";

export const ExplosionEffects = () => {
  const { explosions, removeExplosion, enemyShips } = useShallowStore(["explosions", "setExplosions", "removeExplosion", "enemyShips"])
  const explosionTexture = useTexture('explosion00.png')
  const missileExplosionTexture = useTexture('flame_04.png')
  const smokeTexture = useTexture('blackSmoke15.png')

  return (
    <group>
      {explosions.map((e) => (
        <group  key={e.id}>
        <ShipExplosion
          onEnd={() => removeExplosion(e.id)}
          texture={e.size === "Small" ? missileExplosionTexture : explosionTexture}
          key={e.id}
          explosion={e}
        />
               <SmokeSphere size="Small" texture={smokeTexture} position={e.pos} decay={0.65}/>
      </group>
      ))}

    </group>
  );
};
