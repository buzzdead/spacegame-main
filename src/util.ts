import { Vector3 } from 'three'
import { jwtVerify, SignJWT } from 'jose';

export const getTargetPos = (target: any) => {
  const targetPos = target ? target.objectType === "Ship"
  ? target.objectLocation.meshRef?.position
  : target.objectType === "Construction"
  ? target.objectLocation.position
  : null : null;

  return targetPos
}

   const SECRET_KEY = 'your-secret-key'; // Replace with your actual secret key
   const TOKEN_EXPIRY = '1h'; // Replace with your desired token expiry

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
    document.body.style.cursor = "grab"
  }

  export const functions = { onPointerOut: handleLeave, onPointerEnter: handleEnter }