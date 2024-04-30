import * as THREE from 'three';
import vertexShader from '../spaceobjects/shaders/shock-wavev'
import fragmentShader from '../spaceobjects/shaders/shock-wave'
import { useRef, useState } from 'react';
class ShockWave {
    constructor(position, options = {}) {
      this.position = new THREE.Vector3(155, 55, 55);
      this.speed =  0.1;
      this.maxRadius =  11.0;
      this.waveSize = 0.3;
      this.amplitude =  0.15;
      this.time = 0.0;
      this.active = false;
    }
  
    explode() {
      this.time = 0.0;
      this.active = true;
    }
  
    update(delta) {
      const waveSize = this.waveSize;
      this.time += delta * this.speed;
      const radius = this.time - waveSize;
      if (radius >= (this.maxRadius + waveSize) * 2.0) {
        this.active = false;
      }
    }
  }
  

const ShockWaveMaterial = new THREE.ShaderMaterial({
  uniforms: {
    active: new THREE.Uniform(false),
    center: new THREE.Uniform(new THREE.Vector2(0.5, 0.5)),
    cameraDistance: new THREE.Uniform(1.0),
    size: new THREE.Uniform(1.0),
    color: 'green',
    radius: new THREE.Uniform(-2),
    maxRadius: new THREE.Uniform(2),
    waveSize: new THREE.Uniform(2),
    amplitude: new THREE.Uniform(2),
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
});

export const ShockWaveConst = () => {
  const [shockwaves, setShockwaves] = useState([]);
  const ref = useRef()
  function handleShockwave(position, options = {}) {
    // Create a new ShockWave instance with position and optional options
    const newShockwave = new ShockWave(position, options);
  
    // Trigger the explosion (activate the shockwave)
    newShockwave.explode();
    setTimeout(() => newShockwave.explode(), 1000)
  
    // Update the shockwaves state with the new instance
    setShockwaves(prevShockwaves => [...prevShockwaves, newShockwave]);
  }
const meshes = shockwaves.map((shockwave, index) => {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), ShockWaveMaterial);
  mesh.position.copy(shockwave.position);
  shockwave.update(0.1); // Update initially
  return mesh;
});

if(shockwaves.length === 0) handleShockwave([155, 55, 55], { speed: 3.0, amplitude: 0.1 })
return (<group>{meshes.map((mesh, index) => (
  <mesh key={index} ref={ref} material={ShockWaveMaterial}>
    {shockwaves[index].active && <planeGeometry args={[1, 1]} />}
  </mesh>
))} </group>)
}