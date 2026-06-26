// Functions for peeling a cylinder into a long sheet. 


float sheetThickness(float x, float g, float d) {
    // Thickness profile of the sheet. The sheet thickness is tapered for small x 
    // so that the spiral maps the sheet perfectly to the cylinder core without spill or gaps.

    float wedgeLength = PI * (d + 2.0*g) / 2.0;
    if (x < wedgeLength)
        return d * sqrt(x / wedgeLength);
    return d;
}


float spiralAngle(float x, float g, float d) {
    // Winding angle for the Archimedean spiral.
    // Derived from the arc-length formula of an Archimedean spiral.

    float wedgeLength = PI * (d + 2.0*g) / 2.0;

    if (x < wedgeLength)
        return TAU * sqrt(x / wedgeLength);

    float a = PI*d / (d + g);
    float b = TAU * (2.0*x - PI*d) / (d + g);
    return a + sqrt(a*a + b);
}


float spiralAngleInverse(float angle, float g, float d) {
    // Inverse to spiralAngle

    if (angle < TAU)
        return (d + 2.0*g) / (4.0 * TAU) * angle*angle;
    return (((d + g) / TAU)*angle*angle - d*angle + PI*d) / 2.0;
}


float spiralRadius(float x, float z, float g, float d) {
    // Distance from the cylinder center for the Archimedean spiral.

    return spiralAngle(x, g, d) * (d + g) / TAU - z;
}


vec3 spiralGeometry(vec3 p, float g, float d) {
    // Geometry for just a spiral inside the trunk

    p.x = max(0.0, p.x);
    float theta = spiralAngle(p.x, g, d);
    float r = spiralRadius(p.x, p.z, g, d);
    float Z = r*cos(theta);
    float X = r*sin(theta);
    return vec3(X, -Z, p.y);
}


vec3 peelGeometry(vec3 p, float peelFront, float g, float d) {
    // Maps sheet coordinates into a partially peeled cylinder.
    // Material with x < peelFront remains wrapped in a spiral.
    // Material with x > peelFront is already peeled flat.
    // The wrapped region is represented by a Archimedean spiral with a wedge-shaped core. 
    // The peeled region is represented by the original flat sheet translated so that the 
    // peel front lies at x=0.

    // Arguments: p: position, peelFront: x for transition, g: gap, d: max thickness.

    // NOTE: there can be slight interpenetration between the spiral part (x < peelFront) and 
    //       the flat part (x > peelFront) but for thin sheets this is practically a non-issue.
    //       Fixing this would be nontrivial.

    // Clamp z so that (x,y,z) is in thickness adjusted box
    p.x = max(0.0, p.x);
    p.z = clamp(p.z, 0.0, sheetThickness(p.x, g, d));

    if (p.x >= peelFront)
        return vec3(p.x-peelFront, -p.z, p.y);       // flat part

    // Now x < peelFront: spiral
    // TODO check if we should do clamping for peelFront as well?
    float theta = spiralAngle(p.x, g, d) - spiralAngle(peelFront, g, d);
    float r = spiralRadius(p.x, p.z, g, d);
    float zOffset = spiralRadius(peelFront, 0.0, g, d);
    float Z = zOffset - r*cos(theta);
    float X = r*sin(theta);      // translated so that X=0 for x=peelFront
    return vec3(X, -Z, p.y);
}