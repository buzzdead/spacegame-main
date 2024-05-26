import { Vector3 } from "three";
import { CelestialObjectId, ConstructionId, SpaceShipId } from "./StoreAssets";
import {
  CelestialObject,
  Construction,
  numberVector,
  SelectedShip,
  Ship,
} from "./SpaceGameStateUtils";
import { ExplosionSize } from "./storeSlices/useEffects";
import { ObjectLocation } from "./storeSlices/UseOriginDestination";
import { ElementRef } from "react";

export type EnemyShip = { id: string; position: Vector3, nearby: boolean, hull: number, meshRef?: any }
export type DestinationType = "Harvest" | "Attack" | "Travel" | "Collect"
export type ObjectType = "Ship" | "Construction" | "Planet" | "MissionItem"
export type DamageReport = "Destroyed" | "Hit" | "Not Found"
export type ShipShift = {shift: "left" | "right", multiplyer: number}

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
    ) => Ship | null;
    findShip: (id: string) => void;
    enemyShips: EnemyShip[]
    addEnemyShip: (pos: Vector3, hull: number) => void
    toggleNearby: (pos: Vector3, n: boolean) => void
    setShipRef: (ref: null | ElementRef<"mesh"> & Partial<ShipShift>, shipId: string) => void
    setShipShift: (ships: Ship[]) => void
    setEnemyShipRef: (ref: any, shipId: string) => void
    dealDamageToEnemy: (id: string, n: number, friend?: boolean) => DamageReport;
    selected: SelectedShip[];
    setSelected: (id: string, removeAll?: boolean) => void;
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
    dealDamageToConstruction: (id: string, n: number) => DamageReport
  };
  
  export type LocationState = {
    origin: ObjectLocation | undefined;
    destination: {objectLocation: ObjectLocation | undefined, type: DestinationType, objectType: ObjectType} | undefined;
    setOrigin: (pos: ObjectLocation | undefined) => void;
    setDestination: (pos: ObjectLocation, type: DestinationType, objectType: ObjectType) => void;
  };
  
  export type ResourceState = {
    setResources: (n: number) => boolean;
    resources: number;
  };

  export type OptionsState = {
    postProcessing: boolean
    stats: boolean
    brightness: number
    developerMode: boolean
    setDeveloperMode: () => void
    setStats:() => void
    setPostProcessing: () => void
    setBrightness: (n: number) => void
  }

  export type EffectsState = {
    explosions: {id: number; pos: Vector3, size: ExplosionSize}[]
    setExplosions: (newExplosion: Vector3, size?: ExplosionSize) => void
    removeExplosion: (id: number) => void
  }

  export type MissionState = {
    missions: {name: string; completed: boolean}[];
    setMissionComplete: (name: string) => void;
  }

  export type UserType = {  homebase: string
    name: string
    solarSystem: string}

  export type UserState = {
    isLoggedIn: boolean
    user: UserType
    logIn: (user: UserType, logOut?: boolean) => void
  }
  
  export interface SpaceGameState
    extends CelestialObjectState,
      SpaceShipState,
      ConstructionState,
      LocationState,
      ResourceState,
      OptionsState,
      EffectsState,
      MissionState,
      UserState
      {}