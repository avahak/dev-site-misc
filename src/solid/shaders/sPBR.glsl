vec3 linearToSRGB(vec3 x) {
    bvec3 cutoff = lessThanEqual(x, vec3(0.0031308));
    vec3 lower = x * 12.92;
    vec3 higher = 1.055 * pow(x, vec3(1.0 / 2.4)) - 0.055;
    return mix(higher, lower, cutoff);
}

vec3 sRGBToLinear(vec3 x) {
    bvec3 cutoff = lessThanEqual(x, vec3(0.04045));
    vec3 lower = x / 12.92;
    vec3 higher = pow((x + 0.055) / 1.055, vec3(2.4));
    return mix(higher, lower, cutoff);
}


// ACES Filmic Tone Mapping (HDR -> LDR)
vec3 ACESFilm(vec3 x) {
    vec3 v = (x*(2.51*x + 0.03)) / (x*(2.43*x + 0.59) + 0.14);
    return clamp(v, 0.0, 1.0);
}


// Schlick Fresnel approximation. Approximates angle-dependent reflectance.
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

// GGX / Trowbridge-Reitz Normal Distribution Function. Controls microfacet orientation distribution.
float distributionGGX(float NdotH, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float denom = (NdotH * NdotH) * (a2 - 1.0) + 1.0;
    return a2 / (PI * denom * denom);
}

// Schlick-GGX Geometry term. Approximates masking and shadowing of microfacets.
float geometrySchlickGGX(float NdotV, float roughness) {
    float r = roughness + 1.0;
    float k = (r * r) / 8.0;
    return NdotV / (NdotV * (1.0 - k) + k);
}

// Smith geometry term. Combines masking/shadowing for view and light directions.
float geometrySmith(float NdotV, float NdotL, float roughness) {
    float ggxV = geometrySchlickGGX(NdotV, roughness);
    float ggxL = geometrySchlickGGX(NdotL, roughness);
    return ggxV * ggxL;
}

vec3 evalDirectLightWeighting(
    vec3 P, vec3 N, vec3 camPos, 
    vec3 baseColor, float roughness, float metallic, 
    vec3 lightPos
) {
    // P is world position
    // N is world normal (normalized)
    // V is view direction (towards camera)

    vec3 lightDir = normalize(lightPos - P);   // direction from point to light
    vec3 V = normalize(camPos - P);

    vec3 L = normalize(lightDir);
    vec3 H = normalize(V + L);

    float NdotL = max(dot(N, L), 0.0);
    float NdotV = max(dot(N, V), 0.0);
    float NdotH = max(dot(N, H), 0.0);
    float VdotH = max(dot(V, H), 0.0);

    if (NdotL <= 0.0 || NdotV <= 0.0)
        return vec3(0.0);
        
    vec3 F0 = mix(vec3(0.04), baseColor, metallic);

    // Fresnel
    vec3 F = fresnelSchlick(VdotH, F0);
    // GGX microfacet terms
    float D = distributionGGX(NdotH, roughness);
    float G = geometrySmith(NdotV, NdotL, roughness);

    // Cook-Torrance microfacet BRDF
    vec3 specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);

    vec3 kS = F;
    vec3 kD = (1.0 - kS) * (1.0 - metallic);
    vec3 diffuse = kD * baseColor / PI;     // Lambert diffuse BRDF
    vec3 brdf = diffuse + specular;
    return brdf * NdotL;
    // Final color = evalDirectLightWeighting(...) * radiance, where
    // radiance = lightColor * lightIntensity * shadow
}