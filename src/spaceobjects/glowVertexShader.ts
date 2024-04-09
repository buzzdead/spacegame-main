export default /*glsl*/ `
varying vec3 vNormal;

void main() {
    vNormal = normalize(normalMatrix * normal); // Transform normal to view space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
