var w=Object.defineProperty;var I=(s,e,t)=>e in s?w(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var n=(s,e,t)=>I(s,typeof e!="symbol"?e+"":e,t);import{l as b,q as T,s as M,t as f,u as v,N as u,v as x,w as O,i as P,x as R,W as y,m as g,y as j,I as U,z as A,c as m,n as k,A as B,B as C,E,h as D,O as z,r as S,p as N}from"./index-xI-VliwZ.js";const _=`// From three.js: position, uv, normal, time, etc.\r
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
`,F=5,r=1024;class H{constructor(e){n(this,"baseScene");n(this,"scene");n(this,"camera");n(this,"shaderMaterial");n(this,"initialPositionsTexture");n(this,"fbos");n(this,"currentFboIndex");this.baseScene=e,this.scene=new b,this.camera=new T(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const t=new Float32Array(r*r*4);for(let a=0;a<r;a++)for(let o=0;o<r;o++){let h=a*r+o,l=Math.random()*Math.PI*2,d=.3+.7*Math.random();t[h*4+0]=d*Math.cos(l),t[h*4+1]=d*Math.sin(l),t[h*4+2]=Math.random()*.1-.05,t[h*4+3]=-.5}this.initialPositionsTexture=new M(t,r,r,f,v),this.initialPositionsTexture.minFilter=u,this.initialPositionsTexture.magFilter=u,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new x({uniforms:{uPositionObjects:{value:this.baseScene.objects.map(a=>a.position)},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:_,fragmentShader:G});const i=new O(2,2),c=new P(i,this.shaderMaterial);this.scene.add(c),this.fbos=[];for(let a=0;a<3;a++){const o=this.createRenderTarget();this.fbos.push(o),this.baseScene.renderer.setRenderTarget(o),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new R(r,r,{minFilter:u,magFilter:u,format:f,type:v})}debugArray(){const e=new Float32Array(r*r*4);return this.baseScene.renderer.readRenderTargetPixels(this.fbos[0],0,0,r,r,e),[...e.filter((t,i)=>i%4==3)].sort(()=>Math.random()-.5).slice(0,20).sort((t,i)=>t-i)}step(e){const[t,i,c]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.shaderMaterial.uniforms.uPosition1.value=this.fbos[c].texture,this.shaderMaterial.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[i]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=i}setObjectPositions(){for(let e=0;e<F;e++)this.shaderMaterial.uniforms.uPositionObjects.value[e]=this.baseScene.objects[e].position}}const q=`uniform sampler2D particleMap;\r
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
`;class L{constructor(e){n(this,"container");n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"cleanUpTasks");n(this,"animationRequestID",null);n(this,"lastTime",null);n(this,"gui");n(this,"isStopped",!1);n(this,"objects",[]);n(this,"objectRotationVectors",[]);n(this,"particleScene");n(this,"shaderMaterial",null);this.container=e,this.cleanUpTasks=[],this.renderer=new y({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new H(this),this.createGUI(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof g&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}createGUI(){this.gui=new j;const c={debugDialogButton:()=>alert(this.particleScene.debugArray()),animateButton:()=>this.animateStep(!1),toggleStop:()=>{this.isStopped=!this.isStopped}};this.gui.add(c,"debugDialogButton").name("Show alphas"),this.gui.add(c,"animateButton").name("Animate step"),this.gui.add(c,"toggleStop").name("Toggle stop/play"),this.gui.close()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose(),this.gui.destroy()}setupScene(){const e=new b,t=new U(.1,1),i=new A({flatShading:!0});for(let l=0;l<F;l++){const d=new P(t,i);this.objects.push(d),this.objectRotationVectors.push(new m().randomDirection()),e.add(d)}const c=new k(16777215,200,0);c.position.set(0,50,0),e.add(new B(14544639,.8)),e.add(c);const a=new C,o=new Float32Array(r*r*3);for(let l=0;l<r;l++)for(let d=0;d<r;d++){let p=l*r+d;o[p*3+0]=l/r,o[p*3+1]=d/r,o[p*3+2]=0}a.setAttribute("position",new E(o,3)),this.shaderMaterial=new x({uniforms:{particleMap:{value:null},time:{value:0}},vertexShader:q,fragmentShader:V});const h=new D(a,this.shaderMaterial);return h.frustumCulled=!1,e.add(h),this.moveObjects(0),e.rotateOnAxis(new m(1,0,0),-Math.PI/2),e}setupCamera(){const e=new g(60,1,.1,1e3),t=new z(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(0,1,1),e.lookAt(new m(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.01);this.lastTime=t,this.particleScene.shaderMaterial.uniforms.time.value=t,e||(this.moveObjects(t),this.particleScene.setObjectPositions(),this.particleScene.step(this.renderer)),this.shaderMaterial.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.renderer.render(this.scene,this.camera)}moveObjects(e){this.objects.forEach((t,i)=>{t.rotateOnAxis(this.objectRotationVectors[i],.2),t.position.set(1*Math.cos(i+.1*e),1*Math.sin(2*i+.2*e),.2)})}}const $=()=>{const s=S.useRef(null);return S.useEffect(()=>{console.log("useEffect: ",s.current);const e=new L(s.current);return()=>{e.cleanUp()}},[]),N.jsx("div",{ref:s,style:{width:"100%",height:"100%"}})};export{$ as default};
