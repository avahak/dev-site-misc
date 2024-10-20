var F=Object.defineProperty;var I=(o,e,t)=>e in o?F(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var n=(o,e,t)=>I(o,typeof e!="symbol"?e+"":e,t);import{r as m,j as T}from"./index-D4RYMsOd.js";import{l as b,O as M,p as O,q as v,r as g,N as u,s as x,t as j,f as w,u as y,W as R,m as S,I as U,v as A,V as f,n as k,A as B,B as C,w as E,e as D}from"./three.module-CyiO67I9.js";import{O as N}from"./OrbitControls-CZc9sQFR.js";import{g as z}from"./lil-gui.module.min-Bc0DeA9g.js";const _=`// From three.js: position, uv, normal, time, etc.\r
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
#define NUM_OBJECTS 5       // NOTE! This has to be same as in config.ts\r
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
                if (dist1 < 0.25+0.5*rand.x*rand.y)\r
                    newStateI = k;\r
        }\r
        return encodeIntAndFloat(newStateI, stateF);\r
    }\r
\r
    // Now stateI >= 0:\r
\r
    // Return home if distance home is too long\r
    if (dist0 > 1.0+0.5*rand.y) {\r
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
    vec3 steeringOrbit = computeSteering(vp*(0.2-length(vp)), v, maxSpeedOrbit, maxForceOrbit);\r
    vec3 steeringSpeedOrbit = computeSteering(v*(0.1-length(v)), v, maxSpeedOrbit, maxForceOrbit);\r
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
    vec3 F = 0.01*computeForce(p0, p1, p2, state);\r
    vec3 newPos = p2 + 0.9*(p2-p1) + F;     // Verlet integration\r
    gl_FragColor = vec4(newPos, state);\r
}\r
`,P=5,r=1024;class H{constructor(e){n(this,"baseScene");n(this,"scene");n(this,"camera");n(this,"shaderMaterial");n(this,"initialPositionsTexture");n(this,"fbos");n(this,"currentFboIndex");this.baseScene=e,this.scene=new b,this.camera=new M(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const t=new Float32Array(r*r*4);for(let a=0;a<r;a++)for(let c=0;c<r;c++){let h=a*r+c,l=Math.random()*Math.PI*2,d=.3+.7*Math.random();t[h*4+0]=d*Math.cos(l),t[h*4+1]=d*Math.sin(l),t[h*4+2]=Math.random()*.1-.05,t[h*4+3]=-.5}this.initialPositionsTexture=new O(t,r,r,v,g),this.initialPositionsTexture.minFilter=u,this.initialPositionsTexture.magFilter=u,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new x({uniforms:{uPositionObjects:{value:this.baseScene.objects.map(a=>a.position)},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:_,fragmentShader:G});const i=new j(2,2),s=new w(i,this.shaderMaterial);this.scene.add(s),this.fbos=[];for(let a=0;a<3;a++){const c=this.createRenderTarget();this.fbos.push(c),this.baseScene.renderer.setRenderTarget(c),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new y(r,r,{minFilter:u,magFilter:u,format:v,type:g})}debugArray(){const e=new Float32Array(r*r*4);return this.baseScene.renderer.readRenderTargetPixels(this.fbos[0],0,0,r,r,e),[...e.filter((t,i)=>i%4==3)].sort(()=>Math.random()-.5).slice(0,20).sort((t,i)=>t-i)}step(e){const[t,i,s]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.shaderMaterial.uniforms.uPosition1.value=this.fbos[s].texture,this.shaderMaterial.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[i]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=i}setObjectPositions(){for(let e=0;e<P;e++)this.shaderMaterial.uniforms.uPositionObjects.value[e]=this.baseScene.objects[e].position}}const J=`uniform sampler2D particleMap;\r
varying vec4 vParticle;\r
\r
void main() {\r
    vParticle = texture2D(particleMap, position.xy);\r
    gl_PointSize = vParticle.w > 1.0 ? 1.0 : 1.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xyz, 1.);\r
}`,V=`varying vec4 vParticle;\r
\r
#define PI 3.14159265359\r
\r
float decodeFloat(float encoded) {\r
    float t = fract(encoded);\r
    return tan(PI*(t-0.5));\r
}\r
\r
void main() {\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    // float t = 1.-smoothstep(0.4, 0.5, dist);\r
    if (dist > 0.5)\r
        discard;\r
\r
    float stateF = decodeFloat(vParticle.w);\r
    float t = mix(0.0, 1.0, stateF);\r
    vec4 color = mix(vec4(0.2, 0.2, 0.5, 1.), vec4(1.0, 0.5, 0.2, 1.), t);\r
    gl_FragColor = color;\r
}\r
`;class q{constructor(e,t){n(this,"container");n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"cleanUpTasks");n(this,"animationRequestID",null);n(this,"lastTime",null);n(this,"gui");n(this,"isStopped",!1);n(this,"objects",[]);n(this,"objectRotationVectors",[]);n(this,"particleScene");n(this,"shaderMaterial",null);n(this,"scandinavia");this.container=e,this.scandinavia=t,this.cleanUpTasks=[],this.renderer=new R({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new H(this),this.createGUI(),console.log(t),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof S&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}createGUI(){this.gui=new z;const s={debugDialogButton:()=>alert(this.particleScene.debugArray()),animateButton:()=>this.animateStep(!1),toggleStop:()=>{this.isStopped=!this.isStopped}};this.gui.add(s,"debugDialogButton").name("Show alphas"),this.gui.add(s,"animateButton").name("Animate step"),this.gui.add(s,"toggleStop").name("Toggle stop/play"),this.gui.close()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose(),this.gui.destroy()}setupScene(){const e=new b,t=new U(.1,1),i=new A({flatShading:!0});for(let l=0;l<P;l++){const d=new w(t,i);this.objects.push(d),this.objectRotationVectors.push(new f().randomDirection()),e.add(d)}const s=new k(16777215,200,0);s.position.set(0,50,0),e.add(new B(14544639,.8)),e.add(s);const a=new C,c=new Float32Array(r*r*3);for(let l=0;l<r;l++)for(let d=0;d<r;d++){let p=l*r+d;c[p*3+0]=l/r,c[p*3+1]=d/r,c[p*3+2]=0}a.setAttribute("position",new E(c,3)),this.shaderMaterial=new x({uniforms:{particleMap:{value:null},time:{value:0}},vertexShader:J,fragmentShader:V});const h=new D(a,this.shaderMaterial);return h.frustumCulled=!1,e.add(h),this.moveObjects(0),e.rotateOnAxis(new f(1,0,0),-Math.PI/2),e}setupCamera(){const e=new S(60,1,.1,1e3),t=new N(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(0,1,1),e.lookAt(new f(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.01);this.lastTime=t,this.particleScene.shaderMaterial.uniforms.time.value=t,e||(this.moveObjects(t),this.particleScene.setObjectPositions(),this.particleScene.step(this.renderer)),this.shaderMaterial.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.renderer.render(this.scene,this.camera)}moveObjects(e){this.objects.forEach((t,i)=>{t.rotateOnAxis(this.objectRotationVectors[i],.2),t.position.set(1*Math.cos(i+.1*e),1*Math.sin(2*i+.2*e),.2)})}}const Z=()=>{const o=m.useRef(null),[e,t]=m.useState(),i=async()=>{console.log("loadData()");try{const s=await fetch("/dev-site-misc/geo/scandinavia.json");if(!s.ok)throw new Error("Failed to fetch JSON file");const a=await s.json();t(a)}catch(s){console.error("Error loading JSON:",s)}};return m.useEffect(()=>{if(!e){i();return}console.log("useEffect: ",o.current);const s=new q(o.current,e);return()=>{s.cleanUp()}},[e]),T.jsx("div",{ref:o,style:{width:"100%",height:"100%"}})};export{Z as default};
