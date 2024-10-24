var O=Object.defineProperty;var R=(c,e,t)=>e in c?O(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var i=(c,e,t)=>R(c,typeof e!="symbol"?e+"":e,t);import{r as v,j}from"./index-DePr3LNO.js";import{l as T,O as B,p as U,q as S,r as P,N as u,s as g,V as m,t as C,f as _,u as k,W as D,m as b,n as E,A as z,B as I,w,x as F,e as A,y}from"./three.module-CerfKBDK.js";import{O as N}from"./OrbitControls-0sMovaCw.js";import{g as L}from"./lil-gui.module.min-Bc0DeA9g.js";const G=`// From three.js: position, uv, normal, time, etc.\r
\r
varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,H=`// uPosition1 is prev positions, uPosition2 is current, uPosition0 is resting position\r
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
    vec3 v02 = p2-p0;\r
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
    vec3 v02 = p2-p0;\r
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
    vec3 F = 0.002*computeForce(p0, p1, p2, state);\r
    vec3 newPos = p2 + 0.8*(p2-p1) + F;     // Verlet integration\r
    gl_FragColor = vec4(newPos, state);\r
    // gl_FragColor = vec4(p0, p.w);\r
}\r
`,f=16,r=128,q=(c,e)=>{const t=20*Math.PI/180,s=62*Math.PI/180,n=5,a=c-t,o=e-s,l=n*a*Math.cos(s),d=n*o;return[l,d]};class J{constructor(e){i(this,"baseScene");i(this,"scene");i(this,"camera");i(this,"shaderMaterial");i(this,"initialPositionsTexture");i(this,"fbos");i(this,"currentFboIndex");this.baseScene=e,this.scene=new T,this.camera=new B(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const t=this.computeInitialPositions();this.initialPositionsTexture=new U(t,r,r,S,P),this.initialPositionsTexture.minFilter=u,this.initialPositionsTexture.magFilter=u,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new g({uniforms:{uPositionObjects:{value:Array.from({length:f},()=>new m(0,0,0))},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:G,fragmentShader:H});const s=new C(2,2),n=new _(s,this.shaderMaterial);this.scene.add(n),this.fbos=[];for(let a=0;a<3;a++){const o=this.createRenderTarget();this.fbos.push(o),this.baseScene.renderer.setRenderTarget(o),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new k(r,r,{minFilter:u,magFilter:u,format:S,type:P})}debugArray(){const e=new Float32Array(r*r*4);return this.baseScene.renderer.readRenderTargetPixels(this.fbos[0],0,0,r,r,e),[...e.filter((t,s)=>s%4==3)].sort(()=>Math.random()-.5).slice(0,20).sort((t,s)=>t-s)}step(e){const[t,s,n]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.shaderMaterial.uniforms.uPosition1.value=this.fbos[n].texture,this.shaderMaterial.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[s]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=s}setObjectPositions(){for(let e=0;e<f;e++)this.shaderMaterial.uniforms.uPositionObjects.value[e]=new m(this.baseScene.appIconPositions[3*e+0],this.baseScene.appIconPositions[3*e+1],this.baseScene.appIconPositions[3*e+2])}computeInitialPositions(){const e=new Float32Array(r*r*4);for(let n=0;n<r;n++)for(let a=0;a<r;a++){let o=n*r+a,l=Math.random()*Math.PI*2,d=.3+.7*Math.random();e[o*4+0]=1e3+d*Math.cos(l),e[o*4+1]=d*Math.sin(l),e[o*4+2]=Math.random()*.1-.05,e[o*4+3]=-.5}console.log(this.baseScene.data.scandinavia.pointsObj);let t=0,s=0;for(const n in this.baseScene.data.scandinavia.pointsObj){const a=this.baseScene.data.scandinavia.pointsObj[n];console.log("country, points",n,a);for(const o of a){const l=q(o[0]*Math.PI/180,o[1]*Math.PI/180);if(e[t*4+0]=l[0],e[t*4+1]=l[1],e[t*4+2]=s*.01,t++,t>=r*r)throw Error("Particle texture size is too small.")}s++}return console.log("index",t,`${(100*t/(r*r)).toFixed(1)}% of particles used`),e}}const V=`uniform sampler2D particleMap;\r
varying vec4 vParticle;\r
\r
void main() {\r
    vParticle = texture2D(particleMap, position.xy);\r
    gl_PointSize = vParticle.w > 0.0 ? 20.0 : 5.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xyz, 1.);\r
}`,W=`uniform sampler2D reactions;\r
varying vec4 vParticle;\r
\r
#define PI 3.14159265359\r
\r
float decodeFloat(float encoded) {\r
    float t = fract(encoded);\r
    return tan(PI*(t-0.5));\r
}\r
\r
vec2 indexImage(vec2 p, int index) {\r
    int ix = index % 8;\r
    int iy = index / 8;\r
    return vec2(float(ix)/8.0+p.x/8.0, float(iy)/3.0+p.y/3.0);\r
}\r
\r
void main() {\r
    int index = int(vParticle.x*10.0+100.0) % 21;\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    vec2 p = indexImage(gl_PointCoord, index);\r
    vec4 colorImg = texture2D(reactions, p);\r
    float s = 1.-smoothstep(0.4, 0.5, dist);\r
    vec4 colorBase = vec4(0.2, 0.2, 0.5, s);\r
\r
    float stateF = decodeFloat(vParticle.w);\r
    float t = mix(0.0, 1.0, stateF);\r
    vec4 color = mix(colorBase, colorImg, t);\r
    gl_FragColor = color;\r
}\r
`,$=`uniform sampler2D particleMap;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vPosition = position;\r
    gl_PointSize = 50.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,X=`uniform sampler2D apps;\r
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
    gl_FragColor = texture2D(apps, p);\r
}\r
`;class Y{constructor(e,t){i(this,"container");i(this,"scene");i(this,"camera");i(this,"renderer");i(this,"cleanUpTasks");i(this,"animationRequestID",null);i(this,"lastTime",null);i(this,"gui");i(this,"isStopped",!1);i(this,"particleScene");i(this,"shaderReaction");i(this,"appIconPositions",new Float32Array(f*3));i(this,"appIconPositionsAttribute");i(this,"shaderApp");i(this,"data");this.container=e,this.data=t,this.cleanUpTasks=[],this.renderer=new D({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new J(this),this.createGUI(),console.log(t.scandinavia),console.log(t.appAtlas),console.log(t.reactionAtlas),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof b&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}createGUI(){this.gui=new L;const n={debugDialogButton:()=>alert(this.particleScene.debugArray()),animateButton:()=>this.animateStep(!1),toggleStop:()=>{this.isStopped=!this.isStopped}};this.gui.add(n,"debugDialogButton").name("Show alphas"),this.gui.add(n,"animateButton").name("Animate step"),this.gui.add(n,"toggleStop").name("Toggle stop/play"),this.gui.close()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose(),this.gui.destroy()}setupScene(){const e=new T,t=new E(16777215,200,0);t.position.set(0,50,0),e.add(new z(14544639,.8)),e.add(t);const s=new I,n=new Float32Array(r*r*3);for(let d=0;d<r;d++)for(let p=0;p<r;p++){let h=d*r+p;n[h*3+0]=d/r,n[h*3+1]=p/r,n[h*3+2]=0}s.setAttribute("position",new w(n,3)),this.shaderReaction=new g({uniforms:{particleMap:{value:null},time:{value:0},reactions:{value:this.data.reactionAtlas}},vertexShader:V,fragmentShader:W,blending:F,depthWrite:!1});const a=new A(s,this.shaderReaction);a.frustumCulled=!1,e.add(a);const o=new I;this.appIconPositionsAttribute=new w(this.appIconPositions,3),o.setAttribute("position",this.appIconPositionsAttribute),this.shaderApp=new g({uniforms:{particleMap:{value:null},time:{value:0},apps:{value:this.data.appAtlas}},vertexShader:$,fragmentShader:X,blending:F,depthWrite:!1});const l=new A(o,this.shaderApp);return l.frustumCulled=!1,e.add(l),this.moveAppIcons(0),e.rotateOnAxis(new m(1,0,0),-Math.PI/2),e}setupCamera(){const e=new b(60,1,.1,1e3),t=new N(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(0,1,1),e.lookAt(new m(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.002);this.lastTime=t,this.particleScene.shaderMaterial.uniforms.time.value=t,e||(this.moveAppIcons(t),this.particleScene.setObjectPositions(),this.particleScene.step(this.renderer)),this.shaderReaction.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.renderer.render(this.scene,this.camera)}moveAppIcons(e){for(let t=0;t<f;t++)this.appIconPositions[3*t+0]=1*Math.cos(t+.1*e),this.appIconPositions[3*t+1]=1*Math.sin(2*t+.2*e),this.appIconPositions[3*t+2]=.2;this.appIconPositionsAttribute.needsUpdate=!0}}const ne=()=>{const c=v.useRef(null),[e,t]=v.useState(),s=async()=>{console.log("preload()");try{const n=await Promise.all([fetch("/dev-site-misc/geo/scandinavia.json"),fetch("/dev-site-misc/socials/app_atlas.png"),fetch("/dev-site-misc/socials/reaction_atlas.png")]);for(const M of n)if(!M.ok)throw new Error("File fetch failed");const a=await n[0].json(),o=await n[1].blob(),l=await createImageBitmap(o),d=new y(l);d.needsUpdate=!0;const p=await n[2].blob(),h=await createImageBitmap(p),x=new y(h);x.needsUpdate=!0,t({scandinavia:a,appAtlas:d,reactionAtlas:x})}catch(n){console.error("Error loading JSON:",n)}};return v.useEffect(()=>{if(!e){s();return}console.log("useEffect: ",c.current);const n=new Y(c.current,e);return()=>{n.cleanUp()}},[e]),j.jsx("div",{ref:c,style:{width:"100%",height:"100%"}})};export{ne as default};
