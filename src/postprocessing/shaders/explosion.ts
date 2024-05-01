export const vertex = /*glsl*/`
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec3 velocity;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vAngle = vec2(cos(angle), sin(angle));
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * pointMultiplier / gl_Position.w;  // Adjust point size based on distance
    vColour = vec4(color, 1.0);  // Assuming color is passed as an attribute
}`;

export const fragment = /*glsl*/`
uniform sampler2D diffuseTexture;
uniform float uTime;
varying vec4 vColour;
varying vec2 vAngle;

void main() {
    vec2 coords = gl_PointCoord * mat2(vAngle.x, -vAngle.y, vAngle.y, vAngle.x);
    gl_FragColor = texture2D(diffuseTexture, coords);
    // Interpolate towards red as time increases
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), uTime);
    gl_FragColor = vec4(gl_FragColor.rgb * vColour.rgb, gl_FragColor.a * (1.0 - uTime) * vColour.a);
}
`;