import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import useStore from "../store/useStore";

interface Props {
    shouldRender: boolean
}

const ConstructionAsset = ({shouldRender}: Props) => {
    let i = 1
    const store = useStore()
    const { scene } = useGLTF("/assets/spaceships/fighter.glb")
    const theScene = scene.clone()

    theScene.scale.set(4, 4, 4)
    theScene.position.y = 18
    theScene.position.z = -8
    useFrame(() => {
        theScene.rotation.y += .004
    })
    const handleOnClick = () => {
        store.addShip("fighter", [3 + store.ships.length * 15,0,3], 11)
        i += 1
    }
    return shouldRender ? <primitive onClick={handleOnClick} object={theScene} /> : null
}

export default ConstructionAsset