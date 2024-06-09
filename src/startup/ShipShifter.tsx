import { useEffect, useRef, useState } from "react";
import { useShallowStore } from "../store/UseStore";
import { useFrame } from '@react-three/fiber';
import { useKeyboard } from "../hooks/Keys";

export const ShipShifter = () => {
    const { selected, setShipShift, setSelected } = useShallowStore(["selected", "setShipShift", "setSelected"]);
    const delayedChecker = useRef(false);
    const keys = useKeyboard()
    const [shipGroups, setShipGroups] = useState<Record<number, string[]>>({});

    const shiftShips = () => {
        let i = 0.1;

        const updatedSelected = selected.filter(s => s.meshRef?.shipShift === undefined)
    
        const updatedShips = updatedSelected.map((s, id) => {
            if (id === 0) return s;
    
            const newShip = { ...s };
            const shiftDirection = id % 2 === 1 ? 'right' : 'left';
            if (newShip.meshRef) {
                newShip.meshRef.shipShift = { shift: shiftDirection, multiplyer: i };
            }
            if (shiftDirection === 'left') {
                i *= (i > 2 ? 1.5 : 1.75);
            }
            return newShip;
        }).filter(ship => ship !== undefined); // Filter out any undefined entries
    
        
    };

    useEffect(() => {
       setTimeout(() => delayedChecker.current = true, 3500);
    }, []);

    useFrame(() => {
        if (keys && keys["ControlLeft"]) {
            for (let i = 1; i <= 9; i++) {
                if (keys[`Digit${i}`]) {
                    const selectedIds = selected.map(s => s.id);
                    setShipGroups(prevGroups => ({
                        ...prevGroups,
                        [i]: selectedIds
                    }));
                    break;
                }
            }
        }
        else if (keys && !keys["ControlLeft"]){
            for (let i = 1; i <= 9; i++) {
                if (keys[`Digit${i}`]) {
                    const group = shipGroups[i];
                    if (group) {
                        setSelected(group, false, true);
                    }
                    else (setSelected('1', true, true))
                    break;
                }
            }}
        
        if (delayedChecker.current) { 
            shiftShips(); 
            delayedChecker.current = false; 
            setTimeout(() => delayedChecker.current = true, 3500);
        }
    });

    return null;
};