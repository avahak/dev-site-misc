var w=Object.defineProperty;var T=(i,e,t)=>e in i?w(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var n=(i,e,t)=>T(i,typeof e!="symbol"?e+"":e,t);import{r as p,j as R}from"./index-BM61xNQd.js";import{l as P,p as j,q as O,r as g,s as b,N as h,t as F,V as m,u as y,f as I,v as A,W as U,m as x,I as M,w as k,n as C,A as _,B as z,x as S,e as E,O as D}from"./OrbitControls-DV_4SOBH.js";const B=`// From three.js: position, uv, normal, time, etc.\r
\r
varying vec2 vUv;\r
varying vec3 vPosition;\r
\r
void main() {\r
    vPosition = position;\r
    vUv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\r
}`,N=`// uPosition1 is prev positions, uPosition2 is current\r
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
uniform sampler2D uPosition0;\r
uniform sampler2D uPosition1;\r
uniform sampler2D uPosition2;\r
varying vec2 vUv;\r
varying vec3 vPosition; // same as uPosition2, clean up at some point\r
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
    float f_bounded = (0.5 + atan(f)/PI);  \r
    return float(i) + f_bounded;\r
}\r
\r
void decodeIntAndFloat(float encoded, out int i, out float f) {\r
    i = int(floor(encoded));\r
    float f_bounded = fract(encoded);\r
    f = tan(PI*(f_bounded - 0.5));  \r
}\r
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
    int stateI;\r
    float stateF;\r
    decodeIntAndFloat(state, stateI, stateF);\r
\r
    vec2 rand = random22(vUv + vec2(stateI, stateF));\r
\r
    if (stateI == -1)\r
        stateF = max(0.0, stateF-0.002);\r
    if (stateI >= 0)\r
        stateF = min(1.0, stateF+0.005);\r
\r
    int newStateI = stateI;\r
\r
    vec3 v02 = p2-p0;\r
    float d0 = length(v02); // distance home\r
\r
    if (stateI == -1) {\r
        for (int k = 0; k < NUM_OBJECTS; k++) {\r
            vec3 vp = p2-uPositionObjects[k];\r
            float d1 = length(vp);  // distance to object\r
\r
            // Get attached to the object if we are home and object is close\r
            if ((d0 < 0.01) && (d1 < 0.25+0.5*rand.x*rand.x)) {\r
                newStateI = k;\r
            }\r
        }\r
        return encodeIntAndFloat(newStateI, stateF);\r
    }\r
\r
    // Now stateI >= 0:\r
\r
    vec3 vp = p2-uPositionObjects[stateI];\r
    float d1 = length(vp);  // distance to object\r
\r
    // Return home if distance home is too long\r
    if (d0 > 1.0+0.5*rand.y) {\r
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
    int stateI;\r
    float stateF;\r
    decodeIntAndFloat(state, stateI, stateF);\r
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
void main() {\r
    vec4 p = texture2D(uPosition2, vUv);\r
    vec3 p0 = texture2D(uPosition0, vUv).xyz;\r
    vec3 p1 = texture2D(uPosition1, vUv).xyz;\r
    vec3 p2 = p.xyz;\r
\r
    float state = computeState(p0, p1, p2, p.w);\r
    vec3 F = 0.01*computeForce(p0, p1, p2, state);\r
\r
    // Verlet integration\r
    vec3 newPos = p2 + 0.9*(p2-p1) + F;\r
\r
    gl_FragColor = vec4(newPos, state);\r
}\r
`,u=5,r=1024;class H{constructor(e){n(this,"baseScene");n(this,"scene");n(this,"camera");n(this,"material");n(this,"initialPositionsTexture");n(this,"fbos");n(this,"currentFboIndex");this.baseScene=e,this.scene=new P,this.camera=new j(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);const t=new Float32Array(r*r*4);for(let o=0;o<r;o++)for(let a=0;a<r;a++){let d=o*r+a,c=Math.random()*Math.PI*2,l=.3+.7*Math.random();t[d*4+0]=l*Math.cos(c),t[d*4+1]=l*Math.sin(c),t[d*4+2]=Math.random()*.1-.05,t[d*4+3]=-.5}this.initialPositionsTexture=new O(t,r,r,g,b),this.initialPositionsTexture.minFilter=h,this.initialPositionsTexture.magFilter=h,this.initialPositionsTexture.needsUpdate=!0,this.material=new F({uniforms:{uPositionObjects:{value:Array.from({length:u},()=>new m(0,0,0))},uPosition0:{value:this.initialPositionsTexture},uPosition1:{value:this.initialPositionsTexture},uPosition2:{value:this.initialPositionsTexture},time:{value:0}},vertexShader:B,fragmentShader:N}),this.setObjectPositions();const s=new y(2,2),v=new I(s,this.material);this.scene.add(v),this.fbos=[];for(let o=0;o<3;o++){const a=this.createRenderTarget();this.fbos.push(a),this.baseScene.renderer.setRenderTarget(a),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=2,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new A(r,r,{minFilter:h,magFilter:h,format:g,type:b})}step(e){const[t,s,v]=[this.currentFboIndex,(this.currentFboIndex+1)%3,(this.currentFboIndex+2)%3];this.material.uniforms.uPosition1.value=this.fbos[v].texture,this.material.uniforms.uPosition2.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[s]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=s}setObjectPositions(){for(let e=0;e<u;e++)this.material.uniforms.uPositionObjects.value[e]=this.baseScene.objects[e].position}}const V=`// From three.js: position, uv, normal\r
\r
uniform sampler2D uPosition;\r
varying vec2 vUv;\r
varying vec4 vPosition;\r
\r
void main() {\r
    vPosition = texture2D(uPosition, uv);\r
    vUv = uv;\r
    gl_PointSize = vPosition.w > 1.0 ? 1.0 : 1.0;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.xyz, 1.);\r
}`,G=`varying vec2 vUv;\r
varying vec4 vPosition;\r
\r
#define PI 3.14159265359\r
\r
void decodeIntAndFloat(float encoded, out int i, out float f) {\r
    i = int(floor(encoded));\r
    float f_bounded = fract(encoded);\r
    f = tan(PI*(f_bounded - 0.5));  \r
}\r
\r
void main() {\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    // float t = 1.-smoothstep(0.4, 0.5, dist);\r
    if (dist > 0.5)\r
        discard;\r
    int stateI;\r
    float stateF;\r
    decodeIntAndFloat(vPosition.w, stateI, stateF);\r
    float t = mix(0.0, 1.0, stateF);\r
    // vec4 col0 = mix(vec4(0.2, 0.2, 0.2, 1.), vec4(1.0, 0.2, 0.2, 1.), t);\r
    // vec4 col1 = mix(vec4(0.2, 0.2, 0.2, 1.), vec4(0.2, 0.2, 1.0, 1.), t);\r
    // vec4 color = stateI == 0 ? col0 : col1;\r
    // vec4 color = stateI == 0 ? col0 : col1;\r
    vec4 color = mix(vec4(0.2, 0.2, 0.5, 1.), vec4(1.0, 0.5, 0.2, 1.), t);\r
    // vec4 color = vec4(t, t, t, 1.0);\r
    gl_FragColor = color;\r
}\r
`;class q{constructor(e){n(this,"container");n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"cleanUpTasks");n(this,"animationRequestID",null);n(this,"lastTime",null);n(this,"objects",[]);n(this,"objectRotationVectors",[]);n(this,"fboScene");n(this,"material",null);this.container=e,this.cleanUpTasks=[],this.renderer=new U({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.setupResizeRenderer(),this.resizeRenderer(),this.fboScene=new H(this),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),this.camera instanceof x&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new P,t=new M(.1,1),s=new k({flatShading:!0});for(let c=0;c<u;c++){const l=new I(t,s);this.objects.push(l),this.objectRotationVectors.push(new m().randomDirection()),e.add(l)}const v=new C(16777215,200,0);v.position.set(0,50,0),e.add(new _(14544639,.8)),e.add(v);const o=new z,a=new Float32Array(r*r*2);for(let c=0;c<r;c++)for(let l=0;l<r;l++){let f=c*r+l;a[f*2+0]=c/r,a[f*2+1]=l/r}o.setAttribute("position",new S(new Float32Array(r*r*3),3)),o.setAttribute("uv",new S(a,2)),this.material=new F({uniforms:{uPosition:{value:null},time:{value:0}},vertexShader:V,fragmentShader:G});const d=new E(o,this.material);return d.frustumCulled=!1,e.add(d),e.rotateOnAxis(new m(1,0,0),-Math.PI/2),e}setupCamera(){const e=new x(60,1,.1,1e3),t=new D(e,this.container);return this.cleanUpTasks.push(()=>t.dispose()),e.position.set(0,1,1),e.lookAt(new m(0,0,0)),e}animate(){this.animationRequestID=requestAnimationFrame(this.animate);const e=(this.lastTime??0)+.01;this.lastTime=e,this.fboScene.material.uniforms.time.value=e,this.objects.forEach((t,s)=>{t.rotateOnAxis(this.objectRotationVectors[s],.2),t.position.set(1*Math.cos(s+.1*e),1*Math.sin(2*s+.2*e),.2)}),this.fboScene.setObjectPositions(),this.fboScene.step(this.renderer),this.material.uniforms.uPosition.value=this.fboScene.fbos[this.fboScene.currentFboIndex].texture,this.renderer.render(this.scene,this.camera),console.log(this.camera.position)}}const $=()=>{const i=p.useRef(null);return p.useEffect(()=>{console.log("useEffect: ",i.current);const e=new q(i.current);return()=>{e.cleanUp()}},[]),R.jsx("div",{ref:i,style:{width:"100%",height:"100%"}})};export{$ as default};
