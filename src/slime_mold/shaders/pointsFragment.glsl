varying vec4 vParticle;

#define PI 3.14159265359

void main() {
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(offset);
    // float t = 1.-smoothstep(0.4, 0.5, dist);
    if (dist > 0.5)
        discard;

    float energy = clamp(vParticle.w, 0.0, 1.0);
    vec4 col1 = vec4(0.2, 0.5, 1., 0.1);
    vec4 col2 = vec4(1., 0.5, 0.2, 0.1);
    gl_FragColor = mix(col1, col2, energy);

    // vec4 col1 = vec4(0.2, 0.5, 1., 1.0);
    // vec4 col2 = vec4(1., 0.5, 0.2, 0.02);
    // vec4 col3 = vec4(0.5, 1., 0.2, 0.02);
    // int state = int(floor(vParticle.w));
    // if (state == 0)
    //     gl_FragColor = col1;
    // else if (state == 1)
    //     gl_FragColor = col2;
    // else 
    //     gl_FragColor = col3;
}
