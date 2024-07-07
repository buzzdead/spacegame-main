// plasma-splash.ts

export const vertex = /*glsl*/ `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float duration;
  
  void main() {
    vUv = uv;
    vPosition = position;
    float scale = max(0.0, 1.0 + duration);
    // Add some movement to the vertices
    vec3 pos = position;
    pos.x += sin(pos.y * 10.0 + time * 2.0) * 0.1;
    pos.y += cos(pos.x * 10.0 + time * 2.0) * 0.1;
    pos.z += sin(pos.x * 10.0 + cos(pos.y * 10.0) + time * 2.0) * 0.1;
    pos *= scale;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragment = /*glsl*/ `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float time;
  uniform float duration;
  
  void main() {
    float d = length(vUv - 0.5);
    float alpha = smoothstep(0.5, 0.2, d);
    
    vec3 color = mix(color1, color2, sin(d * 10.0 - time * 5.0) * 0.5 + 0.5);
    float fadeOut = max(0.0, 1.0 - duration);
    // Add some energy ripples
    color += vec3(0.5) * smoothstep(0.2, 0.0, abs(sin(d * 20.0 - time * 10.0)));
    alpha *= fadeOut;
    
    gl_FragColor = vec4(color, alpha);
  }
`;