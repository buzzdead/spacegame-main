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
  BodySprite,
  PointZone,
  Alpha,
  Body,
  Mass,
  Radius,
} from 'three-nebula';

async function createBeamWeapon(scene: THREE.Scene, texture: THREE.Texture) {
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
  .setRate(new Rate(new Span(3, 6), new Span(0.3)))
  .setInitializers([
    new Position(zone),
    new Mass(1),
    new Radius(5, 12),
    new Life(0.85),
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

// Usage in your React component
interface Props {
    position: THREE.Vector3
    texture: THREE.Texture
}
export const BeamWeapon = ({ position, texture }: Props) => {
  const { scene } = useThree();
  const [particleSystem, setParticleSystem] = useState<any>()
  const stopEmit = useRef(false)

  useFrame(() => {
    if (particleSystem) {
      if(stopEmit.current) {
        if(particleSystem.emitter.life > 100)
        particleSystem.emitter.life = 100
        else {
          particleSystem.emitter.life -= 2.5
      }
     
      }
        
        particleSystem.update();
      
    }
  });

  useEffect(() => {
    createBeamWeapon(scene, texture).then((nebulaSystem) => {
      setParticleSystem(nebulaSystem)
      nebulaSystem.setPosition(position);
      nebulaSystem.setDirection(new THREE.Vector3(0, 0, 1));
    });
    setTimeout(() => stopEmit.current = true, 1000)
    // Cleanup function to destroy the particle system when the component unmounts
    return () => {
      if (particleSystem) {
        
        particleSystem.sys.update();
        particleSystem.sys.destroy();
        delete particleSystem.sys

      }
    };
  }, [scene, position]);

  return null;
};

export default BeamWeapon;