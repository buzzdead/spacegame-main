export default /*glsl*/ `
uniform vec3 glowColor;
uniform float glowStrength;
varying vec3 vNormal;

void main() {
    // Adjust this threshold for the glow extent
    const float threshold = 0.8; 

    float angleFactor = 1.0 - dot(vNormal, normalize(vec3(0, 0, 1))); 
    float glow = clamp(glowStrength * angleFactor, 0.0, 1.0);

    // Optional: Mix in a fraction of the original surface color
    vec3 finalColor = mix(glowColor * glow, vec3(1.0, 0.8, 0.5), 0.3); // Example

    gl_FragColor = vec4(finalColor,  1.0); 
}
`;