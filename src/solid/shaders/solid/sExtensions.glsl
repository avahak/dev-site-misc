#ifdef USE_DEBUG
    uniform vec4 debug1;
    uniform vec4 debug2;
    uniform int debugMode;
#endif


#ifdef USE_NOISE
    uniform sampler3D noiseTexture;
#endif


#ifdef USE_WOOD
    const int MAX_WOOD_TYPES = 4;
    const int MAX_BRANCHES = 1024;
    
    uniform sampler2D branchIndexTex;
    uniform sampler2D profileTexture;
    uniform int woodTypeIndex;

    layout(std140) uniform branchUBO {
        vec4 zRanges[MAX_WOOD_TYPES];               // (start,end,length,-) for each wood type
        vec4 branchIndices[MAX_WOOD_TYPES];         // (start,end,length,-) for each wood type
        vec4 knotColors[MAX_WOOD_TYPES];
        
        vec4 branchesZASD[MAX_BRANCHES];
        vec4 branchesR[MAX_BRANCHES];
    };
#endif