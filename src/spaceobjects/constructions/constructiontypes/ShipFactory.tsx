import { useAsset } from "../../../hooks/Asset";
import { spaceShips } from "../../../store/StoreAssets";
import { ConstructionMenu } from "./Factory/ConstructionMenu";
import { useRef } from "react";
import { ConstructionBase } from "./ConstructionBase";

interface Props {
  construction: any;
}

export const ShipFactory = ({ construction }: Props) => {
  const ships = spaceShips;
  const fighter = ships.find((e) => e.id === "fighter");
  const heavyFighter = ships.find(e => e.id === "heavyfighter")
  const test = ships.find(e => e.id === "spaceship-test")
  const constructionAsset = useAsset(fighter?.glbPath || "", 8);
  const constructionAsset2 = useAsset(heavyFighter?.glbPath || "", 8);
  const constructionAsset3 = useAsset(test?.glbPath || "", 8);
  const menu = useRef(true);
  const handleClick = (e: any) => {
    e.stopPropagation();
    menu.current = !menu.current;
  };

  return (
    <ConstructionBase onClick={handleClick} construction={construction}>
      <ConstructionMenu menu={menu} />
    </ConstructionBase>
  );
};
