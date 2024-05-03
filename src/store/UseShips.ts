import { StateCreator } from "zustand";
import SpaceGameStateUtils, { Ship } from "./SpaceGameStateUtils";
import { EnemyShip, SpaceShipState } from "./StoreState";
import { Vector3 } from 'three'



const useShips: StateCreator<
  SpaceShipState,
  [],
  [],
  SpaceShipState
> = (set) => ({
  ships: [],
  addShip: (shipId, position, hull, scale) =>
    set((state) => ({
      ships: SpaceGameStateUtils.addShipToState(
        state.ships,
        shipId,
        position,
        hull,
        scale
      ),
    })),
    removeShip: (id: string, friend = false) => set((state) =>
    {
      if(friend) return {ships: [...state.ships.filter(s => s.id !== id)]}
      else return { enemyShips: [...state.enemyShips.filter(e => e.id !== id)]}
    }),

    setShipRef: (shipRef: any, shipId: string) => 
      set((state) => {
        const ship = state.ships.find(s => s.id === shipId)
        const newShip = {...(ship as Ship & { meshRef: any }), meshRef: shipRef}
        return { ships: ship ? [...state.ships.map(s => s.id === shipId ? newShip : s)] : state.ships }
      }),
    enemyShips: [],
    addEnemyShip: (pos: Vector3, hull: number) => set((state) => ({
      enemyShips: [...state.enemyShips, {position: pos, nearby: false, hull: hull, id: state.enemyShips.length.toString()}]
    })),
    toggleNearby: (pos: Vector3) => set((state) => 
      {
        const ship = state.enemyShips.find(s => s.position === pos)
        if(ship) ship.nearby = !ship.nearby

     return { enemyShips: ship ? [...state.enemyShips.map(es => es.position === pos ? ship : es)] : [...state.enemyShips]}
    }),
  dealDamageToEnemy: (pos: Vector3, n: number, friend?: boolean) => {
    let destroyed = false;
    set((state) => {
      const attackedShip = friend ? state.ships.find(e => e.meshRef.position === pos) : state.selectedEnemies?.find(e => e.position === pos)
      if (!attackedShip) return friend ? { ships:[...state.ships] } : { selectedEnemies: [ ...state.selectedEnemies ] }
      const newHull = attackedShip?.hull - n;
      destroyed = newHull <= n;
      attackedShip.hull = newHull
      const updatedShips = friend ? state.ships.map(s => s.id === attackedShip.id ? attackedShip : s)  : state.selectedEnemies.map(m => m.id === attackedShip.id ? attackedShip : m)
      return friend ? {ships: updatedShips as Ship[] } : { selectedEnemies: updatedShips as EnemyShip[] };
    });
    return destroyed;
  },
  selected: [],
  setSelected: (id: string) =>
    set((state) => ({
      selected: SpaceGameStateUtils.addToSelected(
        state.ships,
        state.selected,
        id
      ),
    })),
  selectedEnemies: [],
  setSelectedEnemies: (a: EnemyShip) => {
    const b = 0;
    set((state) => {
      const alreadySelected = state.selectedEnemies?.find(e => e.id === a.id)
      const newShips = alreadySelected ? [...state.selectedEnemies] : [...state.selectedEnemies, a]
      return {
        selectedEnemies: [...newShips]
      }
    }
    )
  }

})

export default useShips;