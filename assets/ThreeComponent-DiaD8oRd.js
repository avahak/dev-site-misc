var O=Object.defineProperty;var R=(l,e,t)=>e in l?O(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var a=(l,e,t)=>R(l,typeof e!="symbol"?e+"":e,t);import{r as v,j as D}from"./index-C60FnzFn.js";import{l as A,O as B,s as S,V as m,t as E,f as j,u as U,N as u,q as g,r as x,p as P,W as C,m as b,n as _,A as z,B as w,w as F,e as T,y}from"./three.module-CerfKBDK.js";import{O as k}from"./OrbitControls-0sMovaCw.js";import{g as N}from"./lil-gui.module.min-Bc0DeA9g.js";const L=`// From three.js: position, uv, normal, time, etc.\r
\r
varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,G=`// uPosition1 is prev positions, uPosition2 is current, uPosition0 is resting position\r
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
    // for debug:\r
    if (stateI < -1 || stateI >= NUM_OBJECTS)\r
        return state;\r
\r
    vec2 rand = random22(vUv);\r
\r
    if (stateI == -1)\r
        stateF = max(0.0, stateF-0.002);\r
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
            // BUG ON MOBILE!!! INSANITY!\r
            // The following logically equivalent code blocks yield different \r
            // results on OnePlus Nord mobile phone (commented code yields incorrect result).\r
            // if ((dist0 < 0.01) && (dist1 < 0.25+0.5*rand.x*rand.y)) \r
            //     newStateI = k;\r
            if (dist0 < 0.01)\r
                if (dist1 < -0.15+0.5*rand.x*rand.y)\r
                    newStateI = k;\r
        }\r
        return encodeIntAndFloat(newStateI, stateF);\r
    }\r
\r
    // Now stateI >= 0:\r
