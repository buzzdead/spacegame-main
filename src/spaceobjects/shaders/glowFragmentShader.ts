export default /*glsl*/ `
uniform vec3 glowColor; // Color of the laser glow
uniform float glowStrength; // Strength of the glow effect
uniform float time; // Time uniform passed from component

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 cameraDirection = normalize(cameraPosition - vPosition);
  float viewAlignment = dot(vNormal, cameraDirection);
  vec3 fragmentToCenter = vPosition - laserMesh.position;
  float distance = length(fragmentToCenter);
  float normalizedDistance = distance / laserScale.z;
  float falloff = smoothstep(0.0, 0.5, normalizedDistance) * viewAlignment;

  // Introduce a time-based factor for pulsation
  float pulse = sin(time) * 0.5 + 0.5;

  float glow = smoothstep(0.6, 0.8, viewAlignment) * glowStrength * pulse;

  float glow = falloff * glowStrength * pulse;

  vec3 baseColor = vec3(1.0, 0.0, 0.0);

  vec3 finalColor = mix(baseColor, glowColor * glow, pow(viewAlignment, 2.0));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;