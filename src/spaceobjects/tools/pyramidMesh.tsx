import {
  Vector3,
  Mesh,
  MeshPhongMaterial,
  ConeGeometry,
  BoxGeometry,
  SphereGeometry,
  ColorRepresentation} from "three";

interface Props {
    color: ColorRepresentation | string
    position: Vector3
    fireIcon?: boolean
    handleFire?: () => void
}

const SelectedIcon = ({color, position, fireIcon = false, handleFire}: Props) => {
    const geometry = fireIcon ? new BoxGeometry(0.5, 1.25 , 1, 2) :  new ConeGeometry(0.25, 1, 4); // Radius, height, number of sides = 4
    const material = new MeshPhongMaterial({ color: color });
    const pyramidMesh = new Mesh(geometry, material);
    pyramidMesh.position.set(position.x, position.y, position.z)
    pyramidMesh.rotation.x = 3.22
    const handleClick = (e: any) => {
      e.stopPropagation()
      fireIcon && handleFire && handleFire()

    }
    return <primitive onClick={handleClick} object={pyramidMesh} />
}

export default SelectedIcon