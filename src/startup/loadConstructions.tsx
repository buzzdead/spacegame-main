import { useEffect } from "react";
import useStore from "../store/UseStore";
import Construction from "../spaceobjects/constructions/Construction";

export const LoadConstructions = () => {
  const constructions = useStore((state) => state.constructions);
  const addConstruction = useStore((state) => state.addConstruction);
  useEffect(() => {
    addConstruction("spacestation4", [4, 0, 64], "Construction", .031);
    addConstruction("spacestation5", [64, 6, 18], "Refinary", 2.5);
  }, [addConstruction]);
  return (
    <group>
      {constructions.map((construction) => (
        <Construction key={construction.id} construction={construction} />
      ))}
    </group>
  );
};
