uniform sampler2D trailMap;
varying vec4 vPosition;

#define PI 3.14159265359

void main() {
    vec2 uv = 0.5*(vPosition.xy+vec2(1., 1.));
    vec4 oldColor = texture2D(trailMap, uv);

    // gl_FragColor = mix(vec4(0.2, 0.5, 1., 1.), oldColor, 0.15);
    gl_FragColor = vec4(0.99*oldColor.rgb, 1.);
}
