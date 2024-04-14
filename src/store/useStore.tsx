import create from 'zustand';
import { Vector3 } from 'three'
import { CelestialObjectId, celestialObjects, ConstructionId, constructions, SpaceShipId, spaceShips } from './storeAssets';

interface CelestialObject { 
  assetId: CelestialObjectId
  id: string;
  glbPath: string
  position: Vector3
  scale?: number
}

interface Construction { 
  assetId: ConstructionId
  id: string;
  glbPath: string
  position: Vector3
  scale?: number
}

interface Ship {
  assetId: SpaceShipId
  id: string;
  glbPath: string
  position: Vector3
  scale?: number
}

export type SGS = {
  CO: CelestialObject
  Ship: Ship
  Construction: Construction
  scale?: number
}

type numberVector = [number, number, number] 

type SelectedShip = Pick<Ship, 'assetId' | 'id' | 'position'>

interface SpaceGameState {
  celestialObjects: CelestialObject[];
  addCelestialObject: (coId: CelestialObjectId, position: numberVector, scale?: number) => void;
  ships: Ship[];
  addShip: (shipId: SpaceShipId, position: numberVector, scale?: number) => void;
  constructions: Construction[];
  addConstruction: (coId: ConstructionId, position: numberVector, scale?: number) => void
  origin: Vector3 | undefined
  destination: Vector3 | undefined
  setOrigin: (pos: Vector3 | undefined) => void
  setDestination: (pos: Vector3) => void
  selected: SelectedShip[],
  setSelected: (id: string) => void
  resources: number
  setResources: (n: number) => void
}

const addShipToState = (ships: Ship[], shipId: string, nv: numberVector, scale = 1) => {
  const position = new Vector3(nv[0], nv[1], nv[2])
  const spaceShip = spaceShips.find(ship => ship.id === shipId)
  const newShipId = ships.length + 1
  if(spaceShip) {
    const newShip = { ...spaceShip, assetId: spaceShip.id, id: newShipId.toString(), position: position, scale: scale}
    return [...ships, newShip]
  }
  return [...ships]
}

const addConstructionToState = (currentConstructions: Construction[], constructionId: string, nv: numberVector, scale = 1) => {
  const position = new Vector3(nv[0], nv[1], nv[2])
  const construction = constructions.find(construction => construction.id === constructionId)
  const newConstructionId = currentConstructions.length + 1
  if(construction) {
    const newConstruction = { ...construction, assetId: construction.id, id: newConstructionId.toString(), position: position, scale: scale}
    return [...currentConstructions, newConstruction]
  }
  return [...currentConstructions]
}

const addCelestialObjectToState = (currentCelestialObjects: CelestialObject[], coId: string, nv: numberVector, scale = 1) => {
  const position = new Vector3(nv[0], nv[1], nv[2])
  const celestialObject = celestialObjects.find(co => co.id === coId)
  const newCOId = currentCelestialObjects.length + 1
  if(celestialObject) {
    const newCO = { ...celestialObject, assetId: celestialObject.id, id: newCOId.toString(), position: position, scale: scale}
    return [...currentCelestialObjects, newCO]
  }
  return [...currentCelestialObjects]
}

const addToSelected = (ships: Ship[], selected: SelectedShip[], id: string) => {
  const selectedShip = ships.find(e => e.id === id) as SelectedShip
  return selectedShip ? selected.includes(selectedShip) ? [...selected.filter(e => e !== selectedShip)] : [...selected, selectedShip] : [...selected]
}

const useStore = create<SpaceGameState>((set) => ({
  celestialObjects: [],
  addCelestialObject: (coId, position, scale) => set((state) => ({celestialObjects: addCelestialObjectToState(state.celestialObjects, coId, position, scale)})),
  ships: [],
  addShip: (shipId, position, scale) => set((state) => ({ ships: addShipToState(state.ships, shipId, position, scale)})),
  constructions: [],
  addConstruction: (coId, position, scale) => set((state) => ({constructions: addConstructionToState(state.constructions, coId, position, scale)})),
  origin: undefined,
  destination: undefined,
  setOrigin: (m: Vector3 | undefined) => set((state) => ({origin: m})),
  setDestination: (m: Vector3) => set((state) => ({destination: m})),
  selected: [],
  setSelected: (id: string) => set((state) => ({selected: addToSelected(state.ships, state.selected, id)})),
  resources: 0,
  setResources: (n: number) => set((state) => ({resources: state.resources + n}))
}));

export default useStore;
