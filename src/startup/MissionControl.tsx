import { useEffect, useState } from "react"
import useStore, { useShallowStore } from "../store/UseStore"
import UseSoundEffect from "../hooks/SoundEffect"
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AudioLoader, Vector3 } from "three"

export const MissionControl = () => {
    const {scene, camera} = useThree()
    const { constructions, addShip } = useShallowStore(["addShip", "constructions"])
    const [missionCompleted, setMissionCompleted] = useState(false)
    const t = useGLTF("/assets/spaceships/mothershipp.glb")
    const { sound: missionCompletedSound, calculateVolume: calculateMissionCompletedSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/scientist-discovery.mp3",
      scene: scene,
      minVolume: 10,
      camera: camera,
      position: new Vector3(400, 50, 750),
    });
    useEffect(() => {
        const enemyConstructions = constructions.filter(c => c.type === "Enemy")
        console.log(enemyConstructions)
        if(enemyConstructions.length === 0 && constructions.length !== 0) setMissionCompleted(true)
    }, [constructions])

    useEffect(() => {
        if(missionCompleted) {
            addShip("hullspaceship",[400, 50, 250], 999, 0.33)
            missionCompletedSound?.stop(); 
            missionCompletedSound?.play();
        }
    }, [missionCompleted])
    useEffect(() => {
          const distance = 1;
          calculateMissionCompletedSound(distance);
        
      }, [camera, constructions]);
    return null
}