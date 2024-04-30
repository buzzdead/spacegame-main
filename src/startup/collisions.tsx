
import { OrbitControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Vector2 } from 'three'

export const Collisions = () => {
    const {raycaster, camera, scene} = useThree();
    const [isClose, setIsClose] = useState(false)
    useFrame(() => {
      
    })
    const handleMouseMove = (event: any) => {
        const mousePosition = new Vector2();
        mousePosition.x = event.clientX / window.innerWidth * 2 - 1;
        mousePosition.y = event.clientY / window.innerHeight * 2 - 1;
    
        raycaster.setFromCamera(mousePosition, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
          if(intersects[0].distance < 10 && !isClose) setIsClose(true)
            if(intersects[0].distance > 10 && isClose) setIsClose(false)
        }
      };
      useEffect(() => {
        window.addEventListener('wheel', handleMouseMove)
        window.addEventListener('touchmove', handleMouseMove)
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('wheel', handleMouseMove)
          window.addEventListener('touchmove', handleMouseMove)
        };
      }, [handleMouseMove]);
      return  <OrbitControls panSpeed={isClose ? 0.01 : 0.5} zoomSpeed={isClose ? 0.01 : 1} rotateSpeed={isClose ? 0.01 : 0.35} onPointerMove={handleMouseMove}/>
}