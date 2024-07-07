import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const Electricity = ({ count = 1000, color = '#4488ff', radius = 2.5 }) => {
  const particles = useRef<any>(null)

  const [positions, sizes, lifetimes, startPoints, endPoints] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const lifetimes = new Float32Array(count)
    const startPoints = new Float32Array(count * 3)
    const endPoints = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const startAngle = Math.random() * Math.PI * 2
      const endAngle = startAngle + (Math.random() * Math.PI - Math.PI / 2)
      
      startPoints[i * 3] = Math.sin(startAngle) * Math.cos(startAngle * 0.5) * radius
      startPoints[i * 3 + 1] = Math.cos(startAngle) * radius
      startPoints[i * 3 + 2] = Math.sin(startAngle) * Math.sin(startAngle * 0.5) * radius

      endPoints[i * 3] = Math.sin(endAngle) * Math.cos(endAngle * 0.5) * radius
      endPoints[i * 3 + 1] = Math.cos(endAngle) * radius
      endPoints[i * 3 + 2] = Math.sin(endAngle) * Math.sin(endAngle * 0.5) * radius

      positions.set(startPoints.slice(i * 3, i * 3 + 3), i * 3)
      sizes[i] = Math.random() * 0.1 + 0.05
      lifetimes[i] = Math.random()
    }

    return [positions, sizes, lifetimes, startPoints, endPoints]
  }, [count, radius])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const positionArray = particles.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      lifetimes[i] -= 0.02
      if (lifetimes[i] <= 0) {
        lifetimes[i] = Math.random() * 0.2 + 0.8
        startPoints[i3] = endPoints[i3]
        startPoints[i3 + 1] = endPoints[i3 + 1]
        startPoints[i3 + 2] = endPoints[i3 + 2]

        const newEndAngle = Math.random() * Math.PI * 2
        endPoints[i3] = Math.sin(newEndAngle) * Math.cos(newEndAngle * 0.5) * radius
        endPoints[i3 + 1] = Math.cos(newEndAngle) * radius
        endPoints[i3 + 2] = Math.sin(newEndAngle) * Math.sin(newEndAngle * 0.5) * radius
      }

      const progress = 1 - lifetimes[i]
      positionArray[i3] = startPoints[i3] + (endPoints[i3] - startPoints[i3]) * progress
      positionArray[i3 + 1] = startPoints[i3 + 1] + (endPoints[i3 + 1] - startPoints[i3 + 1]) * progress
      positionArray[i3 + 2] = startPoints[i3 + 2] + (endPoints[i3 + 2] - startPoints[i3 + 2]) * progress
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
        blending={THREE.AdditiveBlending}
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
            gl_PointSize = size * (300.0 / -mvPosition.z);
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
            gl_FragColor = vec4(color, alpha * 0.7);
          }
        `}
      />
    </points>
  )
}