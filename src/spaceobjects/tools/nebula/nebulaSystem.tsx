import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';
import UseSoundEffect from '../../../hooks/SoundEffect';
import { ExplosionSize } from '../../../store/storeSlices/useEffects';
import { Particle } from 'three-nebula-types';
import { createLightningStrike, createShipBeam, createShipExplosion, createSmokeSphere } from './nebulaEffects';



// Usage in your React component
interface Props {
    explosion: {pos: THREE.Vector3, size: ExplosionSize}
    texture: THREE.Texture
    onEnd: () => void
}
export const ShipExplosion = ({ explosion, texture, onEnd }: Props) => {
  const { scene } = useThree();
  const [particleSystem, setParticleSystem] = useState<any>()
  const psRef = useRef<any>()
  const stopEmit = useRef(false)
  const reallyStopEmit = useRef(false)
  const { sound: explosionSound, calculateVolume: calculateExplosionSound } =
  UseSoundEffect({
    sfxPath: explosion.size === "Small" ? "/assets/sounds/missile-explosion.mp3" : "/assets/sounds/explo.mp3",
    minVolume: 0.75,
    autoPlay: true,
    position: explosion.pos
  });

  useFrame(() => {
    if (particleSystem && !reallyStopEmit.current) {
      if(stopEmit.current) {
        if(particleSystem.emitter.life > 100)
        particleSystem.emitter.life = 100
        else {
          particleSystem.emitter.life -= 2.5
      }
     
      }
        
        particleSystem.update();
        if(particleSystem.emitter.life < -125) {onEnd(); reallyStopEmit.current = true}
      
    }
  });

  useEffect(() => {
    calculateExplosionSound(explosion.pos);
  }, [scene.position]);

  useEffect(() => {
    createShipExplosion(scene, texture, explosion.size).then((nebulaSystem) => {
      setParticleSystem(nebulaSystem)
      psRef.current = nebulaSystem
      nebulaSystem.setPosition(explosion.pos);
      nebulaSystem.setDirection(new THREE.Vector3(0, 0, 1));
    });
    
    setTimeout(() => stopEmit.current = true, 1250)
    // Cleanup function to destroy the particle system when the component unmounts
    return(() => {
      const emitter = psRef.current.emitter
      emitter.stopEmit();
                emitter.particles.forEach((particle: Particle) => {
                    emitter.parent && emitter.parent.dispatch("PARTICLE_DEAD", particle);
                    emitter.bindEmitterEvent && emitter.dispatch("PARTICLE_DEAD", particle);
                    emitter.parent.pool.expire(particle.reset());
                });
                emitter.particles.length = 0;
    })
  }, [scene, explosion.pos]);

  return null;
};

export default ShipExplosion;

interface BeamProps {
  position: THREE.Vector3
  texture: THREE.Texture
  rotation: THREE.Vector3
}

type ParticleSys = {
  createSystem: (scene: any, texture: any, size?: any, dst?: number) => Promise<any>,
  position: any,
  texture: any,
  size?: any,
  rotation?: any,
  updateFn?: (particleSystem: any, position: any, rotation?: any) => void
  decay?: number
  dst?: number
}

const useParticleSystem = ({createSystem, position, texture, size, rotation, updateFn, decay, dst}: ParticleSys) => {
  const { scene } = useThree();
  const [particleSystem, setParticleSystem] = useState<any>();
  const psRef = useRef<any>();

  useFrame((state, delta) => {
    if(decay && particleSystem?.emitter) {if(particleSystem.emitter.life > 100) particleSystem.emitter.life = 100; else particleSystem.emitter.life -= decay;}
    if (particleSystem) {
      if (updateFn) {
        updateFn(particleSystem, position, rotation);
      } else {
        particleSystem.update();
      }
    }
  });

  useEffect(() => {
    createSystem(scene, texture, size, dst).then((nebulaSystem) => {
      setParticleSystem(nebulaSystem);
      if(updateFn) updateFn(nebulaSystem, position, rotation)
      else nebulaSystem.setPosition(position);
      psRef.current = nebulaSystem;
    });

    return () => {
      const emitter = psRef.current.emitter;
      emitter.stopEmit();
      emitter.particles.forEach((particle: Particle) => {
        emitter.parent && emitter.parent.dispatch("PARTICLE_DEAD", particle);
        emitter.bindEmitterEvent && emitter.dispatch("PARTICLE_DEAD", particle);
        emitter.parent.pool.expire(particle.reset());
      });
      emitter.particles.length = 0;
    };
  }, [scene]);

  return null;
};


export const SmokeSphere = ({ position, texture, size = "Large", decay }: Omit<BeamProps, "rotation"> & { size?: "Small" | "Large", decay?: number }) => {
  
  return useParticleSystem({createSystem: createSmokeSphere, position, texture, size, decay: decay});
};

export const LightningStrike = ({ position, texture }: Omit<BeamProps, "rotation">) => {
  return useParticleSystem({createSystem: createLightningStrike, position, texture});
};

export const ShipBeam = ({ position, texture, rotation, dst }: BeamProps & {dst?: number}) => {
  const updateFn = (particleSystem: any, position: any, rotation: any) => {
    particleSystem.updatePosition(position, rotation);
    particleSystem.updateRotation(rotation);
    particleSystem.update();
  };
  return useParticleSystem({createSystem: createShipBeam, position, texture, rotation, updateFn, dst: dst});
};
