uniform vec2 resolution;
uniform vec3 cameraPos;
uniform mat4 invVpMat;     // inv(mvpMatrix) of the main camera
uniform float time;
uniform sampler2D texB;
uniform sampler2D texF;
uniform sampler2D texR;
uniform float debug1;
uniform float debug2;
uniform float debug3;
uniform float debug4;

in vec4 vPos;
in vec2 vUv;
in mat4 pvmMat;

const float EP = 1.0e-5;

/**
 * Solid base texture: returns a color from one of 10 hard-edged patterns.
 * All patterns have a characteristic feature scale of roughly 1 unit.
 */
vec3 solid_base(vec3 p, int pattern) {
    // Pattern 0: 3D checkerboard, cells of size 1, red vs blue
    if (pattern == 0) {
        vec3 cell = floor(p);
        float mask = mod(cell.x + cell.y + cell.z, 2.0);
        return mask < 0.5 ? vec3(1.0, 0.2, 0.2) : vec3(0.2, 0.4, 1.0);
    }
    // Pattern 1: X‑axis stripes, period 1, yellow vs green
    if (pattern == 1) {
        float stripe = step(0.0, sin(p.x * TAU));
        return mix(vec3(0.9, 0.9, 0.1), vec3(0.1, 0.8, 0.1), stripe);
    }
    // Pattern 2: Diagonal bands along (1,1,1) with spacing 1, hue from band id
    if (pattern == 2) {
        float id = floor(dot(p, normalize(vec3(1.0, 1.0, 1.0))));
        float hue = fract(id * 0.142857 + 0.3);
        return 0.5 + 0.5 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));
    }
    // Pattern 3: Each unit cube gets a random solid color
    if (pattern == 3) {
        vec3 cell = floor(p);
        vec3 h = hash33(cell);
        float hue = h.x;
        float bright = 0.7 + 0.3 * h.y;
        vec3 col = 0.5 + 0.5 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));
        return col * bright;
    }
    // Pattern 4: FBM noise thresholded into 4 colour bands
    if (pattern == 4) {
        float n = (fbm33(p, 1.0).x + 1.0) * 0.5; // roughly 0..1
        if (n < 0.25) return vec3(1.0, 0.0, 1.0); // magenta
        if (n < 0.5)  return vec3(0.0, 1.0, 1.0); // cyan
        if (n < 0.75) return vec3(1.0, 1.0, 0.0); // yellow
        return vec3(1.0, 0.5, 0.0);               // orange
    }
    // Pattern 5: Spherical shells, radius step = 1, alternating green and purple
    if (pattern == 5) {
        float r = length(p);
        float shell = floor(r);
        float mask = mod(shell, 2.0);
        return mask < 0.5 ? vec3(0.2, 0.9, 0.4) : vec3(0.9, 0.3, 0.9);
    }
    // Pattern 6: Voronoi-like cells (shifted grid), each cell a random color
    if (pattern == 6) {
        vec3 cell = floor(p + 0.5);
        vec3 h = hash33(cell);
        float hue = h.x;
        float bright = 0.6 + 0.4 * h.y;
        vec3 col = 0.5 + 0.5 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));
        return col * bright;
    }
    // Pattern 7: Value noise quantized into 6 discrete colours
    if (pattern == 7) {
        float val = vnoise33(p).x;
        if (val < 0.2)      return vec3(0.8, 0.0, 0.0);
        else if (val < 0.4) return vec3(0.0, 0.8, 0.0);
        else if (val < 0.6) return vec3(0.0, 0.0, 0.8);
        else if (val < 0.8) return vec3(0.8, 0.8, 0.0);
        else                return vec3(0.8, 0.4, 0.0);
    }
    // Pattern 8: Sine product egg‑crate, period 1, black vs yellow
    if (pattern == 8) {
        float s = sin(p.x * TAU) * sin(p.y * TAU) * sin(p.z * TAU);
        float band = step(0.0, s);
        return band < 0.5 ? vec3(0.1, 0.1, 0.1) : vec3(0.9, 0.9, 0.0);
    }
    // Pattern 9: Turbulent marble with sharp threshold, orange vs blue
    // (fallback / default)
    float n = fbm33(p, 1.2).x;
    n = abs(n);
    n = fract(n * 4.0);
    float band = step(0.5, n);
    return band < 0.5 ? vec3(0.95, 0.4, 0.1) : vec3(0.1, 0.5, 0.95);
}

