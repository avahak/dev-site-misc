varying vec3 vColor;
        
void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float alpha = 1.0 - smoothstep(0.45, 0.5, length(coord));
    if (alpha < 0.2) 
        discard;
    gl_FragColor = vec4(vColor, alpha);
}