import { Center } from "@react-three/drei";
import ConstructionAsset from "./ConstructionAsset";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { spaceShips } from "../../../../store/StoreAssets";

interface Props {
  menu: React.MutableRefObject<boolean>;
}

export const ConstructionMenu = ({ menu }: Props) => {
  const ships = spaceShips;
  const fighter = ships.find((e) => e.id === "fighter");
  const heavyFighter = ships.find(e => e.id === "heavyfighter")
  const test = ships.find(e => e.id === "spaceship-test")
  
  const [showMenu, setShowMenu] = useState(false);
  useFrame(() => {
    if (showMenu !== menu.current) setShowMenu(menu.current);
  });
  return (
    <Center disableX disableZ disableY>
      <ConstructionAsset
        glbPath={fighter?.glbPath || ""}
        shouldRender={showMenu}
      />
      <ConstructionAsset
        glbPath={heavyFighter?.glbPath || ""}
        shouldRender={showMenu}
        scale={0.01}
        x={1}
      />
    </Center>
  );
};
