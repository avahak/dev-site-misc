precision highp float;

uniform int numChars;
uniform sampler2D offsetCoordsTexture;
uniform sampler2D atlasCoordsTexture;
uniform sampler2D atlasTexture;
uniform vec2 resolution;

in vec4 vPos;
in vec2 vUv;
in vec4 atlasCoords;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
    vec2 unitRange = vec2(1.5)/vec2(384.0);
    vec2 screenTexSize = vec2(1.0)/fwidth(vUv*(atlasCoords.zw - atlasCoords.xy));
    return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

void main() {
    vec2 p = atlasCoords.xy + vUv*(atlasCoords.zw - atlasCoords.xy);
    vec3 msd = texture(atlasTexture, p).rgb;
    float sd = median(msd.r, msd.g, msd.b);
    float screenPxDistance = screenPxRange()*(sd - 0.5);
    float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);

    // Hacky
    if (opacity > 0.1) {
        gl_FragColor = vec4(vec3(1.0), opacity);
        // gl_FragColor = vec4(vec3(opacity), 1.0);
        // gl_FragColor = vec4(msd, 1.0);
        // gl_FragColor = vec4(p, 0.0, 1.0);
        // gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0);
    } else {
        discard;
    }
}