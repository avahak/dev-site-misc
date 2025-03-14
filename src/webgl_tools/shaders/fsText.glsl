precision highp float;

uniform int numChars;
uniform sampler2D atlasTexture;
uniform vec2 unitRange;

in vec2 atlasCoords;
in vec3 color;
in vec2 vUv;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
    vec2 screenTexSize = vec2(1.0) / fwidth(atlasCoords);
    return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

void main() {
    // Needed if rendered with antialiasing. Without this extra samples 
    // can fall outside the rectangle and sample atlasTexture from another character.
    if (vUv.x < 0.0 || vUv.y < 0.0 || vUv.x > 1.0 || vUv.y > 1.0)
        discard;

    vec3 msd = texture(atlasTexture, atlasCoords).rgb;
    float sd = median(msd.r, msd.g, msd.b);
    float screenPxDistance = screenPxRange()*(sd - 0.5);
    float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

    // Hacky but no easy solution
    if (alpha > 0.1) {
        gl_FragColor = vec4(color, alpha);
    } else {
        // gl_FragColor = vec4(vec3(0.1, 0.2, 0.3), 1.0);
        discard;
    }
    // gl_FragColor = vec4(vec3(1.0), 1.0);
}