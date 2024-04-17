import {
  Vector3,
  Mesh,
  MeshPhongMaterial,
  ConeGeometry,
  ColorRepresentation} from "three";

interface Props {
    color: ColorRepresentation | string
    position: Vector3
}

const SelectedIcon = ({color, position}: Props) => {
    const geometry = new ConeGeometry(0.25, 1, 4); // Radius, height, number of sides = 4
    const material = new MeshPhongMaterial({ color: color });
    const pyramidMesh = new Mesh(geometry, material);
    pyramidMesh.position.set(position.x, position.y, position.z)
    pyramidMesh.rotation.x = 3.22
    return <primitive object={pyramidMesh} />
}

export default SelectedIcon