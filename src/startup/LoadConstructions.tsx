import { memo, useEffect } from "react";
import useStore from "../store/UseStore";
import Construction from "../spaceobjects/constructions/Construction";
import { Construction as C } from "../store/SpaceGameStateUtils";

interface CProps {
  c: C
}

const MemoizedC = memo(({ c }: CProps) => <Construction construction={c} />, (prevProps, nextProps) => {
  return prevProps.c.id === nextProps.c.id 
});

export const LoadConstructions = () => {
  const constructions = useStore((state) => state.constructions);
  const addConstruction = useStore((state) => state.addConstruction);
  useEffect(() => {
    addConstruction("spacestation6", [100, 50, 750], "Enemy", 2.5)
    addConstruction("spacestation6", [400, 50, 750], "Enemy", 2.5)  
    addConstruction("spacestation4", [4, 0, 64], "Construction", .031);
    addConstruction("spacestation5", [64, 6, 18], "Refinary", 2.5);
  }, [addConstruction]);
  return (
    <group>
      {constructions.map((construction) => (
        <MemoizedC key={construction.id} c={construction} />
      ))}
    </group>
  );
};
