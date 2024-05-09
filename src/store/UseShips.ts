import { StateCreator } from "zustand";
import SpaceGameStateUtils, { Ship } from "./SpaceGameStateUtils";
import { DamageReport, EnemyShip, SpaceShipState } from "./StoreState";
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
    setEnemyShipRef: (shipRef: any, shipId: string) => 
      set((state) => {
        const ship = state.enemyShips.find(es => es.id === shipId)
        const newShip = {...(ship as EnemyShip & { meshRef: any }), meshRef: shipRef}
        return { enemyShips: ship ? state.enemyShips.map(es => es.id === shipId ? newShip : es) : state.enemyShips}
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
    toggleNearby: (pos: Vector3, n: boolean) => set((state) => 
      {
        
        const ship = state.enemyShips.find(s => s.meshRef?.position === pos)
        if(ship?.nearby === n) return state
        if(ship) {ship.nearby = n;}

     return { enemyShips: ship ? [...state.enemyShips.map(es => es.meshRef.position === pos ? ship : es)] : [...state.enemyShips]}
    }),
  dealDamageToEnemy: (pos: Vector3, n: number, friend?: boolean) => {
    let destroyed: DamageReport = "Hit";
    set((state) => {
      const attackedShip = friend ? state.ships.find(e => e.meshRef.position === pos) : state.selectedEnemies?.find(e => e.position === pos)
      if (!attackedShip) {destroyed = "Not Found"; return friend ? { ships:[...state.ships] } : { selectedEnemies: [ ...state.selectedEnemies ] }}
      const newHull = attackedShip?.hull - n;
      destroyed = newHull <= 0 ? "Destroyed" : "Hit";
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
  setSelectedEnemies: (a: EnemyShip, remove = false) => {
    const b = 0;
    set((state) => {
      if(remove) return { selectedEnemies: state.selectedEnemies.filter(e => e.id !== a.id)}
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