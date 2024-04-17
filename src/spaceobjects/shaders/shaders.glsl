
const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
        vUv = uv;

        // Simple upward displacement over time
        vec3 pos = position + vec3(0.0, sin(uTime) * 0.1, 0.0);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

// Basic Fragment Shader
const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`;