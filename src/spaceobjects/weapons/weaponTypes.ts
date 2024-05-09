import * as THREE from 'three'

export type LaserType = {
    speed: number;
    color: string;
  };
type LaserNames = "HeavyLaser" | "LightLaser"
  export const LaserTypes: Record<LaserNames, LaserType> = {
    HeavyLaser: {
      speed: 25,
      color: '#edcf09',
    },
    LightLaser: {
      speed: 75,
      color: '#00ff00',
    },
  };
  
export type LaserRef = THREE.Mesh<
  THREE.BoxGeometry,
  THREE.MeshBasicMaterial,
  THREE.Object3DEventMap
>;

type Distances = "stop" | "fireNext" | "dissipate" | "nothing";
export const getDistance = (v1: THREE.Vector3, v2: THREE.Vector3) => {
  return v1.distanceTo(v2);
};
export const getDistanceType = (distance: number, id = 0, maxId = 2): Distances => {
  if (distance < 1 || distance > 109) return "stop";
  if (distance < 7 || distance > 100) return "dissipate";
  if (distance < 25 && id < maxId) return "fireNext";
  return "nothing";
};