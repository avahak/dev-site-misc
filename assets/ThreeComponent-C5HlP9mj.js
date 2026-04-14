import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{B as r,G as i,H as a,I as o,K as s,R as c,V as l,W as u,Y as d,c as f,ht as p,i as m,it as h,p as g,pt as _,r as v,rt as y,s as b,v as x,x as S}from"./three.module-C86DByBz.js";import{o as C,s as w}from"./index-MAoTwwYu.js";var T=e(t(),1),E=`// From three.js: position, uv, normal, time, etc.\r
\r
varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,D=`// uPosition1 is prev positions, uPosition2 is current, uPosition0 is resting position\r
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
`,O=1024,k=class{constructor(e){this.baseScene=e,this.scene=new y,this.camera=new l(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);let t=new Float32Array(O*O*4);for(let e=0;e<O;e++)for(let n=0;n<O;n++){let r=e*O+n,i=Math.random()*Math.PI*2,a=.3+.7*Math.random();t[r*4+0]=a*Math.cos(i),t[r*4+1]=a*Math.sin(i),t[r*4+2]=Math.random()*.1-.05,t[r*4+3]=-.5}this.initialPositionsTexture=new g(t,O,O,d,x),this.initialPositionsTexture.minFilter=r,this.initialPositionsTexture.magFilter=r,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new h({uniforms:{uPositionObjects:{value:this.baseScene.objects.map(e=>e.position)},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:E,fragmentShader:D});let n=new o(new u(2,2),this.shaderMaterial);this.scene.add(n),this.fbos=[];for(let e=0;e<3;e++){let e=this.createRenderTarget();this.fbos.push(e),this.baseScene.renderer.setRenderTarget(e),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new p(O,O,{minFilter:r,magFilter:r,format:d,type:x})}debugArray(){let e=new Float32Array(O*O*4);return this.baseScene.renderer.readRenderTargetPixels(this.fbos[0],0,0,O,O,e),[...e.filter((e,t)=>t%4==3)].sort(()=>Math.random()-.5).slice(0,20).sort((e,t)=>e-t)}step(e){let[t,n,r]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.shaderMaterial.uniforms.uPosition1.value=this.fbos[r].texture,this.shaderMaterial.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[n]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=n}setObjectPositions(){for(let e=0;e<5;e++)this.shaderMaterial.uniforms.uPositionObjects.value[e]=this.baseScene.objects[e].position}},A=`uniform sampler2D particleMap;\r
varying vec4 vParticle;\r
\r
void main() {\r
    vParticle = texture2D(particleMap, position.xy);\r
    gl_PointSize = vParticle.w > 1.0 ? 1.0 : 1.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xyz, 1.);\r
}`,j=`varying vec4 vParticle;\r
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
`,M=class{constructor(e){this.animationRequestID=null,this.lastTime=null,this.isStopped=!1,this.objects=[],this.objectRotationVectors=[],this.shaderMaterial=null,this.container=e,this.cleanUpTasks=[],this.renderer=new v({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new k(this),this.createGUI(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof a&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}createGUI(){this.gui=new w;let e={debugDialogButton:()=>alert(this.particleScene.debugArray()),animateButton:()=>this.animateStep(!1),toggleStop:()=>{this.isStopped=!this.isStopped}};this.gui.add(e,`debugDialogButton`).name(`Show alphas`),this.gui.add(e,`animateButton`).name(`Animate step`),this.gui.add(e,`toggleStop`).name(`Toggle stop/play`),this.gui.close()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.renderer.dispose(),this.gui.destroy()}setupScene(){let e=new y,t=new S(.1,1),n=new c({flatShading:!0});for(let r=0;r<5;r++){let r=new o(t,n);this.objects.push(r),this.objectRotationVectors.push(new _().randomDirection()),e.add(r)}let r=new i(16777215,200,0);r.position.set(0,50,0),e.add(new m(14544639,.8)),e.add(r);let a=new f,l=new Float32Array(O*O*3);for(let e=0;e<O;e++)for(let t=0;t<O;t++){let n=e*O+t;l[n*3+0]=e/O,l[n*3+1]=t/O,l[n*3+2]=0}a.setAttribute(`position`,new b(l,3)),this.shaderMaterial=new h({uniforms:{particleMap:{value:null},time:{value:0}},vertexShader:A,fragmentShader:j});let u=new s(a,this.shaderMaterial);return u.frustumCulled=!1,e.add(u),this.moveObjects(0),e.rotateOnAxis(new _(1,0,0),-Math.PI/2),e}setupCamera(){let e=new a(60,1,.1,1e3),t=new C(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(0,1,1),e.lookAt(new _(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){let t=(this.lastTime??0)+(e?0:.01);this.lastTime=t,this.particleScene.shaderMaterial.uniforms.time.value=t,e||(this.moveObjects(t),this.particleScene.setObjectPositions(),this.particleScene.step(this.renderer)),this.shaderMaterial.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.renderer.render(this.scene,this.camera)}moveObjects(e){this.objects.forEach((t,n)=>{t.rotateOnAxis(this.objectRotationVectors[n],.2),t.position.set(1*Math.cos(n+.1*e),1*Math.sin(2*n+.2*e),.2)})}},N=n(),P=()=>{let e=(0,T.useRef)(null);return(0,T.useEffect)(()=>{console.log(`useEffect: `,e.current);let t=new M(e.current);return()=>{t.cleanUp()}},[]),(0,N.jsx)(`div`,{ref:e,style:{width:`100%`,height:`100%`}})};export{P as default};