import { Vector3 } from "three"
import { SpaceShipId } from "../../../store/StoreAssets"

export type NavigationNames = "harvest" | "user" | "patrol" | "hunting"

type PatrolNavigation = {
    shipType: SpaceShipId
    shipId: string
    meshRef: any
    origin: Vector3
    nearby: boolean
}

type UserNavigation2 = {
    shipType: SpaceShipId;
    shipId: string;
    meshRef: any;
    isSelected: any;
}

type HarvestNavigation = {
    shipType: SpaceShipId;
    shipId: string;
    meshRef: any;
    isSelected: any;
}

export type HuntingNavigation = {
    shipType: SpaceShipId
    shipId: string
    meshRef: any
    origin: Vector3
    nearby: boolean
    target?: any
}

export type NavigationProps = {
    patrol: PatrolNavigation
    user: UserNavigation2
    harvest: HarvestNavigation
    hunting: HuntingNavigation
}