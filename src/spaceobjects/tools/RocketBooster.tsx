import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import { TextureLoader, Vector3 } from "three";

interface Props {
  position: Vector3;
  cruiser?: boolean;
  brake?: boolean;
  isHarvesting?: boolean;
  type?: "default" | "smoke";
}

const PARTICLE_CONFIG = {
  default: { count: 100, size: 3.5, color: 'white', opacity: 0.5, scale: 2, maxLimit: [25, 100], uScale: 1.15},
  smoke: { count: 100, size: 3.5, color: 'whitesmoke', opacity: 0.05, scale: 2, maxLimit: [0, 50], uScale: 1.25},
  harvesting: { count: 100, size: 0.6, color: '#FF5F1F', opacity: 0.25, scale: 0.6, maxLimit: [25, 100], uScale: 1.25},
  cruiser: { count: 100, size: 5.5, color: 'white', opacity: 0.05, scale: 2, maxLimit: [27, 300], uScale: .9850},
};

const vertexShader = `
  attribute float size;
  uniform float uScale;
  attribute vec3 color;
  varying vec3 vColor;
  varying vec2 vUv;
  varying float vAlpha;
  
  void main() {
    vColor = color;
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, uScale);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 1.0 * (1500.0 / -mvPosition.z);
    vAlpha = 1.0;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vUv;
  uniform sampler2D uTexture;  

  void main() {
    vec4 texColor = texture2D(uTexture, gl_PointCoord);
    
    // Combine the texture color with the vertex color and alpha
    vec3 finalColor = vColor * texColor.rgb;
    float finalAlpha = vAlpha * texColor.a;

    gl_FragColor = vec4(finalColor, finalAlpha * .6);
  }
`;

const useParticleSystem = (config: typeof PARTICLE_CONFIG.default) => {
  const particleSystemRef = useRef<THREE.Points>(null);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(config.count * 3);
    for (let i = 0; i < config.count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 0.3;
      positions[i + 1] = 0;
      positions[i + 2] = (Math.random() - 0.5) * 0.2;
    }
    return positions;
  }, [config.count]);

  

  const updateParticles = useCallback((brake: boolean) => {
    if (particleSystemRef.current) {
      const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.035;
        const maxLimit = Math.random() * (config.maxLimit[1] - config.maxLimit[0]) + config.maxLimit[0];
        if ((positions[i + 1] > maxLimit / 55) || brake) {
          positions[i] = (Math.random() - 0.5) * 0.3;
          positions[i + 1] = 0;
          positions[i + 2] = (Math.random() - 0.5) * 0.2;
        }
      }
      particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [config.maxLimit]);

  return { particleSystemRef, particlePositions, updateParticles };
};

const RocketBooster = ({ position, brake = false, isHarvesting = false, cruiser = false, type = "default" }: Props) => {
  const config = isHarvesting ? PARTICLE_CONFIG.harvesting :
                 cruiser ? PARTICLE_CONFIG.cruiser :
                 type === "smoke" ? PARTICLE_CONFIG.smoke :
                 PARTICLE_CONFIG.default;

  const { particleSystemRef, particlePositions, updateParticles } = useParticleSystem(config);

  const text = type === "smoke" ? "./assets/fire.png" : 
  isHarvesting ? "./assets/fire.jpg" : 
  cruiser ? './assets/particle.png' : 
  "./assets/fire1.png"

  const texture = useTexture(text);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('red') },
        uTexture: { value: new TextureLoader().load(text)},
        opacity: { value: config.opacity },
        maxHeight: { value: config.maxLimit[1] / 55 },
        brake: { value: brake ? 1.0 : 0.0 },
        uScale: {value: config.uScale},
      },
      
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [config, texture, brake]);

  useFrame((state) => {
    if (particleSystemRef.current) {
      shaderMaterial.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  useFrame(() => updateParticles(brake));

return (
    <group position={position} rotation={[-1.55, 0, 0]}>
      <points scale={config.scale} ref={particleSystemRef} material={shaderMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={config.count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={particlePositions}
            count={config.count}
            itemSize={1}
          />
        </bufferGeometry>
      </points>
    </group>
  );
};

export default RocketBooster;