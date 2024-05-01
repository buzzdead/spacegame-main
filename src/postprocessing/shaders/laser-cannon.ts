export const vertex = /*glsl*/ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragment = /*glsl*/ `
      varying vec2 vUv;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float time;
      void main() {
        // Use both vUv.x and vUv.y for a diagonal gradient
        float gradient = sin(vUv.x * 3.0 + vUv.y * 1.5 + time) * 0.5 + 0.5;
        vec3 color = mix(color1, color2, gradient);
        gl_FragColor = vec4(color, 1.0);
      }
    `;