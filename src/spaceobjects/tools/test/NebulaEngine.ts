import * as THREE from "three";
import Nebula, { Alpha, Emitter, PointZone, Position, RadialVelocity, Radius, Rate, Scale, SpriteRenderer, Vector3D, Velocity, Color, Life, Rotate, Force } from "three-nebula";

export type NebulaSystem = {
    update: () => void
}

class NebulaEngine {

    update(nebulaSystem : NebulaSystem) {
       nebulaSystem.update();
    }

    async loadSystem(json: JSON, scene: THREE.Scene) : Promise<Nebula> {
        const loaded = await Nebula.fromJSONAsync(json, THREE, undefined);
        //loaded.emitters[0].setRotation(new THREE.Vector3(0, 90, 0))
        //loaded.emitters[0].addBehaviour(new Force(0,0,0))
        
        const velocity = new RadialVelocity(100, new Vector3D(1, 0, 0), 0, true);
        //@ts-ignore
        //const initializer = loaded.emitters[0].initializers.find(e => e.type === "Radius")
        //loaded.emitters[0].removeInitializer(initializer)
      
        
        //loaded.emitters[0].addInitializer(new Radius(2,2))
  
        const nebulaRenderer = new SpriteRenderer(scene, THREE);
        
        return loaded.addRenderer(nebulaRenderer);
    }
}

export default new NebulaEngine();