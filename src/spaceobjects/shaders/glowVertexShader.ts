export default /*glsl*/ `
precision mediump float;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
uniform bool fireIcon; // Add a uniform for the fireIcon variable
vec3 rotateY(vec3 v, float angle) {
  return vec3(
    v.x * cos(angle) - v.z * sin(angle),
    v.y,
    v.x * sin(angle) + v.z * cos(angle)
  );
}
void main() {
  vec3 pos = position;
  if (fireIcon) {
    // If fireIcon is true, use a cone shape
    pos.x += sin(time * 0.001 + pos.y * 0.01) * 0.05;
    pos.z += cos(time * 0.001 + pos.x * 0.01) * 0.05;
    pos = rotateY(pos, time * 0.001) * 2.0;
  } else {
    // If fireIcon is false, use a square shape
    pos.x += sin(time * 0.001 + pos.y * 0.01) * 0.05;
    pos.z += cos(time * 0.001 + pos.x * 0.01) * 0.05;
  }
  vPosition = pos;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;
