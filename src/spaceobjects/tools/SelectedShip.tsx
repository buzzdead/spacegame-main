import { useEffect, useState } from "react";
import useStore from "../../store/UseStore";
import { Vector3 } from "three";
import SelectedIcon from "./pyramidMesh";

interface Props {
  shipId: string;
  onSelected: (b: boolean) => void
  isFighter: boolean
}

export const SelectedShip = ({ shipId, onSelected, isFighter }: Props) => {
  const selected = useStore((state) => state.selected);
  const selectedOnCreation =
    selected.find((s) => s.id === shipId) !== undefined;
  const [isSelected, setIsSelected] = useState(selectedOnCreation);

  useEffect(() => {
    if (selected.find((s) => s.id === shipId) && !isSelected){
      setIsSelected(true); onSelected(true);}
    else if (!selected.find((s) => s.id === shipId) && isSelected){
      setIsSelected(false); onSelected(false)}
  }, [selected]);

  return (
    <group>
      {isSelected && (
        <SelectedIcon
          color={0x00ff80}
          position={
            isFighter ? new Vector3(-8, 2.5, -1.5) : new Vector3(0, 2.5, 2)
          }
        />
      )}
    </group>
  );
};
