import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';
import Nebula, {
  SpriteRenderer,
  Emitter,
  Rate,
  Span,
  Position,
  RadialVelocity,
  Vector3D,
  Color,
  Life,
  Scale,
  PointZone,
  Alpha,
  Body,
  Mass,
  Radius,
} from 'three-nebula';
import UseSoundEffect from '../../../hooks/SoundEffect';
import { ExplosionSize } from '../../../store/useEffects';
import { Particle } from 'three-nebula-types';

async function createShipExplosion(scene: THREE.Scene, texture: THREE.Texture, size: ExplosionSize) {
  const nebula = new Nebula();
  function createSprite() {
    var material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xfffff,
      blending: THREE.AdditiveBlending,
      fog: true
    });
    return new THREE.Sprite(material);
}

const zone = new PointZone(0, 0);
  const emitter = new Emitter()
  .setRate(new Rate(new Span(size === "Small" ? 1 : 3, size === "Small" ? 3 : 6), new Span(size === "Small" ? 0.01  : 0.5)))
  .setInitializers([
    new Position(zone),
    new Mass(1),
    //new Radius(size === "Big" ? 5 : 2.5, size ==="Big" ? 12 : 6),
    new Radius(5, 12),
    new Life(size === "Small" ? .75 : 0.85),
    new Body(createSprite()),
    new RadialVelocity(13, new Vector3D(0, 1, 0), 360)
  ])
  .setBehaviours([new Alpha(1, 0), new Scale(1.5, 2), new Color(new THREE.Color("white"), new THREE.Color("red"))])
  .emit();

  nebula.addEmitter(emitter);
  const renderer = new SpriteRenderer(scene, THREE)
  nebula.addRenderer(renderer);

  return {
    update: () => nebula.update(),
    setDirection: (direction: THREE.Vector3) => {
      emitter.addInitializer(new RadialVelocity(13, new Vector3D(direction.x, direction.y, direction.z), 360))
    },
    setPosition: (position: THREE.Vector3) => {
      emitter.position.set(position.x, position.y, position.z);
    },
    sys: nebula,
    emitter: emitter,
    renderer: renderer,
    onExit: () => nebula.destroy()
  };
}

async function createShipBeam(scene: THREE.Scene, texture: THREE.Texture,) {
  const nebula = new Nebula();

  function createSprite() {
    var material = new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      blendEquation: THREE.AddEquation,
      blendDst: THREE.OneMinusConstantAlphaFactor,
      blendSrc: THREE.OneFactor,
      blendEquationAlpha: THREE.CustomBlending,
    });
    return new THREE.Sprite(material);
  }
  
  const zone = new PointZone(0, 0, 0);
  const emitter = new Emitter()
    .setRate(new Rate(new Span(1, 1), new Span(0.01, 0.01)))
    .setInitializers([
      new Position(zone),
      new Mass(1),
      new Life(2.95, 3.15),
      new Body(createSprite()),
      new Radius(1.282, 1.282),
      new RadialVelocity(22.5, new Vector3D(0, 0, 1), 1),
    ])
    .setBehaviours([
      new Alpha(9, 19),
      new Color(new THREE.Color("red"), new THREE.Color("#FF3131")),
      new Scale(1.25),
      
      
    ])
    .emit();

  nebula.addEmitter(emitter);
  const renderer = new SpriteRenderer(scene, THREE);
  nebula.addRenderer(renderer);
  return {
    update: (delta: number) => nebula.update(delta),
    onExit: () => nebula.destroy(),
    emitter: emitter,
    updatePosition: (position: THREE.Vector3, rotation: THREE.Euler) => {
      const offset = new THREE.Vector3(0, 0, 25);
      offset.applyEuler(rotation);
      emitter.position.set(position.x + offset.x, position.y + offset.y, position.z + offset.z);
    },
    updateRotation: (rotation: THREE.Vector3) => emitter.setRotation(new THREE.Vector3(rotation.x, rotation.y, rotation.z))
  };
}

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
    autoPlay: true
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
    calculateExplosionSound(scene.position);
  }, []);

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
export const ShipBeam = ({position, texture, rotation}: BeamProps) => {
  const { scene, camera } = useThree()
  const [particleSystem, setParticleSystem] = useState<any>()
  const psRef = useRef<any>()
  useFrame(() => {
    if (particleSystem) {
        particleSystem.updatePosition(position, rotation)
        particleSystem.updateRotation(rotation)
        particleSystem.update();
      
    }
  });
  useEffect(() => {
    createShipBeam(scene, texture).then((nebulaSystem) => {
      setParticleSystem(nebulaSystem)
      psRef.current = nebulaSystem
    });
    
    
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
    
  }, [scene]);
  return null
}