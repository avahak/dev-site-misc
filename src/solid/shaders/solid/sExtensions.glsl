#ifdef USE_DEBUG
    uniform vec4 debug1;
    uniform vec4 debug2;
    uniform int debugMode;
#endif


#ifdef USE_NOISE
    uniform sampler3D noiseTexture;
#endif


#ifdef USE_WOOD
    const int MAX_BRANCHES = 1024;
    
    uniform sampler2D branchIndexTex;
    uniform sampler2D profileTexture;

    uniform branchUBO {
        uniform float zRange;
        uniform int numBranches;
        vec4 branchesZASD[MAX_BRANCHES];
        vec4 branchesR[MAX_BRANCHES];
        uniform vec4 knotColor;
    };
#endif