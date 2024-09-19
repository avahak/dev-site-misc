uniform sampler2D trailMap;
varying vec2 vUv;
varying vec4 vPosition;

#define PI 3.14159265359

void main() {
    vec4 oldColor = texture2D(trailMap, vUv);

    // gl_FragColor = mix(vec4(0.2, 0.5, 1., 1.), oldColor, 0.15);
    gl_FragColor = vec4(0.99*oldColor.rgb, 1.);
}
