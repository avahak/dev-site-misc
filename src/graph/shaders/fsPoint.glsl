varying vec4 vColor;
        
void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float alpha = 1.0 - smoothstep(0.45, 0.5, length(coord));
    if (alpha*vColor.a < 0.1) 
        discard;
    gl_FragColor = vec4(vColor.rgb, alpha*vColor.a);
}