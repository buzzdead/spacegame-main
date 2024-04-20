export default /*glsl*/ `
precision mediump float;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
uniform vec3 color; // Add a uniform for the color

void main() {
  vec3 baseColor = vec3(1.0, 0.0, 0.0); // Red
  vec3 targetColor = vec3(1.0, 0.5, 0.0); // Orange
  float glow = sin(time * 0.001) * 0.5 + 0.5; // Animate the glow over time
  vec3 finalColor = mix(baseColor, targetColor, glow); // Interpolate between red and orange
  float glowFactor = sin(time * 0.01) * 2.0; // Add a glow factor
  finalColor += vec3(glowFactor); // Add the glow factor to the color
  gl_FragColor = vec4(finalColor, 1.0);
}
`;