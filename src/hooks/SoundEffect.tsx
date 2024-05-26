import { useState, useEffect } from "react";
import { useThree } from '@react-three/fiber'
import {
  PositionalAudio,
  AudioListener,
  AudioLoader,
  Vector3
} from "three";

interface Props {
    sfxPath: string
    minVolume?: number
    autoPlay?: boolean
    detune?: number
    position?: Vector3
}

const UseSoundEffect = ({sfxPath, minVolume = 0.1, autoPlay = false, detune, position}: Props) => {
    const [sound, setSound] = useState<PositionalAudio>()
    const { scene, camera } = useThree()
    useEffect(() => {
        const listener = new AudioListener();
        const audioLoader = new AudioLoader();
        const sound = new PositionalAudio(listener);
        sound.setVolume(0.33)
        audioLoader.load(sfxPath, (buffer) => {
          sound.setBuffer(buffer);
        });
        setSound(sound)
        scene.add(sound)
        sound.autoplay = autoPlay
        if(position) sound.position.set(position.x, position.y, position.z)
        camera.add(listener)
        if(detune) sound.detune = detune
        sound.setRefDistance(20);
        sound.setRolloffFactor(1);
      }, [])

      function calculateVolume(position: Vector3) {
        // Adjust these parameters based on your desired sound behavior
          const maxDistance = 75;
          const distance = camera.position.distanceTo(position)
      
          let volume = 0.15 - Math.min(1, distance / maxDistance); // Linear decrease
          volume = Math.max(minVolume, volume); // Clamp to a minimum
          sound?.setVolume(volume)
          sound?.position.set(position.x, position.y, position.z)
        return volume;
      }
    return { sound, calculateVolume }
}

export default UseSoundEffect