/**
 * Compound solid texture: combines three base patterns in a patchwork,
 * with a dimmed FBM underlay that adds variation at all scales.
 *
 * - The space is divided into cubic cells of size 3.
 * - Each cell randomly selects one of three base patterns, giving sharp boundaries.
 * - A low‑amplitude FBM is added everywhere; its hue depends on `pattern`.
 * - The three base patterns are chosen from `pattern` using:
 *   a = pattern % 10, b = (pattern + 3) % 10, c = (pattern + 7) % 10.
 */
vec3 solid_compound(vec3 p, int pattern) {
    p += vec3(TAU/SQRT2);  // trying to avoid pattern changes exactly at mesh boundaries
    // Cell size for the patchwork – large enough to make each texture region visible
    const float cellSize = 3.0;

    // Three base pattern indices derived from the compound pattern number
    int a = pattern % 10;
    int b = (pattern + 3) % 10;
    int c = (pattern + 7) % 10;

    // Which base pattern to use for this cell
    ivec3 cell = ivec3(floor(p / cellSize));
    float sel = hash33(vec3(cell)).x;
    int chosen;
    if (sel < 0.333)      chosen = a;
    else if (sel < 0.666) chosen = b;
    else                  chosen = c;

    // Evaluate the selected base pattern
    vec3 col = solid_base(p, chosen);

    // Dimmed FBM overlay with hue varying per compound pattern
    float fbm_val = fbm33(p * 1.0, 0.7).x * 0.42;
    float fbm_hue = fract(float(pattern) * 0.1618033);
    vec3 fbm_color = 0.5 + 0.5 * cos(TAU * (fbm_hue + vec3(0.0, 0.33, 0.67)));

    // Mix the FBM variation into the solid base colour
    col = clamp(col + fbm_color * fbm_val, 0.0, 1.0);

    return col;
}

vec3 worldPosition(float depth) {
    vec3 ndc = 2.0*vec3(vUv.x, vUv.y, depth) - 1.0;
    vec4 wph = invVpMat * vec4(ndc, 1.0);
    return wph.xyz / wph.w;
}

void main() {
    vec4 plane = vec4(cos(time), 0.0, sin(time), 0.25);

    vec2 colB = texture(texB, vUv).rg;
    vec2 colF = texture(texF, vUv).rg;
    vec2 colR = texture(texR, vUv).rg;

    float depthB = colB.r;
    float depthF = colF.r;
    float depthR = colR.r;
    int objectIdB = int(round(colB.g * 1024.0));
    int objectIdF = int(round(colF.g * 1024.0));
    int objectIdR = int(round(colR.g * 1024.0));

    int nullify = ((objectIdF > 0) && (depthF < depthB-EP)) ? 1 : 0;

    float depth = depthF;
    int objectId = objectIdF;

    vec3 ndcF = 2.0*vec3(vUv.x, vUv.y, depthF) - 1.0;
    vec3 wpF = worldPosition(depthF);
    vec3 colorF = objectIdF > 0 ? solid_compound(5.0*wpF, objectIdF) : vec3(0.0);

    vec3 color = colorF;

    if (nullify == 0 && objectIdB > 0) {
        // Find a point q on the viewing ray in world space
        // vec3 ndc0 = vec3(vUv.x*2.0-1.0, vUv.y*2.0-1.0, 0.0);
        vec4 qh = invVpMat*vec4(ndcF, 1.0);
        vec3 q = qh.xyz / qh.w;
        // t*cameraPos + (1-t)*q     on plane: 
        // t*dot(cameraPos, plane.xyz) + (1-t)*dot(q, plane.xyz) + plane.w = 0
        // t*dot(cameraPos-q, plane.xyz) = -plane.w - dot(q, plane.xyz)
        float t = -(plane.w+dot(q, plane.xyz)) / dot(cameraPos-q, plane.xyz);
        vec3 wp = t*cameraPos + (1.0-t)*q;       // intersection of viewing ray and clipping plane

        objectId = objectIdB;

        color = solid_compound(5.0*wp, objectIdB);
    }

    if (((depthR < depthF-EP) || (objectIdF == 0)) && (objectIdR > 0)) {
        vec3 wpR = worldPosition(depthR);
        vec3 colorR = solid_compound(5.0*wpR, objectIdR);

        // Ad hoc blending.. with just `color = (1.0-debug3)*color + debug3*colorR;` 
        // the semitransparent object in front fades into the background object but is 
        // clearly visible against black.
        // float lum = dot(colorR, vec3(0.299, 0.587, 0.114));
        // float blend = mix(pow(debug3, 2.0), pow(debug3, 0.25), lum);
        // color = (1.0-blend)*color + blend*colorR;

        color = debug3*color + (1.0-debug3)*colorR;
    }

    gl_FragColor = vec4(color, 1.0);
}