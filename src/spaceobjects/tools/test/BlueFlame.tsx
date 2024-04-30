import React, {useEffect, useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import NebulaEngine, {NebulaSystem} from "./NebulaEngine";
import Nebula, { Force } from 'three-nebula'
import json from './rocketfuel3.json'
import * as THREE from 'three'

interface Props {
    position: THREE.Vector3
}
const BlueFlame : React.FC<Props> = ({position}: Props) => {
    const {scene} = useThree();
    const [particleSystem, setParticleSystem] = useState<NebulaSystem>();
    useFrame(() => {
        if (particleSystem) {
            NebulaEngine.update(particleSystem);
        }
    })

    useEffect(() => {
        NebulaEngine.loadSystem(json.particleSystemState as unknown as JSON, scene).then((nebulaSystem: Nebula) => {
            setParticleSystem(nebulaSystem);
            nebulaSystem.emitters[0].setPosition(position)
        });
        
    }, [])

    return (
       <>
       </>
    );
}

export default BlueFlame;