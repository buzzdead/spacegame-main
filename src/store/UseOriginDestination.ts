import { StateCreator } from "zustand";
import { Vector3 } from "three";
import {
  DestinationType,
  EnemyShip,
  LocationState,
  ObjectType,
} from "./StoreState";
import { CelestialObject, Construction, Ship } from "./SpaceGameStateUtils";

export type ObjectLocation = Ship | EnemyShip | Construction | CelestialObject;

const useOriginDestination: StateCreator<
  LocationState,
  [],
  [],
  LocationState
> = (set) => ({
  origin: undefined,
  destination: undefined,
  setOrigin: (m: ObjectLocation | undefined) => set((state) => ({ origin: m })),
  setDestination: (
    objectLocation: ObjectLocation,
    type: DestinationType,
    objectType: ObjectType
  ) =>
    set((state) => ({
      destination:
        objectLocation.position === state.destination?.objectLocation?.position
          ? undefined
          : { objectLocation: objectLocation, type: type, objectType },
    })),
});

export default useOriginDestination;
