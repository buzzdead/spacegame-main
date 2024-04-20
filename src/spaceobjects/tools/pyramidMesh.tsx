import {
  Vector3,
  Mesh,
  MeshPhongMaterial,
  ConeGeometry,
  BoxGeometry,
  ShaderMaterial,
  ColorRepresentation} from "three";
import glowVertexShader from '../shaders/glowVertexShader'
import glowFragmentShader from '../shaders/glowFragmentShader'
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
interface Props {
    color: ColorRepresentation | string
    position: Vector3
    fireIcon?: boolean
    handleFire?: () => void
}

const SelectedIcon = ({color, position, fireIcon = false, handleFire}: Props) => {
    const geometry = fireIcon ? new BoxGeometry(1.5, 1.25 , 4) :  new ConeGeometry(0.25, 1, 4); // Radius, height, number of sides = 4
    const material = new MeshPhongMaterial({ color: color, opacity: fireIcon ? 0.05 : 1, transparent: fireIcon ? true : false });
    const vertexShader = glowVertexShader;
    //const time = useTimer()
  
    const fragmentShader = glowFragmentShader;
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 2 },
      },
    });
    const pyramidMesh = new Mesh(geometry, material);
    pyramidMesh.position.set(position.x, position.y, position.z)
    pyramidMesh.rotation.x = 3.22
   
    const handleClick = (e: any) => {
      e.stopPropagation()
      fireIcon && handleFire && handleFire()

    }
    return <primitive onClick={handleClick} object={pyramidMesh} />
}

const useTimer = () => {
  const [time, setTime] = useState(0.0);
  useFrame(() => {
    setTime(time + 5);
  });
  return time;
};

export default SelectedIcon