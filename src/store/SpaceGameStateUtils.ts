// spaceGameStateUtils.ts
import { Vector3 } from 'three';
import { CelestialObjectId, celestialObjects, ConstructionId, constructions, SpaceShipId, spaceShips } from './StoreAssets';
import Construction from '../spaceobjects/constructions/Construction';
import { ElementRef } from 'react';
import { ShipShift } from './StoreState';
export interface CelestialObject {
    assetId: CelestialObjectId
    id: string;
    glbPath: string
    position: Vector3
    meshRef?: any
    scale?: number
}

export interface Construction {
    assetId: ConstructionId
    id: string;
    glbPath: string
    position: Vector3
    scale?: number
    meshRef?: any
    hull: number
    type: "Refinary" | "Construction" | "Enemy"
}

export interface Ship {
    assetId: SpaceShipId
    id: string;
    glbPath: string
    position: Vector3
    hull: number
    scale?: number
    meshRef?: ElementRef<"mesh"> & {shipShift: Partial<ShipShift>}
}
let ship_id = 0
let construction_id = 0
let celestialObject_id = 0
export type SelectedShip = Ship
export type numberVector = [number, number, number]
class SpaceGameStateUtils {
    static addShipToState(ships: Ship[], shipId: string, nv: numberVector, hull = 100, scale = 1): Ship[] {
        const position = createVector3(nv)
        const spaceShip = spaceShips.find(ship => ship.id === shipId)
        if (spaceShip) {
            const newShip = { ...spaceShip, hull: hull, assetId: spaceShip.id, id: (ship_id++).toString(), position: position, scale: scale }
            return [...ships, newShip]
        }
        return [...ships]
    }

    static addConstructionToState(currentConstructions: Construction[], constructionId: string, nv: numberVector, type: Construction["type"], scale = 1): Construction[] {
        const position = createVector3(nv)
        const construction = constructions.find(construction => construction.id === constructionId)
        if (construction) {
            const newConstruction = { ...construction, assetId: construction.id, id: (construction_id++).toString(), position: position, scale: scale, hull: 500, type: type }
            return [...currentConstructions, newConstruction]
        }
        return [...currentConstructions]
    }

    static addCelestialObjectToState(currentCelestialObjects: CelestialObject[], coId: string, nv: numberVector, scale = 1): CelestialObject[] {
        const position = createVector3(nv)
        const celestialObject = celestialObjects.find(co => co.id === coId)
        if (celestialObject) {
            const newCO = { ...celestialObject, assetId: celestialObject.id, id: (celestialObject_id++).toString(), position: position, scale: scale }
            return [...currentCelestialObjects, newCO]
        }
        return [...currentCelestialObjects]
    }

    static addToSelected(ships: Ship[], selected: SelectedShip[], id: string, remove = false): SelectedShip[] {
        const selectedShip = ships.find(e => e.id === id) as SelectedShip
        if(remove && selectedShip) {
            return selected.find(s => s.id === id) ? [...selected.filter(s => s.id !== selectedShip.id)] : [...selected]
        }
        else if (selectedShip) {
            return selected.find(s => s.id === id) ? [...selected] : [...selected, selectedShip]
        }
        return [...selected]
    }
}

export const createVector3 = (nv: numberVector) => new Vector3(nv[0], nv[1], nv[2]);

export default SpaceGameStateUtils;