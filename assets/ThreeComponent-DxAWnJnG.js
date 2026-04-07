import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{B as r,G as i,H as a,I as o,K as s,V as c,W as l,Y as u,c as d,ht as f,i as p,it as m,lt as h,p as g,pt as _,r as v,rt as y,s as b,v as x}from"./three.module-C86DByBz.js";import{a as S,i as C}from"./index-BQaJ8Tsn.js";var w=e(t(),1),T=`// From three.js: position, uv, normal, time, etc.\r
\r
varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,E=`// uPosition1 is prev positions, uPosition2 is current, uPosition0 is resting position\r
\r
/*\r
vPosition.w is state, which encodes (stateI,stateF), where stateI is int\r
and stateF is lower precision float. stateI is -1 if particle is attached to home position,\r
and >=0 when the particle is attached to objects[stateI].\r
*/\r
\r
/*\r
Steering forces:\r
1) enforce |steering|=maxSpeed\r
2) steering = steering-velocity\r
3) enforce |steering|<=maxForce\r
\r
acceleration = sum(steering forces)\r
*/\r
\r
#define NUM_OBJECTS 16       // NOTE! This has to be same as in config.ts\r
\r
uniform vec3 uPositionObjects[NUM_OBJECTS];\r
uniform sampler2D uPosition0;   // initial positions for particles\r
uniform sampler2D uPosition1;   // particles previous positions\r
uniform sampler2D uPosition2;   // current particle positions\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
vec2 random22(vec2 p) {\r
    // Source: The Book of Shaders\r
    return fract(sin(vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5, 183.3))))*43758.5453);\r
}\r
\r
float random21(vec2 p) {\r
    // Source: The Book of Shaders\r
    return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453123);\r
}\r
\r
float encodeIntAndFloat(int i, float f) {\r
    float t = 0.5 + atan(f)/PI;\r
    return float(i) + t;\r
}\r
int decodeInt(float encoded) {\r
    return int(floor(encoded));\r
}\r
float decodeFloat(float encoded) {\r
    float t = fract(encoded);\r
    return tan(PI*(t-0.5));\r
}\r
\r
// float encodeIntAndFloat(int i, float f) {\r
//     return float(i) + f;\r
// }\r
// int decodeInt(float encoded) {\r
//     return int(floor(encoded));\r
// }\r
// float decodeFloat(float encoded) {\r
//     return fract(encoded);\r
// }\r
\r
vec3 safeNormalize(vec3 v) {\r
    float d = length(v);\r
    if (d > 0.0)\r
        return v / d;\r
    else \r
        return vec3(0., 0., 1.);\r
}\r
\r
float computeState(vec3 p0, vec3 p1, vec3 p2, float state) {\r
    int stateI = decodeInt(state);\r
    float stateF = decodeFloat(state);\r
\r
    vec2 rand1 = random22(vUv);\r
\r
    // for debug:\r
    if (stateI < -1 || stateI >= NUM_OBJECTS)\r
        return state;\r
\r
    if (stateI == -1)\r
        stateF = max(0.0, stateF-0.005);\r
    if (stateI >= 0)\r
        stateF = min(1.0, stateF+0.005);\r
\r
    int newStateI = stateI;\r
\r
    vec3 v02 = p2-vec3(p0.xy, 0.0);\r
    float dist0 = length(v02); // distance home\r
\r
    if (stateI == -1) {\r
        // Get attached to the object if we are home and object is close\r
        for (int k = 0; k < NUM_OBJECTS; k++) {\r
            vec3 vp = p2-uPositionObjects[k];\r
            float dist1 = length(vp);  // distance to object\r
\r
            vec2 rand2 = random22(vUv + vec2(float(k), 0.0));\r
\r
            // BUG ON MOBILE!!! INSANITY!\r
            // The following logically equivalent code blocks yield different \r
            // results on OnePlus Nord mobile phone (commented code yields incorrect result).\r
            // if ((dist0 < 0.01) && (dist1 < 0.25+0.5*rand.x*rand.y)) \r
            //     newStateI = k;\r
            if (dist0 < 0.01)\r
                if (dist1 < -0.22+0.5*rand2.x*rand2.y)\r
                // if (dist1 < 0.3)\r
                    newStateI = k;\r
        }\r
        return encodeIntAndFloat(newStateI, stateF);\r
    }\r
\r
    // Now stateI >= 0:\r
\r
    // Return home if distance home is too long\r
    if (dist0 > 0.4+0.2*rand1.y) {\r
        newStateI = -1;\r
    }\r
    return encodeIntAndFloat(newStateI, stateF);\r
}\r
\r
vec3 computeSteering(vec3 vSteer, vec3 v, float maxSpeed, float maxForce) {\r
    vec3 steering = maxSpeed*safeNormalize(vSteer);\r
    steering = steering-v;\r
    float len = length(steering);\r
    if (len > 0.0) \r
        steering = steering*min(maxForce/len, 1.0);\r
    return steering;\r
}\r
\r
vec3 computeForce(vec3 p0, vec3 p1, vec3 p2, float state) {\r
    int stateI = decodeInt(state);\r
    float stateF = decodeFloat(state);\r
\r
    vec3 v02 = p2-vec3(p0.xy, 0.0);\r
    vec3 v = p2-p1;\r
\r
    float maxForce = 5.;\r
    float maxSpeedHome = min(0.02, 0.1*sqrt(length(v02)));\r
    if (length(v02) < 0.005)\r
        maxSpeedHome *= 0.1;\r
    float maxSpeedOrbit = 0.1;\r
    float maxForceOrbit = 1.;\r
\r
    vec3 steeringHome = computeSteering(-v02, v, maxSpeedHome, maxForce);\r
    vec3 steeringSpeedHome = computeSteering(v*(0.2-length(v)), v, maxSpeedHome, maxForce);\r
\r
    if (stateI == -1)\r
        return steeringHome + steeringSpeedHome;\r
\r
    vec3 vp = p2-uPositionObjects[stateI];\r
    vec3 steeringOrbit = computeSteering(vp*(0.1-length(vp)), v, maxSpeedOrbit*0.4, maxForceOrbit);\r
    vec3 steeringSpeedOrbit = computeSteering(v*(0.05-length(v)), v, maxSpeedOrbit, maxForceOrbit);\r
\r
    return steeringOrbit + steeringSpeedOrbit;\r
}\r
\r
// float debug(vec3 p0, vec3 p1, vec3 p2, float state) {\r
//     int stateI = decodeInt(state);\r
//     float stateF = decodeFloat(state);\r
//     float newState = computeState(p0, p1, p2, state);\r
//     return newState;\r
// }\r
\r
void main() {\r
    vec4 p = texture2D(uPosition2, vUv);\r
    vec3 p0 = texture2D(uPosition0, vUv).xyz;\r
    vec3 p1 = texture2D(uPosition1, vUv).xyz;\r
    vec3 p2 = p.xyz;\r
\r
    float state = computeState(p0, p1, p2, p.w);\r
    vec3 F = 0.007*computeForce(p0, p1, p2, state);\r
    vec3 newPos = p2 + 0.8*(p2-p1) + F;     // Verlet integration\r
    gl_FragColor = vec4(newPos, state);\r
    // gl_FragColor = vec4(p0, p.w);\r
}\r
`,D=(e,t)=>{let n=20*Math.PI/180,r=62*Math.PI/180,i=e-n,a=t-r;return[5*i*Math.cos(r),5*a]},O=class{constructor(e){this.baseScene=e,this.scene=new y,this.camera=new c(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0),this.computeInitialTextures(),this.shaderMaterial=new m({uniforms:{uPositionObjects:{value:Array.from({length:16},()=>new _(-100,0,0))},extraData:{value:this.initialExtraDataTexture},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:T,fragmentShader:E});let t=new o(new l(2,2),this.shaderMaterial);this.scene.add(t),this.fbos=[];for(let e=0;e<3;e++){let e=this.createRenderTarget();this.fbos.push(e),this.baseScene.renderer.setRenderTarget(e),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new f(128,128,{minFilter:r,magFilter:r,format:u,type:x})}debugArray(){let e=new Float32Array(16384*4);return this.baseScene.renderer.readRenderTargetPixels(this.fbos[0],0,0,128,128,e),[...e.filter((e,t)=>t%4==3)].sort(()=>Math.random()-.5).slice(0,20).sort((e,t)=>e-t)}step(e){let[t,n,r]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.shaderMaterial.uniforms.uPosition1.value=this.fbos[r].texture,this.shaderMaterial.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[n]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=n}setObjectPositions(){for(let e=0;e<16;e++)this.shaderMaterial.uniforms.uPositionObjects.value[e]=new _(this.baseScene.appIconPositions[3*e+0],this.baseScene.appIconPositions[3*e+1],this.baseScene.appIconPositions[3*e+2])}computeInitialTextures(){let e=new Float32Array(16384*4),t=new Float32Array(16384*4);for(let n=0;n<128;n++)for(let r=0;r<128;r++){let i=n*128+r,a=Math.random()*Math.PI*2,o=.3+.7*Math.random();e[i*4+0]=1e3+o*Math.cos(a),e[i*4+1]=o*Math.sin(a),e[i*4+2]=0,e[i*4+3]=-.5,t[i*4+0]=0,t[i*4+1]=0,t[i*4+2]=0,t[i*4+3]=0}console.log(this.baseScene.data.scandinavia.pointsObj);let n=0,i=0;for(let r in this.baseScene.data.scandinavia.pointsObj){let a=this.baseScene.data.scandinavia.pointsObj[r];console.log(`country, points`,r,a);for(let r of a){let a=D(r[0]*Math.PI/180,r[1]*Math.PI/180),o=Math.floor(Math.random()*22);if(e[n*4+0]=a[0],e[n*4+1]=a[1],e[n*4+2]=0,t[n*4+0]=i,t[n*4+1]=o,t[n*4+2]=0,t[n*4+3]=0,n++,n>=16384)throw Error(`Particle texture size is too small.`)}i++}console.log(`index`,n,`${(100*n/16384).toFixed(1)}% of particles used`),this.initialPositionsTexture=new g(e,128,128,u,x),this.initialPositionsTexture.minFilter=r,this.initialPositionsTexture.magFilter=r,this.initialPositionsTexture.needsUpdate=!0,this.initialExtraDataTexture=new g(t,128,128,u,x),this.initialExtraDataTexture.minFilter=r,this.initialExtraDataTexture.magFilter=r,this.initialExtraDataTexture.needsUpdate=!0}},k=`uniform sampler2D particleMap;\r
flat out vec4 vParticle;\r
flat out vec3 vPosition;\r
\r
void main() {\r
    vPosition = position;\r
    vParticle = texture2D(particleMap, position.xy);\r
    // gl_PointSize = vParticle.w > 0.0 ? 30.0 : 6.0;\r
    gl_PointSize = 30.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xyz, 1.);\r
}`,A=`uniform sampler2D reactions;\r
uniform sampler2D extraData;\r
flat in vec4 vParticle;\r
flat in vec3 vPosition;\r
\r
#define PI 3.14159265359\r
\r
float decodeFloat(float encoded) {\r
    float t = fract(encoded);\r
    return tan(PI*(t-0.5));\r
}\r
\r
vec2 indexImage(vec2 p, int index, float size) {\r
    int ix = index % 8;\r
    int iy = index / 8;\r
    return vec2(\r
        (float(ix) + clamp(size*p.x + 0.5, 0.0, 1.0))/8.0, \r
        (float(iy) + clamp(size*p.y + 0.5, 0.0, 1.0))/3.0\r
    );\r
}\r
\r
void main() {\r
    vec4 extra = texture2D(extraData, vPosition.xy);\r
    int countryIndex = int(extra.r);\r
    int reactionIndex = int(extra.g);\r
    // int reactionIndex = int(vParticle.x*10.0+100.0) % 21;\r
\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
\r
    float stateF = decodeFloat(vParticle.w);\r
    float t = mix(0.0, 1.0, stateF);\r
\r
    float r1 = smoothstep(0.0, 1.0, t);\r
    float r2 = smoothstep(0.0, 0.7, 1.0-t);\r
    float size = 1.0/(0.1+0.9*r1);\r
\r
    vec2 p = indexImage(offset, reactionIndex, size);\r
    vec4 colorImg = texture2D(reactions, p);\r
\r
    vec4 colorBase = vec4(0.5, 0.5, 0.2, 1.0);  // SWE\r
    if (countryIndex == 1)  // NOR\r
        colorBase = vec4(0.5, 0.2, 0.2, 1.0);\r
    if (countryIndex == 2)  // FIN\r
        colorBase = vec4(0.2, 0.5, 0.2, 1.0);\r
    if (countryIndex == 3)  // DK\r
        colorBase = vec4(0.5, 0.2, 0.5, 1.0);\r
\r
    if (dist < 0.07*r2) {\r
        gl_FragColor = mix(colorBase, colorImg, t);\r
        return;\r
    }\r
\r
    if ((dist < 0.5/size) && (colorImg.a > 0.5)) {\r
        gl_FragColor = mix(colorBase, colorImg, t);\r
        return;\r
    }\r
\r
    discard;\r
\r
    // vec4 color = mix(colorBase, colorImg, t);\r
    // if ((dist < 0.1*r2) || ((dist*size < 1.0) && (colorImg.a > 0.5))) {\r
    //     gl_FragColor = color;\r
    //     return;\r
    // } else \r
    //     discard;\r
}\r
`,j=`uniform sampler2D particleMap;\r
varying vec3 vPosition;\r
flat out int vertexID;\r
\r
void main() {\r
    vPosition = position;\r
    vertexID = gl_VertexID;\r
    gl_PointSize = 50.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,M=`uniform sampler2D apps;\r
varying vec3 vPosition;\r
flat in int vertexID;\r
\r
#define PI 3.14159265359\r
\r
float decodeFloat(float encoded) {\r
    float t = fract(encoded);\r
    return tan(PI*(t-0.5));\r
}\r
\r
vec2 indexImage(vec2 p, int index) {\r
    int ix = index % 4;\r
    int iy = index / 4;\r
    return vec2(float(ix)/4.0+p.x/4.0, float(iy)/3.0+p.y/3.0);\r
}\r
\r
void main() {\r
    // int index = int(vPosition.y*10.0+100.0) % 12;\r
    int index = vertexID % 12;\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    vec2 p = indexImage(gl_PointCoord, index);\r
    vec4 color = texture2D(apps, p);\r
    if (color.a < 0.5)\r
        discard;\r
    gl_FragColor = color;\r
}\r
`,N=class{constructor(e,t){this.animationRequestID=null,this.lastTime=null,this.isStopped=!1,this.appIconPositions=new Float32Array(48),this.container=e,this.data=t,this.cleanUpTasks=[],this.renderer=new v({antialias:!0,alpha:!0}),this.renderer.setClearColor(1519680,1),e.appendChild(this.renderer.domElement),this.scene=this.setupScene(),this.camera=this.setupCamera();for(let e=0;e<16;e++)this.initAppIcon(e,0);this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new O(this),this.createGUI(),console.log(t.scandinavia),console.log(t.appAtlas),console.log(t.reactionAtlas),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof a&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix());let n=Math.min(this.container.clientWidth/1200,1);this.camera.position.set(.3-1.3*n,1.7,0),this.camera.lookAt(new _(.3-1.3*n,0,0))}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}createGUI(){this.gui=new S;let e={debugDialogButton:()=>alert(this.particleScene.debugArray()),animateButton:()=>this.animateStep(!1),toggleStop:()=>{this.isStopped=!this.isStopped}};this.gui.add(e,`debugDialogButton`).name(`Show alphas`),this.gui.add(e,`animateButton`).name(`Animate step`),this.gui.add(e,`toggleStop`).name(`Toggle stop/play`),this.gui.close()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.renderer.dispose(),this.gui.destroy()}setupScene(){let e=new y,t=new i(16777215,200,0);t.position.set(0,50,0),e.add(new p(14544639,.8)),e.add(t);let n=new d,r=new Float32Array(16384*3);for(let e=0;e<128;e++)for(let t=0;t<128;t++){let n=e*128+t;r[n*3+0]=e/128,r[n*3+1]=t/128,r[n*3+2]=0}n.setAttribute(`position`,new b(r,3)),this.shaderReaction=new m({uniforms:{particleMap:{value:null},extraData:{value:null},time:{value:0},reactions:{value:this.data.reactionAtlas}},vertexShader:k,fragmentShader:A});let a=new s(n,this.shaderReaction);a.frustumCulled=!1,e.add(a);let o=new d;this.appIconPositionsAttribute=new b(this.appIconPositions,3),o.setAttribute(`position`,this.appIconPositionsAttribute),this.shaderApp=new m({uniforms:{particleMap:{value:null},time:{value:0},apps:{value:this.data.appAtlas}},vertexShader:j,fragmentShader:M});let c=new s(o,this.shaderApp);return c.frustumCulled=!1,e.add(c),this.moveAppIcons(0),e.rotateOnAxis(new _(1,0,0),-Math.PI/2),e}setupCamera(){let e=new a(60,1,.1,1e3),t=new C(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){let t=(this.lastTime??0)+(e?0:.002);this.lastTime=t,this.particleScene.shaderMaterial.uniforms.time.value=t,e||(this.moveAppIcons(t),this.particleScene.setObjectPositions(),this.particleScene.step(this.renderer)),this.shaderReaction.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.shaderReaction.uniforms.extraData.value=this.particleScene.initialExtraDataTexture,this.renderer.render(this.scene,this.camera)}initAppIcon(e,t){let n=Math.min(this.container.clientWidth/1200,1);t>.4*e?(this.appIconPositions[3*e+0]=.24-2.2*n,this.appIconPositions[3*e+1]=-.5+.2*(Math.random()-.5),this.appIconPositions[3*e+2]=.2-.001*e):(this.appIconPositions[3*e+0]=-100,this.appIconPositions[3*e+1]=-100,this.appIconPositions[3*e+2]=.2-.001*e),this.appIconPositionsAttribute.needsUpdate=!0}moveAppIcons(e){let t=Math.min(this.container.clientWidth/1200,1);for(let n=0;n<16;n++){let r=t*1*.001*(2+Math.sin(7*e+n)+Math.sin(3*e+n)),i=t*2*(3.66-3*t)*5e-4*(1+.5*(Math.sin(n)+Math.sin(11*e+n)+Math.sin(4*e+n)));this.appIconPositions[3*n+0]=this.appIconPositions[3*n+0]+r,this.appIconPositions[3*n+1]=this.appIconPositions[3*n+1]+i,this.appIconPositions[3*n+2]=.2-.001*n,(Math.abs(this.appIconPositions[3*n+0])>2||Math.abs(this.appIconPositions[3*n+1])>1.5)&&this.initAppIcon(n,e)}this.appIconPositionsAttribute.needsUpdate=!0}},P=n(),F=()=>{let e=(0,w.useRef)(null),[t,n]=(0,w.useState)(),r=async()=>{console.log(`preload()`);try{let e=await Promise.all([fetch(`/dev-site-misc/geo/scandinavia.json`),fetch(`/dev-site-misc/socials/app_atlas.png`),fetch(`/dev-site-misc/socials/reaction_atlas.png`)]);for(let t of e)if(!t.ok)throw Error(`File fetch failed`);let t=await e[0].json(),r=await e[1].blob(),i=new h(await createImageBitmap(r));i.needsUpdate=!0;let a=await e[2].blob(),o=new h(await createImageBitmap(a));o.needsUpdate=!0,n({scandinavia:t,appAtlas:i,reactionAtlas:o})}catch(e){console.error(`Error loading JSON:`,e)}};return(0,w.useEffect)(()=>{if(console.log(`useEffect: `,e),!e.current)return;if(!t){r();return}let n=new N(e.current,t);return()=>{n.cleanUp()}},[t,e]),(0,P.jsx)(`div`,{style:{position:`fixed`,left:0,top:0,width:`100%`,height:`100%`,zIndex:`-1`,opacity:1},ref:e})};export{F as default};