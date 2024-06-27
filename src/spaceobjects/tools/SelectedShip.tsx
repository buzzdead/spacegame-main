import { useEffect, useState } from "react";
import useStore from "../../store/UseStore";
import { Vector3 } from "three";
import SelectedIcon from "./pyramidMesh";

interface Props {
  shipId: string;
  onSelected: (b: boolean) => void
  shipType: string
}

const setPosition = (shipType: string, isFighter: boolean) => {
  const iconY = shipType === "fighter" ? 2.5 : shipType === "heavyfighter" ? 5 : 2
  const pos = isFighter ? new Vector3(0, iconY, 0) : new Vector3(0, 2, -0.5)
  return pos
}

export const SelectedShip = ({ shipId, onSelected, shipType }: Props) => {
  const selected = useStore((state) => state.selected);

  const isFighter = shipType === "fighter" || shipType === "heavyfighter"
  const selectedOnCreation =
    selected.find((s) => s.id === shipId) !== undefined;
  const [isSelected, setIsSelected] = useState(selectedOnCreation);

  useEffect(() => {
    const isCurrentlySelected = selected.some((s) => s.id === shipId);
    if (isCurrentlySelected !== isSelected) {
      setIsSelected(isCurrentlySelected);
      onSelected(isCurrentlySelected);
    }
  }, [selected]);

  return (
    <group>
      {isSelected && (
        <SelectedIcon
          color={0x00ff80}
          size={shipType === "heavyfighter" ? "M" : "S"}
          position={setPosition(shipType, isFighter)}
        />
      )}
    </group>
  );
};
