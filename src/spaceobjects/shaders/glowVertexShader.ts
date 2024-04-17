export default /*glsl*/ `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal); // Transform normal to view space
  vPosition = position; // Pass position to fragment shader
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
