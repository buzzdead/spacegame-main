interface Asset<K = string> {
    id: K,
    glbPath: string
}

export const celestialObjects = (<T>(p: readonly Asset<T>[]) => p)([
    { id: "planet1", glbPath: '/assets/celestialobjects/planet1.glb'},
    { id: "planet2", glbPath: '/assets/celestialobjects/planet2.glb'},
    { id: "planet3", glbPath: '/assets/celestialobjects/planet3.glb'},
    { id: "planet5", glbPath: '/assets/celestialobjects/planet5.glb'},
    { id: "planet6", glbPath: '/assets/celestialobjects/planet6.glb' },
    { id: "asteroid", glbPath: '/assets/celestialobjects/asteroid.glb'},
    { id: "asteroid-minerals", glbPath: '/assets/celestialobjects/asteroid-minerals.glb'},
    { id: "blackhole", glbPath: '/assets/celestialobjects/blackhole.glb'},
    { id: "sun1", glbPath: '/assets/celestialObjects/sun1.glb'}
] as const)

export const spaceShips =  (<T>(p: readonly Asset<T>[]) => p)([
    { id: "hullspaceship", glbPath: '/assets/spaceships/mothershipp.glb'},
    { id: "spaceship-evil", glbPath: '/assets/spaceships/spaceship-evil.glb'},
    { id: "cargo", glbPath: '/assets/spaceships/cargo.glb'},
    { id: "cruiser", glbPath: '/assets/spaceships/cruiser.glb'},
    { id: "hawk", glbPath: '/assets/spaceships/hawk.glb'},
    { id: "fighter", glbPath: '/assets/spaceships/fighter.glb'},
] as const)

export const constructions =  (<T>(p: readonly Asset<T>[]) => p)([
    { id: "spacestation1", glbPath: 'assets/constructions/spacestation1.glb'},
    { id: "spacestation2", glbPath: 'assets/constructions/spacestation2.glb'},
    { id: "spacestation3", glbPath: 'assets/constructions/spacestation3.glb'},
    { id: "spacestation4", glbPath: 'assets/constructions/spacestation4.glb'},
    { id: "spacestation5", glbPath: 'assets/constructions/spacestation5.glb'},
    { id: "spacestation6", glbPath: 'assets/constructions/spacestation6.glb'},
    { id: "spacestation7", glbPath: 'assets/constructions/spacestation7.glb'},
] as const)

export const weapons = (<T>(p: readonly Asset<T>[]) => p)([
    { id: 'fighter-missile', glbPath: 'assets/weapons/fighter_missile.glb'}
] as const )

export type CelestialObjectId = typeof celestialObjects[number]["id"]
export type SpaceShipId = typeof spaceShips[number]["id"]
export type ConstructionId = typeof constructions[number]["id"]
export type WeaponId = typeof weapons[number]["id"]

/* type Pair<K = string, P = number> = {
    key: K;
    value: P;
};

const pairs = <T extends readonly Pair[]>(p: T) => p;

const samplePairs = pairs([
    { key: 'foo', value: 1 },
    { key: 'bar', value: 2 },
] as const);

type Keys = typeof samplePairs[number]['value']; // "foo" | "bar"
const a: Keys = 1 */