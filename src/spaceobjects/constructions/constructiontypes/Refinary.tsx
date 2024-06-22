import useStore, { useShallowStore } from "../../../store/UseStore";
import { ConstructionBase } from "./ConstructionBase";

interface Props {
  construction: any;
}

export const Refinary = ({construction}: Props) => {
  const {origin, setOrigin} = useShallowStore(["origin", "setOrigin"])
  const handleClick = (e: any) => {
    e.stopPropagation();
    origin?.position === construction.position
      ? setOrigin(undefined)
      : setOrigin(construction);
  };
  return <ConstructionBase construction={construction} onClick={handleClick}/>
};
