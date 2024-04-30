import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

interface Props {
  position: Vector3;
}



const _VS = /*glsl*/`
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute float blend;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;
varying float vBlend;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 125.0;

  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
  vBlend = blend;
}`;

const _FS = /*glsl*/`

uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;
varying float vBlend;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
  gl_FragColor.xyz *= gl_FragColor.w;
  gl_FragColor.w *= vBlend;
}`;

export const Explosion = ({ position }: Props) => {
  const { camera } = useThree()
  const particleSystemRef = useRef<THREE.Points>(null);
  const colors = [
    new THREE.Color("#ea5104"),
    new THREE.Color("#470b04"),
    new THREE.Color("#a40e04"),
    new THREE.Color("#fb7604"),
    new THREE.Color("#740a04"),

    new THREE.Color("#fca204"),
    new THREE.Color("#ba0b04"),
    new THREE.Color("#a40e04"),
    new THREE.Color("#cb2004"),
    new THREE.Color("#c93204"),
  ];

  const particleColors = new Float32Array(3900 * 3);
  for (let i = 0; i < 3900; i++) {
    const colorIndex = Math.floor(Math.random() * colors.length);
    particleColors[i * 3] = colors[colorIndex].r;
    particleColors[i * 3 + 1] = colors[colorIndex].g;
    particleColors[i * 3 + 2] = colors[colorIndex].b;
  }
  const [particlePositions, setParticlePositions] = useState<Float32Array>();

  const texture = useTexture("/assets/particle.png");
  
  const pointMultiplier = useMemo(() => {
    const distance = position.distanceTo(camera.position);
    const zoom = camera.zoom;
    return 1000.0 * (10.0 / distance) * (1.0 / zoom);
  }, [position, camera]);
  useEffect(() => {
    const initializeParticles = () => {
      const positions = new Float32Array(3900 * 3);
      for (let i = 0; i < 6900; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }
      setParticlePositions(positions);
    };
    initializeParticles();
  }, []);

  useFrame(() => {
    const updateParticles = () => {
      if (
        particleSystemRef.current &&
        particleSystemRef.current.geometry.attributes.position &&
        particleSystemRef.current.geometry.attributes.velocity
      ) {
        const positions = particleSystemRef.current.geometry.attributes.position
          .array as Float32Array;
        const velocities = particleSystemRef.current.geometry.attributes
          .velocity.array as Float32Array;
        

        for (let i = 0; i < positions.length; i += 3) {
          // Calculate the direction from the center of the explosion
          const direction = new Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          ).normalize();
          // Apply a force in the direction of the explosion
          velocities[i] += direction.x * 0.00005 + (Math.random() - 0.5) * 0.0001;
          velocities[i + 1] +=
            direction.y * 0.00005 + (Math.random() - 0.5) * 0.0001;
          velocities[i + 2] +=
            direction.z * 0.00005 + (Math.random() - 0.5) * 0.0001;

           
          // Update the position of the particle
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          const material = particleSystemRef.current.material;
         
          // Check if the particle has reached the edge of the explosion
          const maxLimit = 1.5;
          if (
            Math.abs(positions[i]) > maxLimit) { positions[i] = 0; velocities[i] = 0;}
            if(Math.abs(positions[i + 1]) > maxLimit) { positions[i + 1] = 0; velocities[i + 1] = 0;}
            if(Math.abs(positions[i + 2]) > maxLimit) { positions[i + 2] = 0; velocities[i + 2] = 0;}
          
            
              // Gradually darken the color over time
              particleColors[i] *= 0.98; // red component
              particleColors[i + 1] *= 0.98; // green component
              particleColors[i + 2] *= 0.98; // blue component
            
        
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate =
          true;
        particleSystemRef.current.geometry.attributes.velocity.needsUpdate =
          true;
          particleSystemRef.current.geometry.attributes.colour.needsUpdate = true;
      }
    };
    updateParticles();
  });

  if (!particlePositions) return null;

  return (
    <group position={position}>
      <points scale={5} ref={particleSystemRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={(particlePositions?.length || 3) / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-velocity"
            array={new Float32Array(3900 * 3)} // Initialize with zeros
            count={(1500 * 3) / 3}
            itemSize={3}
          />
          <bufferAttribute
          attach="attributes-colour"
          array={particleColors}
          count={(particleColors?.length || 3) / 3}
          itemSize={3}
        />
       
        </bufferGeometry>
        <shaderMaterial
          uniforms = {{
            diffuseTexture: {
                value: texture
            },
            pointMultiplier: {
                value: pointMultiplier
            }
        }}
          vertexShader={_VS}
          fragmentShader={_FS}
          transparent
          depthWrite={false}
          depthTest
          vertexColors
          blendEquation={THREE.AddEquation}
          blendSrc={THREE.OneFactor}
          blendDst={THREE.OneMinusSrcAlphaFactor}
          blending={THREE.CustomBlending}
        />
      </points>
    </group>
  );
};
// SrcColorFactor ConstantColorFactor
export default Explosion;
