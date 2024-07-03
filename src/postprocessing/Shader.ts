import { ShaderFileType } from './shaderNames';
import { LaserCannon, ExplosionSmoke, Explosion, PlasmaBall } from './shaderNames'

type ShaderType = { name: ShaderFileType, vs: string, fs: string }
const shaders: ShaderType[] = [
    { name: 'laser-cannon', vs: LaserCannon["vertex"], fs: LaserCannon["fragment"] },
    { name: 'explosion-smoke', vs: ExplosionSmoke["vertex"], fs: ExplosionSmoke["fragment"]},
    { name: "explosion", vs: Explosion["vertex"], fs: Explosion["fragment"]},
    { name: "plasma-ball", vs: PlasmaBall["vertex"], fs: PlasmaBall["fragment"]}
]
export const Shader = (name: ShaderFileType) => {
    const shader = shaders.find(n => n.name === name)
    if(shader)
    {
        const vs = shader.vs
        const fs = shader.fs
        return { vs, fs }
    }
    else {
        const vs = undefined
        const fs = undefined
        return {vs, fs}
    }
};

export default Shader;