\r
    // Return home if distance home is too long\r
    if (dist0 > 0.4+0.2*rand.y) {\r
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
    float maxSpeedHome = min(0.02, 0.1*length(v02));\r
    float maxSpeedOrbit = 0.1;\r
    float maxForceOrbit = 5.;\r
\r
    vec3 steeringHome = computeSteering(-v02, v, maxSpeedHome, maxForce);\r
    vec3 steeringSpeedHome = computeSteering(v*(0.2-length(v)), v, maxSpeedHome, maxForce);\r
\r
    if (stateI == -1)\r
        return steeringHome + steeringSpeedHome;\r
\r
    vec3 vp = p2-uPositionObjects[stateI];\r
    vec3 steeringOrbit = computeSteering(vp*(0.1-length(vp)), v, maxSpeedOrbit, maxForceOrbit);\r
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
    vec3 F = 0.02*computeForce(p0, p1, p2, state);\r
    vec3 newPos = p2 + 0.8*(p2-p1) + F;     // Verlet integration\r
    gl_FragColor = vec4(newPos, state);\r
    // gl_FragColor = vec4(p0, p.w);\r
}\r
`,f=16,i=128,H=(l,e)=>{const t=20*Math.PI/180,n=62*Math.PI/180,r=5,s=l-t,d=e-n,o=r*s*Math.cos(n),c=r*d;return[o,c]};class q{constructor(e){a(this,"baseScene");a(this,"scene");a(this,"camera");a(this,"shaderMaterial");a(this,"initialPositionsTexture");a(this,"initialExtraDataTexture");a(this,"fbos");a(this,"currentFboIndex");this.baseScene=e,this.scene=new A,this.camera=new B(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0),this.computeInitialTextures(),this.shaderMaterial=new S({uniforms:{uPositionObjects:{value:Array.from({length:f},()=>new m(0,0,0))},extraData:{value:this.initialExtraDataTexture},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:L,fragmentShader:G});const t=new E(2,2),n=new j(t,this.shaderMaterial);this.scene.add(n),this.fbos=[];for(let r=0;r<3;r++){const s=this.createRenderTarget();this.fbos.push(s),this.baseScene.renderer.setRenderTarget(s),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new U(i,i,{minFilter:u,magFilter:u,format:g,type:x})}debugArray(){const e=new Float32Array(i*i*4);return this.baseScene.renderer.readRenderTargetPixels(this.fbos[0],0,0,i,i,e),[...e.filter((t,n)=>n%4==3)].sort(()=>Math.random()-.5).slice(0,20).sort((t,n)=>t-n)}step(e){const[t,n,r]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.shaderMaterial.uniforms.uPosition1.value=this.fbos[r].texture,this.shaderMaterial.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[n]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=n}setObjectPositions(){for(let e=0;e<f;e++)this.shaderMaterial.uniforms.uPositionObjects.value[e]=new m(this.baseScene.appIconPositions[3*e+0],this.baseScene.appIconPositions[3*e+1],this.baseScene.appIconPositions[3*e+2])}computeInitialTextures(){const e=new Float32Array(i*i*4),t=new Float32Array(i*i*4);for(let s=0;s<i;s++)for(let d=0;d<i;d++){let o=s*i+d,c=Math.random()*Math.PI*2,p=.3+.7*Math.random();e[o*4+0]=1e3+p*Math.cos(c),e[o*4+1]=p*Math.sin(c),e[o*4+2]=0,e[o*4+3]=-.5,t[o*4+0]=0,t[o*4+1]=0,t[o*4+2]=0,t[o*4+3]=0}console.log(this.baseScene.data.scandinavia.pointsObj);let n=0,r=0;for(const s in this.baseScene.data.scandinavia.pointsObj){const d=this.baseScene.data.scandinavia.pointsObj[s];console.log("country, points",s,d);for(const o of d){const c=H(o[0]*Math.PI/180,o[1]*Math.PI/180),p=Math.floor(Math.random()*22);if(e[n*4+0]=c[0],e[n*4+1]=c[1],e[n*4+2]=0,t[n*4+0]=r,t[n*4+1]=p,t[n*4+2]=0,t[n*4+3]=0,n++,n>=i*i)throw Error("Particle texture size is too small.")}r++}console.log("index",n,`${(100*n/(i*i)).toFixed(1)}% of particles used`),this.initialPositionsTexture=new P(e,i,i,g,x),this.initialPositionsTexture.minFilter=u,this.initialPositionsTexture.magFilter=u,this.initialPositionsTexture.needsUpdate=!0,this.initialExtraDataTexture=new P(t,i,i,g,x),this.initialExtraDataTexture.minFilter=u,this.initialExtraDataTexture.magFilter=u,this.initialExtraDataTexture.needsUpdate=!0}}const J=`uniform sampler2D particleMap;\r
flat out vec4 vParticle;\r
flat out vec3 vPosition;\r
\r
void main() {\r
    vPosition = position;\r
    vParticle = texture2D(particleMap, position.xy);\r
    // gl_PointSize = vParticle.w > 0.0 ? 30.0 : 6.0;\r
    gl_PointSize = 30.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xyz, 1.);\r
}`,V=`uniform sampler2D reactions;\r
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
    vec4 colorBase = vec4(0.2, 0.2, 0.5, 1.0);\r
    if (countryIndex == 1)\r
        colorBase = vec4(0.5, 0.2, 0.2, 1.0);\r
    if (countryIndex == 2)\r
        colorBase = vec4(0.2, 0.5, 0.2, 1.0);\r
    if (countryIndex == 3)\r
        colorBase = vec4(0.5, 0.5, 0.2, 1.0);\r
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
`,W=`uniform sampler2D particleMap;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vPosition = position;\r
    gl_PointSize = 50.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,$=`uniform sampler2D apps;\r
varying vec3 vPosition;\r
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
    int index = int(vPosition.y*10.0+100.0) % 12;\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    vec2 p = indexImage(gl_PointCoord, index);\r
    vec4 color = texture2D(apps, p);\r
    if (color.a < 0.5)\r
        discard;\r
    gl_FragColor = color;\r
}\r
`;class X{constructor(e,t){a(this,"container");a(this,"scene");a(this,"camera");a(this,"renderer");a(this,"cleanUpTasks");a(this,"animationRequestID",null);a(this,"lastTime",null);a(this,"gui");a(this,"isStopped",!1);a(this,"particleScene");a(this,"shaderReaction");a(this,"appIconPositions",new Float32Array(f*3));a(this,"appIconPositionsAttribute");a(this,"shaderApp");a(this,"data");this.container=e,this.data=t,this.cleanUpTasks=[],this.renderer=new C({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new q(this),this.createGUI(),console.log(t.scandinavia),console.log(t.appAtlas),console.log(t.reactionAtlas),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof b&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}createGUI(){this.gui=new N;const r={debugDialogButton:()=>alert(this.particleScene.debugArray()),animateButton:()=>this.animateStep(!1),toggleStop:()=>{this.isStopped=!this.isStopped}};this.gui.add(r,"debugDialogButton").name("Show alphas"),this.gui.add(r,"animateButton").name("Animate step"),this.gui.add(r,"toggleStop").name("Toggle stop/play"),this.gui.close()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose(),this.gui.destroy()}setupScene(){const e=new A,t=new _(16777215,200,0);t.position.set(0,50,0),e.add(new z(14544639,.8)),e.add(t);const n=new w,r=new Float32Array(i*i*3);for(let c=0;c<i;c++)for(let p=0;p<i;p++){let h=c*i+p;r[h*3+0]=c/i,r[h*3+1]=p/i,r[h*3+2]=0}n.setAttribute("position",new F(r,3)),this.shaderReaction=new S({uniforms:{particleMap:{value:null},extraData:{value:null},time:{value:0},reactions:{value:this.data.reactionAtlas}},vertexShader:J,fragmentShader:V});const s=new T(n,this.shaderReaction);s.frustumCulled=!1,e.add(s);const d=new w;this.appIconPositionsAttribute=new F(this.appIconPositions,3),d.setAttribute("position",this.appIconPositionsAttribute),this.shaderApp=new S({uniforms:{particleMap:{value:null},time:{value:0},apps:{value:this.data.appAtlas}},vertexShader:W,fragmentShader:$});const o=new T(d,this.shaderApp);return o.frustumCulled=!1,e.add(o),this.moveAppIcons(0),e.rotateOnAxis(new m(1,0,0),-Math.PI/2),e}setupCamera(){const e=new b(60,1,.1,1e3),t=new k(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(0,1,1),e.lookAt(new m(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.002);this.lastTime=t,this.particleScene.shaderMaterial.uniforms.time.value=t,e||(this.moveAppIcons(t),this.particleScene.setObjectPositions(),this.particleScene.step(this.renderer)),this.shaderReaction.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.shaderReaction.uniforms.extraData.value=this.particleScene.initialExtraDataTexture,this.renderer.render(this.scene,this.camera)}moveAppIcons(e){for(let t=0;t<f;t++)this.appIconPositions[3*t+0]=1*Math.cos(t+.1*e),this.appIconPositions[3*t+1]=1*Math.sin(2*t+.2*e),this.appIconPositions[3*t+2]=.2;this.appIconPositionsAttribute.needsUpdate=!0}}const te=()=>{const l=v.useRef(null),[e,t]=v.useState(),n=async()=>{console.log("preload()");try{const r=await Promise.all([fetch("/dev-site-misc/geo/scandinavia.json"),fetch("/dev-site-misc/socials/app_atlas.png"),fetch("/dev-site-misc/socials/reaction_atlas.png")]);for(const M of r)if(!M.ok)throw new Error("File fetch failed");const s=await r[0].json(),d=await r[1].blob(),o=await createImageBitmap(d),c=new y(o);c.needsUpdate=!0;const p=await r[2].blob(),h=await createImageBitmap(p),I=new y(h);I.needsUpdate=!0,t({scandinavia:s,appAtlas:c,reactionAtlas:I})}catch(r){console.error("Error loading JSON:",r)}};return v.useEffect(()=>{if(!e){n();return}console.log("useEffect: ",l.current);const r=new X(l.current,e);return()=>{r.cleanUp()}},[e]),D.jsx("div",{ref:l,style:{width:"100%",height:"100%"}})};export{te as default};
