import { useEffect, useRef } from "react";
import { useShallowStore } from "../store/UseStore";
import { useFrame } from '@react-three/fiber';

export const ShipShifter = () => {
    const { selected, setShipShift } = useShallowStore(["selected", "setShipShift"]);
    const delayedChecker = useRef(false);

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
                i *= 1.75;
            }
            return newShip;
        }).filter(ship => ship !== undefined); // Filter out any undefined entries
    
        if (updatedShips.length > 0) setShipShift(updatedShips);
    };

    useEffect(() => {
       setTimeout(() => delayedChecker.current = true, 1500);
    }, []);

    useFrame(() => {
        if (delayedChecker.current) { 
            shiftShips(); 
            delayedChecker.current = false; 
            setTimeout(() => delayedChecker.current = true, 1500);
        }
    });

    return null;
};