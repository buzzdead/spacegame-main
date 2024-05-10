import { Vector3 } from "three";
import { CelestialObjectId, ConstructionId, SpaceShipId } from "./StoreAssets";
import {
  CelestialObject,
  Construction,
  numberVector,
  SelectedShip,
  Ship,
} from "./SpaceGameStateUtils";
import { ExplosionSize } from "./useEffects";

export type EnemyShip = { id: string; position: Vector3, nearby: boolean, hull: number, meshRef?: any }
export type DestinationType = "Harvest" | "Attack" | "Travel"
export type ObjectType = "Ship" | "Construction" | "Planet"
export type DamageReport = "Destroyed" | "Hit" | "Not Found"

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
    addEnemyShip: (pos: Vector3, hull: number) => void
    toggleNearby: (pos: Vector3, n: boolean) => void
    setShipRef: (ref: any, shipId: string) => void
    setEnemyShipRef: (ref: any, shipId: string) => void
    dealDamageToEnemy: (pos: Vector3, n: number, friend?: boolean) => DamageReport;
    selected: SelectedShip[];
    setSelected: (id: string) => void;
    selectedEnemies: EnemyShip[];
    setSelectedEnemies: (a: EnemyShip, remove?: boolean) => void;
    removeShip: (id: string, friend?: boolean) => void
  };
  
 export  type ConstructionState = {
    constructions: Construction[];
    addConstruction: (
      coId: ConstructionId,
      position: numberVector,
      type: "Refinary" | "Construction" | "Enemy",
      scale?: number
    ) => void;
    removeConstruction: (coId: string) => void
    dealDamageToConstruction: (pos: Vector3, n: number) => DamageReport
  };
  
  export type LocationState = {
    origin: Vector3 | undefined;
    destination: {pos: Vector3, type: DestinationType, objectType: ObjectType} | undefined;
    setOrigin: (pos: Vector3 | undefined) => void;
    setDestination: (pos: Vector3, type: DestinationType, objectType: ObjectType) => void;
  };
  
  export type ResourceState = {
    setResources: (n: number) => boolean;
    resources: number;
  };

  export type OptionsState = {
    postProcessing: boolean
    setPostProcessing: () => void
  }

  export type EffectsState = {
    explosions: {id: number; pos: Vector3, size: ExplosionSize}[]
    setExplosions: (newExplosion: Vector3, size: ExplosionSize) => void
    removeExplosion: (id: number) => void
  }
  
  export interface SpaceGameState
    extends CelestialObjectState,
      SpaceShipState,
      ConstructionState,
      LocationState,
      ResourceState,
      OptionsState,
      EffectsState
      {}