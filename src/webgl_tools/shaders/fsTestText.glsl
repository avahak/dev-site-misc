precision highp float;

uniform vec2 resolution;
uniform sampler2D tex;

in vec4 vPos;
in vec2 vUv;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
    vec2 unitRange = vec2(1.5)/vec2(384.0);
    vec2 screenTexSize = vec2(1.0)/fwidth(vUv);
    return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

void main() {
    float aspect = resolution.x / resolution.y;

    vec3 msd = texture(tex, vUv).rgb;
    float sd = median(msd.r, msd.g, msd.b);
    float screenPxDistance = screenPxRange()*(sd - 0.5);
    float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);

    gl_FragColor = vec4(vec3(1.0), opacity);
    // gl_FragColor = vec4(0.1, 0.2, 0.5+0.5*sin(100.0*aspect), 1.0);
}