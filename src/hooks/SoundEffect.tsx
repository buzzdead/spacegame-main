import { useState, useEffect } from "react";
import {
  PositionalAudio,
  AudioListener,
  AudioLoader,
  Group,
  Camera,
  Object3DEventMap,
  Scene
} from "three";

interface Props {
    sfxPath: string
    scene: Group<Object3DEventMap> | Scene
    camera: Camera & {
        manual?: boolean | undefined; }
    minVolume?: number
    autoPlay?: boolean
    detune?: number
}

const UseSoundEffect = ({sfxPath, scene, minVolume = 0.1, camera, autoPlay = false, detune}: Props) => {
    const [sound, setSound] = useState<PositionalAudio>()
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
        camera.add(listener)
        if(detune) sound.detune = detune
        sound.setRefDistance(20);
        sound.setRolloffFactor(1);
      }, [])

      function calculateVolume(distance: number) {
        // Adjust these parameters based on your desired sound behavior
        const maxDistance = 75;
    
        let volume = 0.15 - Math.min(1, distance / maxDistance); // Linear decrease
        volume = Math.max(minVolume, volume); // Clamp to a minimum
        sound?.setVolume(volume)
        return volume;
      }
    return { sound, calculateVolume }
}

export default UseSoundEffect