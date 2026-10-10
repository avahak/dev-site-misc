precision highp float;

uniform sampler2D u_seedData; // Row 0 = position, Row 1 = RGB color
uniform int u_seedCount;
uniform float u_R_tex;

varying vec2 vUv;

// Hyperbolic distance formula in Poincaré disk model
float _hypDistance(vec2 z1, vec2 z2) {
    vec2 diff = z1 - z2;
    // (1 - z2_conj * z1) = (1 - x1*x2 - y1*y2) + i (x2*y1 - x1*y2)
    vec2 den = vec2(
        1.0 - z2.x * z1.x - z2.y * z1.y,
        z2.x * z1.y - z1.x * z2.y
    );
    
    float numLen = length(diff);
    float denLen = length(den);
    float delta = clamp(numLen / max(denLen, 1e-10), 0.0, 0.99999);
    
    return 2.0 * atanh(delta); // 2 * artanh(delta) = log((1+delta)/(1-delta))
}

// Alternative direct artanh formulation
float hypDistance(vec2 z1, vec2 z2) {
    vec2 diff = z1 - z2;
    float numSq = dot(diff, diff);
    
    vec2 den = vec2(
        1.0 - (z2.x * z1.x + z2.y * z1.y),
        z2.x * z1.y - z1.x * z2.y
    );
    float denSq = dot(den, den);
    float delta = sqrt(clamp(numSq / max(denSq, 1e-10), 0.0, 0.99999));
    
    return log((1.0 + delta) / max(1.0 - delta, 1e-8));
}

void main() {
    // Convert screen UV [0,1]^2 to Poincaré coordinates [-R_tex, R_tex]^2
    vec2 z = (vUv * 2.0 - 1.0) * u_R_tex;

    // Background color if outside Poincaré disk unit circle
    if (dot(z, z) >= 1.0) {
        gl_FragColor = vec4(0.05, 0.05, 0.07, 1.0);
        return;
    }

    float minDistance = 1e10;
    vec3 winningColor = vec3(0.1);

    // Loop through all expanded orbit seeds in S
    for (int k = 0; k < 4096; k++) {
        if (k >= u_seedCount) 
            break;

        // Fetch position from row 0 (y = 0.25 in normalized texel UV)
        vec2 seedPos = texture2D(u_seedData, vec2((float(k) + 0.5) / float(u_seedCount), 0.25)).xy;
        
        float dist = hypDistance(z, seedPos);

        if (dist < minDistance) {
            minDistance = dist;
            // Fetch color from row 1 (y = 0.75 in normalized texel UV)
            winningColor = texture2D(u_seedData, vec2((float(k) + 0.5) / float(u_seedCount), 0.75)).rgb;
        }
    }

    // Output winning cell color with subtle edge shading
    vec3 col = winningColor * (0.5 + 0.5 * smoothstep(0.0, 0.5, pow(minDistance, 1.5)));
    // vec3 col = winningColor;
    gl_FragColor = vec4(col, 1.0);
}