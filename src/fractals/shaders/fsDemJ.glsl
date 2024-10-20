precision highp float;

uniform sampler2D juliaMap;
uniform vec4 box;
uniform vec2 resolution;
uniform vec2 subpixelOffset;    // [-0.5,0.5]x[-0.5,0.5]
uniform vec2 c;
uniform int restart;            // 1: restart from zero
varying vec4 vPosition;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
    vec2 cSubpixelOffset = subpixelOffset / resolution * vec2(box.z-box.x, box.w-box.y);
    vec2 z0 = vec2(mix(box.x, box.z, vUv.x), mix(box.y, box.w, vUv.y)) + cSubpixelOffset;
    
    vec4 tex = (restart == 1) ? vec4(z0, 1.0, 0.0) : texture2D(juliaMap, vUv);

    vec2 z = tex.xy;
    vec2 w = tex.zw;

    int k;
    float temp;
    for (k = 0; (k < 2000) && (length(z) < 1.0e2); k++) {

        if (length(w) < 1.0e32) {
            temp = 2.0*z.x*w.y + 2.0*z.y*w.x;
            w.x = 2.0*z.x*w.x - 2.0*z.y*w.y;
            w.y = temp;
        }

        temp = 2.0*z.x*z.y + c.y;
        z.x = z.x*z.x - z.y*z.y + c.x;
        z.y = temp;
    }

    gl_FragColor = vec4(z, w);
}
