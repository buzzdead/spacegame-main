import { BoxGeometry, IcosahedronGeometry } from "three";
import { useShallowStore } from "../../../store/UseStore";

export const getGeometry = (weaponType: "plasma" | "laser") => {
    return weaponType === "laser"
      ? new BoxGeometry(0.2, 0.2, 5)
      : new IcosahedronGeometry(2.35, 3);
}

export const DIVERGENCE = { laser: {left: -2.85, right: 2.85}, plasma: {left:-6.5, right: 5}}