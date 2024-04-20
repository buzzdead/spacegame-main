import { Center } from "@react-three/drei"
import ConstructionAsset from "./ConstructionAsset"
import { useState } from "react"
import { useFrame } from "@react-three/fiber";
import { spaceShips } from "../../store/storeAssets";

interface Props {
    menu: React.MutableRefObject<boolean>
}

export const Menu = ({menu}: Props) => {
    const ships = spaceShips
    const fighter = ships.find(e => e.id === "fighter")
    const hawk = ships.find(e => e.id === "hawk")
    const [showMenu, setShowMenu] = useState(false)
    useFrame(() => {
        if(showMenu !== menu.current) setShowMenu(menu.current)
    })
    return (
        <Center disableX disableZ disableY><ConstructionAsset glbPath={fighter?.glbPath || ""} shouldRender={showMenu} /><ConstructionAsset scale={0.25} glbPath={hawk?.glbPath || ""} shouldRender={showMenu} x={-10} /> </Center>
    )
}