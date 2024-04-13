export default /*glsl*/ `
uniform vec3 glowColor;
uniform float glowStrength;
varying vec3 vNormal;

void main() {
  // Adjust the glow extent
  const float threshold = 0.8; 

  // Calculate how much the surface faces the view direction
  float viewAlignment = dot(vNormal, normalize(vec3(0, 0, 1))); 

  // Control glow falloff with a smooth curve
  float glow = smoothstep(threshold - 0.1, threshold + 0.1, viewAlignment) * glowStrength;

  // Ensure glow stays within 0.0 to 1.0 range
  glow = clamp(glow, 0.0, 1.0);

  // Mix with optional base color (modify the mix factor if desired)
  vec3 finalColor = mix(glowColor * glow, vec3(1.0, 0.8, 0.5), 0.3);

  gl_FragColor = vec4(finalColor, 1.0); 
}
`;