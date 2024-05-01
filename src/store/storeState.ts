import { Vector3 } from "three";
import { CelestialObjectId, ConstructionId, SpaceShipId } from "./StoreAssets";
import {
  CelestialObject,
  Construction,
  numberVector,
  SelectedShip,
  Ship,
} from "./SpaceGameStateUtils";

export type SelectedEnemy = { id: string; hull: number; position: Vector3 }
type EnemyShip = { id: string; position: Vector3, nearby: boolean }
export type DestinationType = "Harvest" | "Attack" | "Travel"

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
    enemyShips: EnemyShip[]
    addEnemyShip: (pos: Vector3) => void
    toggleNearby: (pos: Vector3) => void
    setShipRef: (ref: any, shipId: string) => void
    dealDamageToEnemy: (pos: Vector3, n: number, friend?: boolean) => boolean;
    selected: SelectedShip[];
    setSelected: (id: string) => void;
    selectedEnemies: SelectedEnemy[];
    setSelectedEnemies: (a: SelectedEnemy) => void;
    removeShip: (id: string) => void
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
    destination: {pos: Vector3, type: DestinationType} | undefined;
    setOrigin: (pos: Vector3 | undefined) => void;
    setDestination: (pos: Vector3, type: DestinationType) => void;
  };
  
  export type ResourceState = {
    setResources: (n: number) => boolean;
    resources: number;
  };

  export type OptionsState = {
    postProcessing: boolean
    setPostProcessing: () => void
  }
  
  
  export interface SpaceGameState
    extends CelestialObjectState,
      SpaceShipState,
      ConstructionState,
      LocationState,
      ResourceState,
      OptionsState {}