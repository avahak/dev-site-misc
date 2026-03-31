import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{B as r,I as i,K as a,V as o,W as s,Y as c,c as l,dt as u,et as d,mt as f,nt as p,p as m,r as h,rt as g,s as _,v}from"./three.module-BYtFjljp.js";var y=e(t(),1),b=`varying vec2 vUv;\r
\r
void main() {\r
    vUv = uv;\r
    gl_Position = vec4(position.xy, 0.0, 1.);\r
}`,x=`uniform sampler2D trailMap;\r
uniform sampler2D uPosition;\r
uniform vec2 resolution;    // dimensions of trailMap\r
uniform float time;\r
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
vec3 safeNormalize(vec3 v) {\r
    float d = length(v);\r
    if (d > 0.0)\r
        return v / d;\r
    else \r
        return vec3(0., 0., 1.);\r
}\r
\r
// see https://en.wikipedia.org/wiki/Relative_luminance\r
float brightness(vec4 color) {\r
    // return (0.2126*color.r + 0.7152*color.g + 0.0722*color.b)*color.a;\r
    return (color.r + color.g + color.b)*color.a/3.0;\r
}\r
\r
vec2 wrap(vec2 p) {\r
    float aspect = resolution.x/resolution.y;\r
    vec2 q = vec2(mod(p.x+aspect, 2.*aspect)-aspect, mod(p.y+1., 2.)-1.);\r
    return q;\r
}\r
\r
vec4 newPosition(vec4 p) {\r
    // NOTE! effects depend largely on resolution!\r
    // PROBLEM: massive straight transport lines should not be part of the solution.\r
    // int state = int(floor(p.w));\r
    float energy = clamp(p.w-0.01, 0.0, 1.0);\r
    float a = 1.2*0.0+1.1;\r
    // float b = energy*energy*energy*0.2;\r
    float b = 0.01;\r
    float c = 1.0;\r
    float speed = pow(10.0, mix(-3.0, -2.0, energy));\r
    float angle = 15.0;\r
    float meandering = mix(1.0, 0.5, energy*energy)*0.0+1.0;    // with this we never blow up\r
    float sensorAngle = angle/180.0*3.14159;\r
    float turningAngle = meandering*angle/180.0*3.14159;\r
    float sensorDist = 9.0*speed;\r
    float aspect = resolution.x/resolution.y;\r
    vec2 res = 2.0*vec2(aspect, 1.0);\r
    vec2 offset = vec2(0.5);\r
\r
    // if (state == 1) {\r
        // speed = 0.015;\r
        // turningAngle = 10.0/180.0*3.14159;\r
        // sensorDist = 3.0*speed;\r
    // }\r
    // else if (state == 2) {\r
        // speed = 0.0075;\r
        // turningAngle = 45.0/180.0*3.14159;\r
        // sensorDist = 4.0*speed;\r
    // }\r
\r
    vec2 v0 = p.xy + sensorDist*vec2(cos(p.z), sin(p.z));\r
    vec2 v1 = p.xy + sensorDist*vec2(cos(p.z+sensorAngle), sin(p.z+sensorAngle));\r
    vec2 v2 = p.xy + sensorDist*vec2(cos(p.z-sensorAngle), sin(p.z-sensorAngle));\r
    vec2 w0 = p.xy + speed*vec2(cos(p.z), sin(p.z));\r
    vec2 w1 = p.xy + speed*vec2(cos(p.z+turningAngle), sin(p.z+turningAngle));\r
    vec2 w2 = p.xy + speed*vec2(cos(p.z-turningAngle), sin(p.z-turningAngle));\r
\r
    vec2 uv = p.xy/res + offset;\r
    vec2 uv0 = v0/res + offset;\r
    vec2 uv1 = v1/res + offset;\r
    vec2 uv2 = v2/res + offset;\r
\r
    vec4 trail = texture2D(trailMap, uv);\r
    vec4 trail0 = texture2D(trailMap, uv0);\r
    vec4 trail1 = texture2D(trailMap, uv1);\r
    vec4 trail2 = texture2D(trailMap, uv2);\r
    float br = brightness(trail);\r
    float br0 = brightness(trail0);\r
    float br1 = brightness(trail1);\r
    float br2 = brightness(trail2);\r
\r
    float newEnergy = clamp(mix(energy, br, 0.2), 0.0, 1.0);\r
\r
    vec4 q0 = vec4(w0, p.z, newEnergy);\r
    vec4 q1 = vec4(w1, p.z+turningAngle, newEnergy);\r
    vec4 q2 = vec4(w2, p.z-turningAngle, newEnergy);\r
\r
    if (energy > c) {\r
        if (random21(p.xy + vec2(time)) > 0.5)\r
            return q1;\r
        return q2;\r
        // return q0;\r
    }\r
    if ((br0 > a*br1+b) && (br0 > a*br2+b))\r
        return q0;\r
    if ((br0 <= a*br1+b) && (br0 <= a*br2+b)) {\r
        if (random21(p.xy+vec2(time)) > 0.5)\r
            return q1;\r
        return q2;\r
    }\r
    if (br1 < br2)\r
        return q2;\r
    return q1;\r
}\r
\r
void main() {\r
    vec4 p = texture2D(uPosition, vUv);\r
    vec4 q = newPosition(vec4(wrap(p.xy), p.zw));\r
    gl_FragColor = vec4(wrap(q.xy), q.zw);\r
}`,S=class{constructor(e){this.baseScene=e,this.scene=new p,this.camera=new o(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0);let t=new Float32Array(512*512*4);for(let e=0;e<512;e++)for(let n=0;n<512;n++){let r=e*512+n,i=Math.random()*Math.PI*2,a=.5+.1*Math.random();t[r*4+0]=a*Math.cos(i),t[r*4+1]=a*Math.sin(i),t[r*4+2]=Math.random()*2*Math.PI,t[r*4+3]=.5}this.initialPositionsTexture=new m(t,512,512,c,v),this.initialPositionsTexture.minFilter=r,this.initialPositionsTexture.magFilter=r,this.initialPositionsTexture.needsUpdate=!0,this.shaderMaterial=new g({uniforms:{uPosition:{value:this.initialPositionsTexture},trailMap:{value:this.baseScene.fbos[0].texture},resolution:{value:this.baseScene.getResolution()},time:{value:0}},vertexShader:b,fragmentShader:x});let n=new i(new s(2,2),this.shaderMaterial);this.scene.add(n),this.fbos=[];for(let e=0;e<2;e++){let e=this.createRenderTarget();this.fbos.push(e),this.baseScene.renderer.setRenderTarget(e),this.baseScene.renderer.render(this.scene,this.camera)}this.currentFboIndex=0,this.baseScene.renderer.setRenderTarget(null)}createRenderTarget(){return new f(512,512,{minFilter:r,magFilter:r,wrapS:d,wrapT:d,format:c,type:v})}step(e){let[t,n]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.shaderMaterial.uniforms.uPosition.value=this.fbos[t].texture,e.setRenderTarget(this.fbos[n]),e.render(this.scene,this.camera),e.setRenderTarget(null),this.currentFboIndex=n}},C=`// From three.js: position, uv, normal\r
\r
uniform sampler2D particleMap;\r
varying vec4 vParticle;\r
\r
void main() {\r
    vParticle = texture2D(particleMap, position.xy);\r
    gl_PointSize = 2.;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vParticle.xy, 0.5, 1.);\r
}`,w=`varying vec4 vParticle;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec2 offset = gl_PointCoord - vec2(0.5, 0.5);\r
    float dist = length(offset);\r
    // float t = 1.-smoothstep(0.4, 0.5, dist);\r
    if (dist > 0.5)\r
        discard;\r
\r
    float energy = clamp(vParticle.w, 0.0, 1.0);\r
    vec4 col1 = vec4(0.2, 0.5, 1., 0.1);\r
    vec4 col2 = vec4(1., 0.5, 0.2, 0.1);\r
    gl_FragColor = mix(col1, col2, energy);\r
\r
    // vec4 col1 = vec4(0.2, 0.5, 1., 1.0);\r
    // vec4 col2 = vec4(1., 0.5, 0.2, 0.02);\r
    // vec4 col3 = vec4(0.5, 1., 0.2, 0.02);\r
    // int state = int(floor(vParticle.w));\r
    // if (state == 0)\r
    //     gl_FragColor = col1;\r
    // else if (state == 1)\r
    //     gl_FragColor = col2;\r
    // else \r
    //     gl_FragColor = col3;\r
}\r
`,T=`varying vec4 vPosition;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0., 1.);\r
    gl_Position = vPosition;\r
}`,E=`uniform sampler2D trailMap;\r
uniform vec2 resolution;\r
uniform vec2 kernelOffsets[9];\r
uniform float kernelWeights[9];\r
varying vec4 vPosition;\r
\r
#define PI 3.14159265359\r
\r
// see https://en.wikipedia.org/wiki/Relative_luminance\r
float brightness(vec4 color) {\r
    // return (0.2126*color.r + 0.7152*color.g + 0.0722*color.b)*color.a;\r
    return (color.r + color.g + color.b)*color.a/3.0;\r
}\r
\r
void main() {\r
    vec2 uv = 0.5*(vPosition.xy+vec2(1.));\r
\r
    vec2 texelSize = 1.0/resolution;\r
\r
    vec4 colorSum = vec4(0.);\r
\r
    // Apply 3x3 Gaussian blur\r
    for (int k = 0; k < 9; k++) {\r
        vec2 elementUV = uv + kernelOffsets[k]*texelSize;\r
        vec4 value = texture2D(trailMap, elementUV);\r
        colorSum += value*kernelWeights[k];\r
    }\r
    vec4 blurredFadedColor = 0.8*colorSum;\r
    // vec4 blurredFadedColor = brightness(colorSum) > 0.1 ? 0.8*colorSum : colorSum;\r
\r
    gl_FragColor = vec4(blurredFadedColor.rgb, 1.0);\r
}\r
`,D=class{constructor(e){this.animationRequestID=null,this.lastTime=null,this.isStopped=!1,this.fbos=[],this.currentFboIndex=-1,this.shaderMaterialPoints=null,this.shaderMaterialTrail=null,this.container=e,this.cleanUpTasks=[],this.renderer=new h({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.renderer.getContext().getExtension(`EXT_float_blend`),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.disposeFbos=()=>this.fbos.forEach(e=>e.dispose()),this.setupResizeRenderer(),this.resizeRenderer(),this.particleScene=new S(this),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID),this.disposeFbos()}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),console.log(`Resize! (${e}, ${t})`);let n=e/t;this.camera instanceof o&&(this.camera.top=1,this.camera.bottom=-1,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMaterialTrail.uniforms.resolution.value=this.getResolution(),this.particleScene&&(this.particleScene.shaderMaterial.uniforms.resolution.value=this.getResolution())}setupResizeRenderer(){let e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}setupFbos(){this.disposeFbos(),this.fbos=[];for(let e=0;e<2;e++){let e=this.createRenderTarget();this.fbos.push(e)}this.currentFboIndex=0}createRenderTarget(){let{clientWidth:e,clientHeight:t}=this.container;return new f(e,t,{minFilter:r,magFilter:r,format:c,type:v})}cleanUp(){this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){let e=new p,t=new l,n=new Float32Array(512*512*3);for(let e=0;e<512;e++)for(let t=0;t<512;t++){let r=e*512+t;n[r*3+0]=e/512,n[r*3+1]=t/512,n[r*3+2]=0}t.setAttribute(`position`,new _(n,3)),this.shaderMaterialPoints=new g({uniforms:{particleMap:{value:null},time:{value:0}},vertexShader:C,fragmentShader:w,blending:2,depthWrite:!1,depthTest:!1});let r=new a(t,this.shaderMaterialPoints);r.frustumCulled=!1,e.add(r);let o=[[-1,1],[0,1],[1,1],[-1,0],[0,0],[1,0],[-1,-1],[0,-1],[1,-1]],c=Array(9).fill(1/9);this.shaderMaterialTrail=new g({uniforms:{trailMap:{value:null},resolution:{value:null},kernelOffsets:{value:o.map(e=>new u(e[0],e[1]))},kernelWeights:{value:c},time:{value:0}},vertexShader:T,fragmentShader:E,blending:2,depthWrite:!1});let d=new i(new s(2,2),this.shaderMaterialTrail);return e.add(d),e}setupCamera(){let e=new o(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){let{clientWidth:e,clientHeight:t}=this.container;return new u(e,t)}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){let t=(this.lastTime??0)+(e?0:.01);this.lastTime=t;let[n,r]=[this.currentFboIndex,(this.currentFboIndex+1)%2];this.particleScene.shaderMaterial.uniforms.time.value=t,this.particleScene.shaderMaterial.uniforms.trailMap.value=this.fbos[n].texture,e||this.particleScene.step(this.renderer),this.shaderMaterialPoints.uniforms.particleMap.value=this.particleScene.fbos[this.particleScene.currentFboIndex].texture,this.shaderMaterialTrail.uniforms.trailMap.value=this.fbos[n].texture,this.renderer.setRenderTarget(this.fbos[r]),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.currentFboIndex=r,this.renderer.render(this.scene,this.camera)}},O=n(),k=()=>{let e=(0,y.useRef)(null);return(0,y.useEffect)(()=>{console.log(`useEffect: `,e.current);let t=new D(e.current);return()=>{t.cleanUp()}},[]),(0,O.jsx)(`div`,{ref:e,style:{width:`100%`,height:`100%`}})};export{k as default};