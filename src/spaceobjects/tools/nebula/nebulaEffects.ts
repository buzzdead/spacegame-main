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
  SphereZone,
} from 'three-nebula';
import { ExplosionSize } from '../../../store/storeSlices/useEffects';

export async function createLightningStrike(scene: THREE.Scene, texture: THREE.Texture, size = "Large") {
  const nebula = new Nebula();

  function createSprite() {
    var material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      blendEquation: THREE.MaxEquation,
      blendDst: THREE.OneMinusConstantAlphaFactor,
      blendSrc: THREE.OneFactor,
      blendEquationAlpha: THREE.CustomBlending,
    });
    return new THREE.Sprite(material);
  }

  const zone = new SphereZone(0, 0, 0, size === "Small" ? 25 : 45);
  const emitter = new Emitter()
    .setRate(new Rate(new Span(size === "Small" ? 2 : 2, size === "Small" ? 2 : 3), new Span(0.5, 0.4)))
    .setInitializers([
      new Position(zone),
      new Mass(.1),
      new Radius(size === "Small" ? 1 : 2, size === "Small" ? 2 : 1),
      new Life(size === "Small" ? 0.2 : 0.1),
      new Body(createSprite()),
      new RadialVelocity(2, new Vector3D(0, -1, 0), 360)
    ])
    .setBehaviours([
      new Alpha(1, 0),
      new Scale(2.85, 2.85),
      new Color(new THREE.Color("white"), new THREE.Color("blue"))
    ])
    .emit();

  nebula.addEmitter(emitter);
  const renderer = new SpriteRenderer(scene, THREE);
  nebula.addRenderer(renderer);

  return {
    update: () => nebula.update(),
    setDirection: (direction: THREE.Vector3) => {
      emitter.addInitializer(new RadialVelocity(10, new Vector3D(direction.x, direction.y, direction.z), 360));
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

export async function createSmokeSphere(scene: THREE.Scene, texture: THREE.Texture, size = "Large") {
  const nebula = new Nebula();
  
  function createSprite() {
    var material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      blending: THREE.NormalBlending,
    });
    return new THREE.Sprite(material);
  }
  // To adjust scale, life, alpha...
  const zone = new SphereZone(0, 0, 0, size === "Small" ? 5 : 70);
  const emitter = new Emitter()
    .setRate(new Rate(new Span(size === "Small" ? 2 : 5, size === "Small" ? 5 : 10), new Span(0.1, 0.5)))
    .setInitializers([
      new Position(zone),
      new Mass(1),
      new Radius(size === "Small" ? 2.5 : 10, size === "Small" ? 4 : 6),
      new Life(size === "Small" ? .91 : 18),
      new Body(createSprite()),
      new RadialVelocity(22, new Vector3D(0, 1, 0), 360)
    ])
    .setBehaviours([
      new Alpha(size === "Small" ? 0.35 : 1, 0.45),
      new Scale(size === "Small" ? 2.75 : 1.25, size === "Small" ? 2.75 : 4.25),
      new Color(new THREE.Color("gray"), new THREE.Color("black"))
    ])
    .emit();

  nebula.addEmitter(emitter);
  const renderer = new SpriteRenderer(scene, THREE);
  nebula.addRenderer(renderer);

  return {
    update: () => nebula.update(),
    setDirection: (direction: THREE.Vector3) => {
      emitter.addInitializer(new RadialVelocity(2, new Vector3D(direction.x, direction.y, direction.z), 360));
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

export async function createShipExplosion(scene: THREE.Scene, texture: THREE.Texture, size: ExplosionSize) {
  const nebula = new Nebula();
  function createSprite() {
    var material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xfffff,
      blending: THREE.AdditiveBlending,
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

export async function createShipBeam(scene: THREE.Scene, texture: THREE.Texture, size: ExplosionSize, dst = 70) {
  const nebula = new Nebula();

  function createSprite() {
    const material = new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    return new THREE.Sprite(material);
  }

  const life = dst / 28.57;
  const zone = new PointZone(0, 0, 0);

  const emitter = new Emitter()
    .setRate(new Rate(new Span(5, 2), new Span(0.041, 0.041)))
    .setInitializers([
      new Position(zone),
      new Mass(1),
      new Life(life * 0.8, life * 1.2),
      new Body(createSprite()),
      new Radius(2.5, 4.5),
      new RadialVelocity(30, new Vector3D(0, 0, 1), 0.3),
    ])
    .setBehaviours([
      new Alpha(1, 0),
      new Scale(1.05, .9),
      new Color(new THREE.Color(0x00ffff), new THREE.Color(0xff00ff)),
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
    updateRotation: (rotation: THREE.Vector3) => emitter.setRotation(rotation),
    setIntensity: (intensity: number) => {
      (emitter as any).rate.numerator = intensity * 10;
      (emitter as any).rate.denominator = 0.01;
    }
  };
}