import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const Electricity2 = ({ count = 1000, color = '#4488ff', radius = 2.5 }) => {
  const particles = useRef<any>(null)

  const [positions, sizes, phases, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = (Math.random() * 0.5 + 0.5) * (Math.random() < 0.5 ? 1 : -1)
      sizes[i] = 0.05
    }

    return [positions, sizes, phases, speeds]
  }, [count, radius])
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const positionArray = particles.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const phase = phases[i] * 10
      const speed = speeds[i] * 10
      
      const t = (time * speed + phase) % (Math.PI * 2)
      const latitude = Math.sin(t * .10) * Math.PI / 2 
      const longitude = t + time * 15

      positionArray[i3] = Math.cos(latitude) * Math.sin(longitude) * radius
      positionArray[i3 + 1] = Math.sin(latitude) * radius
      positionArray[i3 + 2] = Math.cos(latitude) * Math.cos(longitude) * radius
    }

    particles.current.geometry.attributes.position.needsUpdate = true
    particles.current.material.uniforms.time.value = time
  })
  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach={'attributes-position'}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach={'attributes-size'}
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
       
        depthWrite={false}
        transparent
        uniforms={{
          color: { value: new THREE.Color(color) },
          time: { value: 0 },
        }}
        vertexShader={`
          attribute float size;
          varying float vSize;
          void main() {
            vSize = size;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (3000.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float time;
          varying float vSize;
          
          void main() {
            vec2 uv = gl_PointCoord * 2.0 - 1.0;
            float r = length(uv);
            if (r > 1.0) discard;
            
            float alpha = (1.0 - r) * (0.8 + 0.2 * sin(time * 20.0 + vSize * 50.0));
            gl_FragColor = vec4(color, alpha * 0.6);
          }
        `}
      />
    </points>
  )
}