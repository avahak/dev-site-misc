uniform sampler2D reactions;
uniform sampler2D extraData;
flat in vec4 vParticle;
flat in vec3 vPosition;

#define PI 3.14159265359

float decodeFloat(float encoded) {
    float t = fract(encoded);
    return tan(PI*(t-0.5));
}

vec2 indexImage(vec2 p, int index, float size) {
    int ix = index % 8;
    int iy = index / 8;
    return vec2(
        (float(ix) + clamp(size*p.x + 0.5, 0.0, 1.0))/8.0, 
        (float(iy) + clamp(size*p.y + 0.5, 0.0, 1.0))/3.0
    );
}

void main() {
    vec4 extra = texture2D(extraData, vPosition.xy);
    int countryIndex = int(extra.r);
    int reactionIndex = int(extra.g);
    // int reactionIndex = int(vParticle.x*10.0+100.0) % 21;

    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(offset);

    float stateF = decodeFloat(vParticle.w);
    float t = mix(0.0, 1.0, stateF);

    float r1 = smoothstep(0.0, 1.0, t);
    float r2 = smoothstep(0.0, 0.7, 1.0-t);
    float size = 1.0/(0.1+0.9*r1);

    vec2 p = indexImage(offset, reactionIndex, size);
    vec4 colorImg = texture2D(reactions, p);

    vec4 colorBase = vec4(0.5, 0.5, 0.2, 1.0);  // SWE
    if (countryIndex == 1)  // NOR
        colorBase = vec4(0.5, 0.2, 0.2, 1.0);
    if (countryIndex == 2)  // FIN
        colorBase = vec4(0.2, 0.5, 0.2, 1.0);
    if (countryIndex == 3)  // DK
        colorBase = vec4(0.5, 0.2, 0.5, 1.0);

    if (dist < 0.07*r2) {
        gl_FragColor = mix(colorBase, colorImg, t);
        return;
    }

    if ((dist < 0.5/size) && (colorImg.a > 0.5)) {
        gl_FragColor = mix(colorBase, colorImg, t);
        return;
    }

    discard;

    // vec4 color = mix(colorBase, colorImg, t);
    // if ((dist < 0.1*r2) || ((dist*size < 1.0) && (colorImg.a > 0.5))) {
    //     gl_FragColor = color;
    //     return;
    // } else 
    //     discard;
}
