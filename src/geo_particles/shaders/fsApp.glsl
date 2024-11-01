uniform sampler2D apps;
varying vec3 vPosition;

#define PI 3.14159265359

float decodeFloat(float encoded) {
    float t = fract(encoded);
    return tan(PI*(t-0.5));
}

vec2 indexImage(vec2 p, int index) {
    int ix = index % 4;
    int iy = index / 4;
    return vec2(float(ix)/4.0+p.x/4.0, float(iy)/3.0+p.y/3.0);
}

void main() {
    int index = int(vPosition.y*10.0+100.0) % 12;
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(offset);
    vec2 p = indexImage(gl_PointCoord, index);
    vec4 color = texture2D(apps, p);
    if (color.a < 0.5)
        discard;
    gl_FragColor = color;
}
