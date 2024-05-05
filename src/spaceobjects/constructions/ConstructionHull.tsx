import { useEffect, useState } from "react";
import useStore from "../../store/UseStore";

interface Props {
  id: string;
  destroyShip: () => void;
}
export const ConstructionHull = ({ id, destroyShip }: Props) => {
  const selectedConstructions = useStore((state) => state.constructions);
  useEffect(() => {
    if (selectedConstructions.length === 0) return;
    const s =  selectedConstructions?.find((e) => e.id.toString() === id.toString());
    if (s && s?.hull <= 0) destroyShip()
  }, [selectedConstructions]);
return null
};
