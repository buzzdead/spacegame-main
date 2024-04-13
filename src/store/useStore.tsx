import create from 'zustand';
import { Vector3 } from 'three'
import { Mesh } from 'three'
import { CelestialObjectId, celestialObjects, ConstructionId, constructions, SpaceShipId, spaceShips } from './storeAssets';
import { ElementRef } from 'react';

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

interface SpaceGameState {
  celestialObjects: CelestialObject[];
  addCelestialObject: (coId: CelestialObjectId, position: numberVector, scale?: number) => void;
  ships: Ship[];
  addShip: (shipId: SpaceShipId, position: numberVector, scale?: number) => void;
  constructions: Construction[];
  addConstruction: (coId: ConstructionId, position: numberVector, scale?: number) => void
  origin: Vector3 | undefined
  destination: Vector3 | undefined
  setOrigin: (pos: Vector3) => void
  setDestination: (pos: Vector3) => void
}

const addShipToState = (ships: Ship[], shipId: string, nv: numberVector, scale = 1) => {
  const position = new Vector3(nv[0], nv[1], nv[2])
  const spaceShip = spaceShips.find(ship => ship.id === shipId)
  const newShipId = Math.random() * 100000
  if(spaceShip) {
    const newShip = { ...spaceShip, assetId: spaceShip.id, id: newShipId.toString(), position: position, scale: scale}
    return [...ships, newShip]
  }
  return [...ships]
}

const addConstructionToState = (currentConstructions: Construction[], constructionId: string, nv: numberVector, scale = 1) => {
  const position = new Vector3(nv[0], nv[1], nv[2])
  const construction = constructions.find(construction => construction.id === constructionId)
  const newConstructionId = Math.random() * 100000
  if(construction) {
    const newConstruction = { ...construction, assetId: construction.id, id: newConstructionId.toString(), position: position, scale: scale}
    return [...currentConstructions, newConstruction]
  }
  return [...currentConstructions]
}

const addCelestialObjectToState = (currentCelestialObjects: CelestialObject[], coId: string, nv: numberVector, scale = 1) => {
  const position = new Vector3(nv[0], nv[1], nv[2])
  const celestialObject = celestialObjects.find(co => co.id === coId)
  const newCOId = Math.random() * 100000
  if(celestialObject) {
    const newCO = { ...celestialObject, assetId: celestialObject.id, id: newCOId.toString(), position: position, scale: scale}
    return [...currentCelestialObjects, newCO]
  }
  return [...currentCelestialObjects]
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
  setOrigin: (m: Vector3) => set((state) => ({origin: m})),
  setDestination: (m: Vector3) => set((state) => ({destination: m}))
}));

export default useStore;
