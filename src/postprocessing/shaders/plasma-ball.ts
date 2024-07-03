// plasma-beam.ts

export const vertex = /*glsl*/ `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragment = /*glsl*/ `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform vec3 color1;
uniform vec3 color2;
uniform float time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float r = length(uv);
    float theta = atan(uv.y, uv.x);

    // Create electric branches
    float branches = 26.0;
    float branch = abs(mod(theta + time * 0.5, 2.0 * 3.14159 / branches) - 3.14159 / branches);
    branch = pow(sin(branch * branches), 10.0);

    // Add noise to the branches
    vec2 noiseInput = uv * 3.0 + vec2(time * 0.1);
    float noise = fbm(noiseInput) * 0.5 + 0.5;
    branch *= noise;

    // Create the core
    float core = smoothstep(0.01, 0.0, r);

    // Combine core and branches
    float energy = max(branch * (1.0 - r), core);

    // Color the plasma
    vec3 plasmaColor = mix(color1, color2, energy);
    plasmaColor += vec3(1.0, 0.6, 0.3) * pow(energy, 3.0);

    // Add glow
    float glow = pow(1.0 - r, 6.0);
    plasmaColor += color2 * glow * 0.3;

    // Set alpha for transparency
    float alpha = 0.05 + energy * 0.9 + glow * .5;

    // Cut off effect at sphere edge
    if (r > 1.0) {
        alpha = 0.035;
    }

    gl_FragColor = vec4(plasmaColor * time, alpha);
}
`;