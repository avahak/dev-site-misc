uniform sampler2D reactions;
varying vec4 vParticle;

#define PI 3.14159265359

float decodeFloat(float encoded) {
    float t = fract(encoded);
    return tan(PI*(t-0.5));
}

vec2 indexImage(vec2 p, int index) {
    int ix = index % 8;
    int iy = index / 8;
    return vec2(float(ix)/8.0+p.x/8.0, float(iy)/3.0+p.y/3.0);
}

void main() {
    int index = int(vParticle.x*10.0+100.0) % 21;
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(offset);
    vec2 p = indexImage(gl_PointCoord, index);
    vec4 colorImg = texture2D(reactions, p);
    float s = 1.-smoothstep(0.4, 0.5, dist);
    vec4 colorBase = vec4(0.2, 0.2, 0.5, s);

    float stateF = decodeFloat(vParticle.w);
    float t = mix(0.0, 1.0, stateF);
    vec4 color = mix(colorBase, colorImg, t);
    gl_FragColor = color;
}
