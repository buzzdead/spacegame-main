import { Vector3 } from 'three'
import { jwtVerify, SignJWT } from 'jose';
import { env } from 'process';
import { easing } from 'maath';
import { DampWithEase, EASING_POWER } from './constants';

export const getTargetPos = (target: any) => {
  const targetPos = target ? target.objectType === "Ship"
  ? target.objectLocation.meshRef?.position
  : target.objectType === "Construction"
  ? target.objectLocation.position
  : null : null;

  return targetPos
}

   const SECRET_KEY = process.env.REACT_APP_JWS_KEY;

   const TOKEN_EXPIRY = '24h'; // Replace with your desired token expiry

   export async function createJWT(payload: any) {
     const secret = new TextEncoder().encode(SECRET_KEY);
     const jwt = await new SignJWT(payload)
       .setProtectedHeader({ alg: 'HS256' })
       .setExpirationTime(TOKEN_EXPIRY)
       .sign(secret);
     return jwt;
   }

   export async function decodeJWT(token: any) {
    const secret = new TextEncoder().encode(SECRET_KEY);
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (error) {
      console.error('Failed to verify token:', error);
      return null;
    }
  }

  const handleEnter = (e: any) => {
    e.stopPropagation()
    document.body.style.cursor = "pointer"
    
  }

  const handleLeave = (e: any) => {
    e.stopPropagation()
    document.body.style.cursor = "default"
  }

  export const functions = { onPointerOut: handleLeave, onPointerEnter: handleEnter }

  export function easeOutCubic(t: number) {
    return (--t) * t * t + 1;
  }

  export function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  export const dampWithEase = ({ key, smoothOpen, smoothClose, damp, deltaMultiplier, stateRef, isOpen, delta }: DampWithEase) => {
    return easing.damp(
      stateRef.current,
      key,
      isOpen ? smoothOpen : smoothClose,
      damp,
      delta * deltaMultiplier,
      EASING_POWER * (key === "w" ? isOpen ? 0.5 : 3 : 1),
      easeInOutCubic
    ) ? 1 : 0;
  };

  export function getRandomPosition(width: number, height: number) {
    const x = (Math.random() * width) / 2;
    const y = (Math.random() * height) / 2;
    return { x, y };
  }