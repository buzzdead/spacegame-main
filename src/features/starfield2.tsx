import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { Mesh, SphereGeometry, MeshBasicMaterial } from 'three'

export const Starfield2 = () => {
  const { camera, scene, gl } = useThree();
  const [stars, setStars] = useState<Mesh[]>([]);
  const starCount = 1000;

  useEffect(() => {
    
    const geometry = new SphereGeometry(0.25, 16, 16);
    const material = new MeshBasicMaterial({ color: '#ffffff' });

    for (let i = 0; i < starCount; i++) {
      const star = new Mesh(geometry, material);
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      star.position.set(x, y, z);
      stars.push(star);
      scene.add(star);
    }
    return () => {
      stars.forEach((star) => scene.remove(star));
      setStars([]);
    };
  }, []);

  useFrame(() => {
    camera.position.z = 50;
    stars.forEach((star, index) => {
      star.position.z -= 1;
      if (star.position.z < -150) {
        star.position.z = 150;
      }
    });
  });

  return (
    <group>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {stars.map((star, index) => (
        <mesh key={index} position={star.position}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color={'#ffffff'} />
        </mesh>
      ))}
    </group>
  );
};