export const vertex = /* glsl */ `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec3 velocity;

varying vec2 vAngle;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vAngle = vec2(cos(angle), sin(angle));
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * pointMultiplier / gl_Position.w; // Adjust point size based on distance
}
`;
export const fragment = /*glsl*/`
uniform sampler2D diffuseTexture;
uniform float uTime;
varying vec2 vAngle;

void main() {
    vec2 coords = gl_PointCoord * mat2(vAngle.x, -vAngle.y, vAngle.y, vAngle.x) - 0.5;
    vec4 texColor = texture2D(diffuseTexture, coords + 0.5);
    // Make smoke darker over time
    float darkenFactor = (1.0 - uTime);
    gl_FragColor = vec4(texColor.rgb * darkenFactor, texColor.a);
}
`;