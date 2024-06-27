import {
  Vector3,
  Mesh,
  MeshPhongMaterial,
  ConeGeometry,
  ColorRepresentation} from "three";

type Icon = { size: "S" | "M" | "L" }

interface Props {
    color: ColorRepresentation | string
    position: Vector3
    size?: Icon["size"]
}

const Sizes: Record<Icon["size"], Vector3> = {
  "S": new Vector3(0.25, 1, 4),
  "M": new Vector3(0.5, 2, 4),
  "L": new Vector3(0.5, 2, 4),
}


const SelectedIcon = ({color, position, size = "S"}: Props) => {
    const geometry = new ConeGeometry(Sizes[size].x, Sizes[size].y, Sizes[size].z); // Radius, height, number of sides = 4
    const material = new MeshPhongMaterial({ color: color, opacity: 1, transparent: false });

    const pyramidMesh = new Mesh(geometry, material);
    pyramidMesh.position.set(position.x, position.y, position.z)
    pyramidMesh.rotation.x = 3.22
   

    return <primitive object={pyramidMesh} />
}

export default SelectedIcon