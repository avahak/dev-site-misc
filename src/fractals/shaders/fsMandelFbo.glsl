precision highp float;

uniform sampler2D mandelMap;
uniform vec4 box;
uniform vec2 resolution;
uniform int restart;            // 0: continue with mandelMap, 1: restart from zero
varying vec4 vPosition;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
    vec4 tex = (restart == 1) ? vec4(0.0, 0.0, 0.0, 1.0) : texture2D(mandelMap, vUv);

    vec2 c = vec2(mix(box.x, box.z, vUv.x), mix(box.y, box.w, vUv.y));
    vec2 z = tex.xy;
    float iter = tex.z;

    int k;
    for (k = 0; (k < 10) && (z.x*z.x + z.y*z.y < 100.0); k++) {
        float temp = 2.0*z.x*z.y + c.y;
        z.x = z.x*z.x - z.y*z.y + c.x;
        z.y = temp;
    }
    iter = iter + float(k);

    gl_FragColor = vec4(z, iter, 1.0);
}
