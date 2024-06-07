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
        if(updatedSelected.length < 2) return
    
        const updatedShips = updatedSelected.map((s, id) => {
            if (id === 0) return s;
    
            const newShip = { ...s };
            const shiftDirection = id % 2 === 1 ? 'right' : 'left';
            if (newShip.meshRef) {
                newShip.meshRef.shipShift = { shift: shiftDirection, multiplyer: i };
            }
            if (shiftDirection === 'left') {
                i *= 1.75;
            }
            return newShip;
        }).filter(ship => ship !== undefined); // Filter out any undefined entries
    
        if (updatedShips.length > 0) setShipShift(updatedShips);
    };

    useEffect(() => {
       setTimeout(() => delayedChecker.current = true, 3500);
    }, []);

    useFrame(() => {
        if (keys) {
            // Check for Ctrl + 1 to 9
            for (let i = 1; i <= 9; i++) {
                if (keys["ControlLeft"] && keys[`Digit${i}`]) {
                    const selectedIds = selected.map(s => s.id);
                    setShipGroups(prevGroups => ({
                        ...prevGroups,
                        [i]: selectedIds
                    }));
                    break; // Ensure we only set one group at a time
                }
            }

            // Check for 1 to 9 to select groups
            for (let i = 1; i <= 9; i++) {
                if (keys[`Digit${i}`] && !keys["ControlLeft"]) {
                    const group = shipGroups[i];
                    if (group) {
                        setSelected(group, false, true);
                    }
                    else (setSelected('1', true, true))
                    break; // Ensure we only select one group at a time
                }
            }
        }
        if (delayedChecker.current) { 
            shiftShips(); 
            delayedChecker.current = false; 
            setTimeout(() => delayedChecker.current = true, 3500);
        }
    });

    return null;
};