import { useMemo } from "react";
import { TextureLoader } from "three";

export const useTexture = (path: string) => {
    const texture4 = useMemo(() => {
        const p = require('../assets/particles/' + path)
        return new TextureLoader().load(p);
      }, [])
    return texture4.clone()
}