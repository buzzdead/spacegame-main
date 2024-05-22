import { useEffect, useState } from "react"
import useStore, { useShallowStore } from "../store/UseStore"
import UseSoundEffect from "../hooks/SoundEffect"
import { useThree, useFrame, useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AudioLoader, Vector3 } from "three"
import { EffectComposer, ShockWave } from "@react-three/postprocessing"
import { SWave } from "../spaceobjects/ships/EnemyShip/swave"
import { useAsset } from "../hooks/Asset"

export const MissionControl = () => {
    const {camera} = useThree()
    const { constructions, addShip, addCelestialObject, setDestination, findShip, missions } = useShallowStore(["addShip", "constructions", "addCelestialObject", "setDestination", "findShip", "missions"])
    const [missionCompleted, setMissionCompleted] = useState(false)
    const [blastShockWave, setBlastShockWave] = useState(false)
    const [hullShip, setHullShip] = useState<any>(null)
    useAsset("/assets/spaceships/mothershipp.glb", 1, true)
    useAsset("/assets/celestialobjects/sphere.glb", 1, true)
    const { sound: missionCompletedSound, calculateVolume: calculateMissionCompletedSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/scientist-discovery.mp3",
      minVolume: 4,
      position: new Vector3(400, 50, 750),
    });
    const handleTheTimeout = () => {
        setBlastShockWave(true)
        setTimeout(() => setBlastShockWave(false), 5000)
    }
    useEffect(() => {
        if(missions.some(m => m.completed)) {
           setTimeout(handleTheTimeout, 8000)
        }
    }, [missions])
    useEffect(() => {
        const enemyConstructions = constructions.filter(c => c.type === "Enemy")
        if(enemyConstructions.length === 0 && constructions.length !== 0) setMissionCompleted(true)
    }, [constructions])
    useEffect(() => {
        if(!hullShip || hullShip?.meshRef?.position) return
        const abc = findShip(hullShip.id)
        setHullShip(abc)
    }, [hullShip])
    useEffect(() => {
        if(missionCompleted) {
            const theShip = addShip("hullspaceship",[0, 0, 100], 999, 0.33)
            setHullShip(theShip)
            addCelestialObject("sphere", [250, 50, 750], .05)
            missionCompletedSound?.stop(); 
            missionCompletedSound?.play();
        }
    }, [missionCompleted])
    useEffect(() => {
        if(!hullShip?.meshRef?.position) return
          calculateMissionCompletedSound(hullShip?.meshRef?.position || hullShip.position);
        
      }, [camera.position, constructions, hullShip]);

   
    return blastShockWave ? <EffectComposer><SWave pos={new Vector3(250, 50,  750)}  /></EffectComposer> : null
}