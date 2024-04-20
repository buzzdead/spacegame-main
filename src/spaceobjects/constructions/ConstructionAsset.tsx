import { useFrame } from "@react-three/fiber";
import { useShallowStore } from "../../store/useStore";
import { useAsset } from "../useAsset";

interface Props {
    shouldRender: boolean
}

const ConstructionAsset = ({shouldRender}: Props) => {
    const { ships, addShip } = useShallowStore(["addShip", "ships"])
    const scene = useAsset("/assets/spaceships/fighter.glb", 8)
    scene.position.y = 12    
    scene.position.z = -2
    useFrame(() => {
        scene.children[0].rotation.y += .004
    })
    const handleOnClick = (e: any) => {
        e.stopPropagation()
        addShip("fighter", [3 + ships.length * 15,0,3], 11)
    }
    return shouldRender ? <primitive onClick={handleOnClick} object={scene} /> : null
}

export default ConstructionAsset