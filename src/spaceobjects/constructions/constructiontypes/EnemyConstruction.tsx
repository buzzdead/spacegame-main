import useStore from "../../../store/UseStore";
import { ConstructionBase } from "./ConstructionBase";

interface Props {
  construction: any;
}

export const EnemyConstruction = ({ construction }: Props) => {
  const setDestination = useStore((state) => state.setDestination);
  const handleClick = (e: any) => {
    e.stopPropagation();
    setDestination(construction, "Attack", "Construction");
  };
  return <ConstructionBase construction={construction} onClick={handleClick} />;
};
