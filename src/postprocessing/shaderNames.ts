const ShaderNames = ["laser-cannon", "explosion-smoke", "explosion", "plasma-ball"] as const
export type ShaderFileType = typeof ShaderNames[number]

export * as LaserCannon from './shaders/laser-cannon'
export * as ExplosionSmoke from './shaders/explosion-smoke'
export * as Explosion from './shaders/explosion'
export * as PlasmaBall from './shaders/plasma-ball'