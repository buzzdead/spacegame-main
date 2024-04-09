import create from 'zustand';
import { Vector3 } from 'three'
import { Mesh } from 'three'

interface CelestialObject { 
  id: string;
  glbPath: string
  position: Vector3
  scale?: number
}

interface Construction { 
  id: string;
  glbPath: string
  position: Vector3
  scale?: number
}

interface Ship {
  id: string;
  glbPath: string
  position: Vector3
  scale?: number
}

export type SGS = {
  CO: CelestialObject
  Ship: Ship
  Construction: Construction
  scale?: number
}

interface SpaceGameState {
  celestialObjects: CelestialObject[];
  addCelestialObject: (object: CelestialObject) => void;
  ships: Ship[];
  addShip: (ship: Ship) => void;
  constructions: Construction[];
  origin: Mesh | undefined
  destination: Mesh | undefined
  setOrigin: (m: Mesh | undefined) => void
  setDestination: (m: Mesh | undefined) => void
}

const celestialObjects = [
  {id: "planet1", glbPath: '/assets/celestialobjects/planet1.glb', position: new Vector3(7,1,9), scale: 111},
  {id: "planet2", glbPath: '/assets/celestialobjects/planet2.glb', position: new Vector3(0,0,0)},
  {id: "planet3", glbPath: '/assets/celestialobjects/planet3.glb', position: new Vector3(0,0,0)},
  {id: "planet5", glbPath: '/assets/celestialobjects/planet5.glb', position: new Vector3(-55,0,-20), scale: 50},
  {id: "planet6", glbPath: '/assets/celestialobjects/planet6.glb', position: new Vector3(0,0,0)},
  {id: "asteroid", glbPath: '/assets/celestialobjects/asteroid.glb', position: new Vector3(0,5,0), scale: 0.01},
  {id: "asteroid-minerals", glbPath: '/assets/celestialobjects/asteroid-minerals.glb', position: new Vector3(34,5,3), scale: 2},
  {id: "blackhole", glbPath: '/assets/celestialobjects/blackhole.glb', position: new Vector3(-166,3,246), scale:9},
]

const spaceShips = [
  {id: "hullspaceship", glbPath: '/assets/spaceships/hullspaceship.glb', position: new Vector3(8,1,0), scale: 0.08},
  {id: "spaceship-evil", glbPath: '/assets/spaceships/spaceship-evil.glb', position: new Vector3(8,1,0), scale: 0.0008},
  {id: "cargo", glbPath: '/assets/spaceships/cargo.glb', position: new Vector3(8,1,0), scale: 0.004},
  {id: "cruiser", glbPath: '/assets/spaceships/cruiser.glb', position: new Vector3(8,1,0), scale: 0.004},
]

const constructions = [
  {id: "spacestation1", glbPath: 'assets/constructions/spacestation1.glb', position: new Vector3(-6,6,24),  },
  {id: "spacestation2", glbPath: 'assets/constructions/spacestation2.glb', position: new Vector3(14,6,24), },
  {id: "spacestation3", glbPath: 'assets/constructions/spacestation3.glb', position: new Vector3(14,0,34), scale: 0.055},
]

const useStore = create<SpaceGameState>((set) => ({
  celestialObjects: celestialObjects,
  addCelestialObject: (object) =>
    set((state) => ({ celestialObjects: [...state.celestialObjects, object] })),
  ships: spaceShips,
  addShip: (ship) => set((state) => ({ ships: [...state.ships, ship] })),
  constructions: constructions,
  origin: undefined,
  destination: undefined,
  setOrigin: (m: Mesh | undefined) => set((state) => ({origin: m})),
  setDestination: (m: Mesh | undefined) => set((state) => ({destination: m}))
}));

export default useStore;
