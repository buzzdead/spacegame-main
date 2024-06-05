import { useRef } from "react";
import useStore from "../../store/UseStore";
import { useFrame } from '@react-three/fiber'

interface Props {
  shipId: string;
  destroyShip: () => void;
  friend?: boolean
}
export const FriendShipHull = ({ shipId, destroyShip, friend = false}: Props) => {
  const ships = useStore(state => state.ships);

  const selectedShip = ships?.find(s => s.id.toString() === shipId.toString())
  const destroyed = useRef(false)
  useFrame(() => {
    if(!friend) return
    if(!selectedShip || destroyed.current || !selectedShip.meshRef) return
    if(selectedShip.meshRef.hull <= 0) {destroyed.current = true; destroyShip();}
  })

return null
};
