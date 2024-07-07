import { useMemo } from "react";
import { DIVERGENCE, getGeometry } from "./FrontalUtil";
import * as THREE from 'three'
import Shader from "../../../postprocessing/Shader";

export const useFrontalWeapon = (weaponType: "laser" | "plasma", mountPosition: "left" | "right", color: string) => {
    const { vs, fs } = Shader(
        weaponType === "laser" ? "laser-cannon" : "plasma-ball"
    );
    const geometry = getGeometry(weaponType)
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color(color) },
                color2: {
                    value: new THREE.Color(weaponType === "laser" ? "green" : 0x3366ff),
                },
                time: { value: 0 },
            },
            vertexShader: vs,
            fragmentShader: fs,
            blending: THREE.AdditiveBlending,
            blendEquation: THREE.MinEquation,
            blendDst: THREE.OneMinusConstantAlphaFactor,
            blendSrc: THREE.ZeroFactor,
            blendEquationAlpha: THREE.CustomBlending,
        });
    }, []);

    const mesh = useMemo(() => {
        const theMesh = new THREE.Mesh(geometry, material);
        theMesh.position.x += DIVERGENCE[weaponType][mountPosition]
        theMesh.position.z += 3;
        return theMesh;
    }, []);

    return { material, mesh }
}