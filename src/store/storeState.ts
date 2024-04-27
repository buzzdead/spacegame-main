import { Vector3 } from "three";
import { CelestialObjectId, ConstructionId, SpaceShipId } from "./storeAssets";
import {
  CelestialObject,
  Construction,
  numberVector,
  SelectedShip,
  Ship,
} from "./spaceGameStateUtils";

export type SelectedEnemy = { id: string; hull: number; position: Vector3 }

export type CelestialObjectState = {
    celestialObjects: CelestialObject[];
    addCelestialObject: (
      coId: CelestialObjectId,
      position: numberVector,
      scale?: number
    ) => void;
  };
  
  export type SpaceShipState = {
    ships: Ship[];
    addShip: (
      shipId: SpaceShipId,
      position: numberVector,
      hull: number,
      scale?: number
    ) => void;
    setShipRef: (ref: any, shipId: string) => void
    dealDamageToEnemy: (pos: Vector3, n: number, friend?: boolean) => boolean;
    selected: SelectedShip[];
    setSelected: (id: string) => void;
    selectedEnemies: SelectedEnemy[];
    setSelectedEnemies: (a: SelectedEnemy) => void;
  };
  
 export  type ConstructionState = {
    constructions: Construction[];
    addConstruction: (
      coId: ConstructionId,
      position: numberVector,
      type: "Refinary" | "Construction",
      scale?: number
    ) => void;
  };
  
  export type LocationState = {
    origin: Vector3 | undefined;
    destination: Vector3 | undefined;
    setOrigin: (pos: Vector3 | undefined) => void;
    setDestination: (pos: Vector3) => void;
  };
  
  export type ResourceState = {
    setResources: (n: number) => boolean;
    resources: number;
  };
  
  
  export interface SpaceGameState
    extends CelestialObjectState,
      SpaceShipState,
      ConstructionState,
      LocationState,
      ResourceState {}