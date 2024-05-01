// spaceGameStateUtils.ts
import { Vector3 } from 'three';
import { CelestialObjectId, celestialObjects, ConstructionId, constructions, SpaceShipId, spaceShips } from './StoreAssets';
import Construction from '../spaceobjects/constructions/Construction';
export interface CelestialObject {
    assetId: CelestialObjectId
    id: string;
    glbPath: string
    position: Vector3
    scale?: number
}

export interface Construction {
    assetId: ConstructionId
    id: string;
    glbPath: string
    position: Vector3
    scale?: number
    type: "Refinary" | "Construction"
}

export interface Ship {
    assetId: SpaceShipId
    id: string;
    glbPath: string
    position: Vector3
    hull: number
    scale?: number
    meshRef?: any
}
export type SelectedShip = Pick<Ship, 'assetId' | 'id' | 'position'>
export type numberVector = [number, number, number]
class SpaceGameStateUtils {
    static addShipToState(ships: Ship[], shipId: string, nv: numberVector, hull = 100, scale = 1): Ship[] {
        const position = createVector3(nv)
        const spaceShip = spaceShips.find(ship => ship.id === shipId)
        const newShipId = ships.length + 1
        if (spaceShip) {
            const newShip = { ...spaceShip, hull: hull, assetId: spaceShip.id, id: newShipId.toString(), position: position, scale: scale }
            return [...ships, newShip]
        }
        return [...ships]
    }

    static addConstructionToState(currentConstructions: Construction[], constructionId: string, nv: numberVector, type: "Refinary" | "Construction", scale = 1): Construction[] {
        const position = createVector3(nv)
        const construction = constructions.find(construction => construction.id === constructionId)
        const newConstructionId = currentConstructions.length + 1
        if (construction) {
            const newConstruction = { ...construction, assetId: construction.id, id: newConstructionId.toString(), position: position, scale: scale, type: type }
            return [...currentConstructions, newConstruction]
        }
        return [...currentConstructions]
    }

    static addCelestialObjectToState(currentCelestialObjects: CelestialObject[], coId: string, nv: numberVector, scale = 1): CelestialObject[] {
        const position = createVector3(nv)
        const celestialObject = celestialObjects.find(co => co.id === coId)
        const newCOId = currentCelestialObjects.length + 1
        if (celestialObject) {
            const newCO = { ...celestialObject, assetId: celestialObject.id, id: newCOId.toString(), position: position, scale: scale }
            return [...currentCelestialObjects, newCO]
        }
        return [...currentCelestialObjects]
    }

    static addToSelected(ships: Ship[], selected: SelectedShip[], id: string): SelectedShip[] {
        const selectedShip = ships.find(e => e.id === id) as SelectedShip
        return selectedShip ? selected.includes(selectedShip) ? [...selected.filter(e => e !== selectedShip)] : [...selected, selectedShip] : [...selected]
    }
}

export const createVector3 = (nv: numberVector) => new Vector3(nv[0], nv[1], nv[2]);

export default SpaceGameStateUtils;