import React, { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three'
import { EffectComposer, wrapEffect } from '@react-three/postprocessing';
import {ShockWaveEffect} from './test2'; // Import your recreated effect

interface Props {
  pos: Vector3;
  scan: boolean;
}

const SWave = wrapEffect(ShockWaveEffect)

export const ShockWaveComponent = ({ pos, scan }: Props) => {
  const [Wave, setWave] = useState<any>(null)
  const { camera, scene } = useThree();
  const ref = useRef<any>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.position = pos;
      ref.current.explode();
    }
  }, [scan]);
  useEffect(() => {
    const SWave2 = wrapEffect(ShockWaveEffect)
    setWave(SWave2)
  }, [])
  
  if(!Wave) return null
  return (
    <Wave pos={pos} camera={camera} ref={ref}/>
  );
};

export default ShockWaveComponent;