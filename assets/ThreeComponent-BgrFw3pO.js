var k=Object.defineProperty;var P=(a,e,t)=>e in a?k(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var r=(a,e,t)=>P(a,typeof e!="symbol"?e+"":e,t);import{r as x,j as A}from"./index-Coa9B0iw.js";import{O as l,u as w,N as v,R as g,q as z,r as S,l as u,s as h,t as m,f as d,i as b,y as C,z as F,W as I}from"./three.module-CyiO67I9.js";const p=`precision highp float;\r
\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0.0, 1.);\r
    vUv = uv;\r
    gl_Position = vPosition;\r
}`,R=`precision highp float;\r
\r
uniform sampler2D accumulatorMap1;\r
uniform sampler2D accumulatorMap2;\r
uniform vec2 resolution;\r
uniform int showJulia;\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec4 color1 = texture2D(accumulatorMap1, vUv);\r
    vec4 color2 = texture2D(accumulatorMap2, vUv);\r
    gl_FragColor = showJulia == 1 ? \r
        vec4(color1.rgb*(0.3-0.25*color2.b), 1.0) + vec4(color2.rrr, color2.b) : \r
        vec4(color1.rgb, 1.0);\r
}`,J=`precision highp float;\r
\r
uniform sampler2D mandelMap;\r
uniform vec4 box;\r
uniform vec2 resolution;\r
uniform vec2 subpixelOffset;    // [-0.5,0.5]x[-0.5,0.5]\r
uniform int restart;            // 1: restart from zero\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec4 tex = (restart == 1) ? vec4(0.0, 0.0, 0.0, 1.0) : texture2D(mandelMap, vUv);\r
\r
    vec2 cSubpixelOffset = subpixelOffset / resolution * vec2(box.z-box.x, box.w-box.y);\r
    vec2 c = vec2(mix(box.x, box.z, vUv.x), mix(box.y, box.w, vUv.y)) + cSubpixelOffset;\r
    vec2 z = tex.xy;\r
    float iter = tex.z;\r
\r
    int k;\r
    for (k = 0; (k < 1000) && (z.x*z.x + z.y*z.y < 100.0); k++) {\r
        float temp = 2.0*z.x*z.y + c.y;\r
        z.x = z.x*z.x - z.y*z.y + c.x;\r
        z.y = temp;\r
    }\r
    iter = iter + float(k);\r
\r
    gl_FragColor = vec4(z, iter, 1.0);\r
}\r
`,U=`precision highp float;\r
\r
uniform sampler2D mandelMap;\r
uniform sampler2D accumulatorMap;\r
uniform vec2 resolution;\r
uniform int restart;            // 1: restart from zero\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
vec3 hsv2rgb(vec3 c) {\r
    // Source: https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl\r
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\r
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\r
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\r
}\r
\r
vec4 getColor(vec2 uv) {\r
    vec4 tex = texture2D(mandelMap, uv);\r
    vec2 z = tex.xy;\r
    float iter = tex.z;\r
\r
    float r2 = z.x*z.x + z.y*z.y;\r
    iter = iter - log(log(r2)/log(100.0))/log(2.0);\r
\r
    if (r2 < 4.0)\r
        return vec4(0.0, 0.0, 0.0, 1.0);\r
\r
    return vec4(hsv2rgb(vec3(fract(log(1.0+iter)), 1.0, 1.0)), 1.0);\r
}\r
\r
// void main() {\r
//     vec4 color = vec4(0.0);\r
//     for (int k1 = 0; k1 < 4; k1++)\r
//         for (int k2 = 0; k2 < 4; k2++)\r
//             color = color + getColor(vUv+vec2(float(k1)/4.0, float(k2)/4.0)/resolution)/16.0;\r
\r
//     float aspect = resolution.x / resolution.y;\r
//     float t = length((vUv-vec2(0.5))*vec2(aspect, 1.0));\r
//     if (t < 0.05 && t > 0.048)\r
//         color = vec4(1.0, 1.0, 1.0, 1.0);\r
\r
//     gl_FragColor = color;\r
// }\r
\r
void main() {\r
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);\r
    float iter = accOld.a;\r
    vec4 color = getColor(vUv);\r
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);\r
    gl_FragColor = vec4(accNewColor, iter+1.0);\r
}`;class D{constructor(e){r(this,"container");r(this,"camera");r(this,"fbosMandelbrot",[]);r(this,"fbosAccumulator",[]);r(this,"currentFboIndexMandelbrot",0);r(this,"currentFboIndexAccumulator",0);r(this,"disposeFbos");r(this,"sceneMandelbrot");r(this,"sceneAccumulator");r(this,"shaderMandelbrot");r(this,"shaderAccumulator");r(this,"workProgress",null);this.container=e,this.setupMandelbrotScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosMandelbrot.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,n=e/t;this.camera instanceof l&&(this.camera.top=1,this.camera.bottom=-1,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMandelbrot.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexMandelbrot=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosMandelbrot.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(){const{clientWidth:e,clientHeight:t}=this.container;return new w(e,t,{minFilter:v,magFilter:v,wrapS:g,wrapT:g,format:z,type:S})}setupMandelbrotScene(){this.sceneMandelbrot=new u,this.shaderMandelbrot=new h({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:p,fragmentShader:J});const e=new m(2,2),t=new d(e,this.shaderMandelbrot);this.sceneMandelbrot.add(t)}setupAccumulatorScene(){this.sceneAccumulator=new u,this.shaderAccumulator=new h({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},scale:{value:null},restart:{value:1}},vertexShader:p,fragmentShader:U});const e=new m(2,2),t=new d(e,this.shaderAccumulator);this.sceneAccumulator.add(t)}setupCamera(){this.camera=new l(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new b(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,n=e/t;this.shaderMandelbrot.uniforms.box.value=[this.workProgress.zoomCenter[0]-n*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]-this.workProgress.zoomScale,this.workProgress.zoomCenter[0]+n*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]+this.workProgress.zoomScale]}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentMandelbrotFboTexture(){return this.fbosMandelbrot[this.currentFboIndexMandelbrot].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const s=Math.floor(t/2)*(t+1),o=(e*1579+s)%(t*t),i=o%t/t,c=Math.floor(o/t)/t;return[i+.5/t,c+.5/t]}iterateMandelbrot(e,t,n){const[s,o]=[this.currentFboIndexMandelbrot,(this.currentFboIndexMandelbrot+1)%2];this.shaderMandelbrot.uniforms.mandelMap.value=this.fbosMandelbrot[s].texture,this.shaderMandelbrot.uniforms.subpixelOffset.value=n,this.shaderMandelbrot.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosMandelbrot[o]),e.render(this.sceneMandelbrot,this.camera),e.setRenderTarget(null),this.currentFboIndexMandelbrot=o}accumulateSample(e,t){var o;const[n,s]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.mandelMap.value=this.getCurrentMandelbrotFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[n].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,this.shaderAccumulator.uniforms.scale.value=(o=this.workProgress)==null?void 0:o.zoomScale,e.setRenderTarget(this.fbosAccumulator[s]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=s}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateMandelbrot(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}const T=`precision highp float;\r
\r
uniform sampler2D juliaMap;\r
uniform vec4 box;\r
uniform vec2 resolution;\r
uniform vec2 subpixelOffset;    // [-0.5,0.5]x[-0.5,0.5]\r
uniform vec2 c;\r
uniform int restart;            // 1: restart from zero\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec2 cSubpixelOffset = subpixelOffset / resolution * vec2(box.z-box.x, box.w-box.y);\r
    vec2 z0 = vec2(mix(box.x, box.z, vUv.x), mix(box.y, box.w, vUv.y)) + cSubpixelOffset;\r
    \r
    vec4 tex = (restart == 1) ? vec4(z0, 1.0, 0.0) : texture2D(juliaMap, vUv);\r
\r
    vec2 z = tex.xy;\r
    vec2 w = tex.zw;\r
\r
    int k;\r
    float temp;\r
    for (k = 0; (k < 2000) && (z.x*z.x + z.y*z.y < 100.0); k++) {\r
\r
        if (w.x*w.x + w.y*w.y < 1.0e20) {\r
            temp = 2.0*z.x*w.y + 2.0*z.y*w.x;\r
            w.x = 2.0*z.x*w.x - 2.0*z.y*w.y;\r
            w.y = temp;\r
        }\r
\r
        temp = 2.0*z.x*z.y + c.y;\r
        z.x = z.x*z.x - z.y*z.y + c.x;\r
        z.y = temp;\r
    }\r
\r
    gl_FragColor = vec4(z, w);\r
}\r
`,O=`precision highp float;\r
\r
uniform sampler2D juliaMap;\r
uniform sampler2D accumulatorMap;\r
uniform vec2 resolution;\r
uniform int restart;            // 1: restart from zero\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
vec4 getColor(vec2 uv) {\r
    vec4 tex = texture2D(juliaMap, uv);\r
    vec2 z = tex.xy;\r
    vec2 w = tex.zw;\r
\r
    float rz2 = z.x*z.x + z.y*z.y;\r
    float rw2 = w.x*w.x + w.y*w.y;\r
\r
    if (rz2 < 100.0)\r
        return vec4(0.0, 0.0, 1.0, 1.0);        // 0\r
    if (rw2 > 1.0e24)\r
        return vec4(0.0, 0.0, 1.0, 1.0);        // -1\r
\r
    float d = sqrt(rz2/rw2)*log(rz2);\r
\r
    float b = 0.5;\r
\r
    float s = log(d/b);\r
\r
    if (d > b)\r
        return vec4(0.0, 0.0, 0.0, 1.0);\r
\r
    if (d > 0.1*b) {\r
        float t = smoothstep(0.1*b, b, d);\r
        return vec4(mix(vec3(0.1, 0.1, 0.1), vec3(0.0, 0.0, 0.0), t), 1.0);\r
    }\r
\r
    if (d > 0.01*b) {\r
        float t = smoothstep(0.01*b, 0.1*b, d);\r
        return vec4(mix(vec3(0.2, 0.2, 0.2), vec3(0.1, 0.1, 0.1), t), 1.0);\r
    }\r
\r
    if (d > 0.001*b) {\r
        float t = smoothstep(0.001*b, 0.01*b, d);\r
        return vec4(mix(vec3(0.4, 0.4, 0.4), vec3(0.2, 0.2, 0.2), t), 1.0);\r
    }\r
\r
    float t = smoothstep(0.0, 0.001*b, d);\r
    return vec4(mix(vec3(1.0, 1.0, 1.0), vec3(0.4, 0.4, 0.4), t), 1.0);\r
}\r
\r
void main() {\r
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);\r
    float iter = accOld.a;\r
    vec4 color = getColor(vUv);\r
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);\r
    gl_FragColor = vec4(accNewColor, iter+1.0);\r
}`;class j{constructor(e){r(this,"container");r(this,"camera");r(this,"fbosJulia",[]);r(this,"fbosAccumulator",[]);r(this,"currentFboIndexJulia",0);r(this,"currentFboIndexAccumulator",0);r(this,"disposeFbos");r(this,"sceneJulia");r(this,"sceneAccumulator");r(this,"shaderJulia");r(this,"shaderAccumulator");r(this,"workProgress",null);this.container=e,this.setupJuliaScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosJulia.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,n=e/t;this.camera instanceof l&&(this.camera.top=1,this.camera.bottom=-1,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderJulia.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexJulia=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosJulia.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(e=4){const{clientWidth:t,clientHeight:n}=this.container;return new w(t,n,{minFilter:v,magFilter:v,wrapS:g,wrapT:g,format:[C,F,z][e],type:S})}setupJuliaScene(){this.sceneJulia=new u,this.shaderJulia=new h({uniforms:{box:{value:null},c:{value:null},subpixelOffset:{value:null},juliaMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:p,fragmentShader:T});const e=new m(2,2),t=new d(e,this.shaderJulia);this.sceneJulia.add(t)}setupAccumulatorScene(){this.sceneAccumulator=new u,this.shaderAccumulator=new h({uniforms:{juliaMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:p,fragmentShader:O});const e=new m(2,2),t=new d(e,this.shaderAccumulator);this.sceneAccumulator.add(t)}setupCamera(){this.camera=new l(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new b(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,n=e/t;this.shaderJulia.uniforms.box.value=[-n,-1,n,1]}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentJuliaFboTexture(){return this.fbosJulia[this.currentFboIndexJulia].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const s=Math.floor(t/2)*(t+1),o=(e*1579+s)%(t*t),i=o%t/t,c=Math.floor(o/t)/t;return[i+.5/t,c+.5/t]}iterateJulia(e,t,n){var i;const[s,o]=[this.currentFboIndexJulia,(this.currentFboIndexJulia+1)%2];this.shaderJulia.uniforms.juliaMap.value=this.fbosJulia[s].texture,this.shaderJulia.uniforms.subpixelOffset.value=n,this.shaderJulia.uniforms.restart.value=t?1:0,this.shaderJulia.uniforms.c.value=(i=this.workProgress)==null?void 0:i.c,e.setRenderTarget(this.fbosJulia[o]),e.render(this.sceneJulia,this.camera),e.setRenderTarget(null),this.currentFboIndexJulia=o}accumulateSample(e,t){const[n,s]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.juliaMap.value=this.getCurrentJuliaFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[n].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosAccumulator[s]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=s}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateJulia(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}const E=5e-5;class W{constructor(e){r(this,"container");r(this,"scene");r(this,"camera");r(this,"renderer");r(this,"cleanUpTasks");r(this,"animationRequestID",null);r(this,"lastTime",null);r(this,"isStopped",!1);r(this,"mandelbrotScene");r(this,"mandelbrotStage");r(this,"juliaScene");r(this,"juliaStage");r(this,"showJulia",!1);r(this,"shader",null);r(this,"z0",[-.5,0]);r(this,"zoomCenter",[-.5,0]);r(this,"zoomScale",1);this.container=e,this.cleanUpTasks=[],this.renderer=new I({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.mandelbrotScene=new D(e),this.resetMandelbrotStage(),this.juliaScene=new j(e),this.resetJuliaStage(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){var s;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const{clientWidth:e,clientHeight:t}=this.container;this.renderer.setSize(e,t),console.log(`Resize! (${e}, ${t})`);const n=e/t;this.camera instanceof l&&(this.camera.top=1,this.camera.bottom=-1,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.shader.uniforms.resolution.value=this.getResolution(),(s=this.mandelbrotScene)==null||s.resize(),this.resetMandelbrotStage()}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new u;this.shader=new h({uniforms:{accumulatorMap1:{value:null},accumulatorMap2:{value:null},resolution:{value:null},showJulia:{value:0},time:{value:0}},vertexShader:p,fragmentShader:R});const t=new m(2,2),n=new d(t,this.shader);return e.add(n),e}setupCamera(){const e=new l(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new b(e,t)}saveAsImage(e){const n=this.renderer.domElement.toDataURL("image/png"),s=document.createElement("a");s.href=n,s.download=e+".png",document.body.appendChild(s),s.click(),document.body.removeChild(s)}resetMandelbrotStage(){this.mandelbrotStage=0,this.progressMandelbrotStage()}resetJuliaStage(){this.juliaStage=0,this.progressJuliaStage()}progressMandelbrotStage(){if(this.mandelbrotStage>=2)return;const e={zoomCenter:this.zoomCenter,zoomScale:this.zoomScale,iterations:[1,32][this.mandelbrotStage],samplesPerAxis:[1,7][this.mandelbrotStage]};this.mandelbrotScene.assignWork(e),this.mandelbrotStage++}progressJuliaStage(){if(this.juliaStage>=4)return;const e={c:this.z0,zoomScale:this.zoomScale,iterations:[1,16][this.juliaStage],samplesPerAxis:[1,7][this.juliaStage]};this.juliaScene.assignWork(e),this.juliaStage++}pointerInput(e,t,n,s){const o=this.getResolution(),i=o.x/o.y;this.zoomCenter=[this.zoomCenter[0]-this.zoomScale*2*i*e/o.x,this.zoomCenter[1]+this.zoomScale*2*t/o.y],this.zoomScale=Math.max(this.zoomScale*n,E),this.resetMandelbrotStage()}pointerMove(e,t,n,s,o){if(this.showJulia=o,!o)return;const i=this.getResolution(),f=[i.x/i.y*(e/i.x-.5),t/i.y-.5];this.z0=[this.zoomCenter[0]+2*this.zoomScale*f[0],this.zoomCenter[1]-2*this.zoomScale*f[1]],this.resetJuliaStage()}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.01);this.lastTime=t,this.mandelbrotScene.step(this.renderer)&&this.progressMandelbrotStage(),this.juliaScene.step(this.renderer)&&this.progressJuliaStage(),this.shader.uniforms.accumulatorMap1.value=this.mandelbrotScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.accumulatorMap2.value=this.juliaScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.showJulia.value=this.showJulia?1:0,this.renderer.render(this.scene,this.camera)}}class L{constructor(e,t){r(this,"container");r(this,"handler");r(this,"pointers",new Map);r(this,"initialDistance",null);r(this,"initialAngle",null);r(this,"lastMidpoint",null);r(this,"onPointerDown",e=>{if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.pointers.size===2){const[t,n]=Array.from(this.pointers.values());this.initialDistance=this.getDistance(t,n),this.initialAngle=this.getAngle(t,n),this.lastMidpoint=this.getMidpoint(t,n)}});r(this,"onPointerMove",e=>{if(this.handler.pointerMove){const t=this.container.getBoundingClientRect(),n=e.clientX>=t.left&&e.clientY>=t.top&&e.clientX<=t.right&&e.clientY<=t.bottom;this.handler.pointerMove(e.clientX-t.left,e.clientY-t.top,t.left,t.top,n)}if(this.pointers.has(e.pointerId)){if(this.pointers.size===1){const t=this.pointers.get(e.pointerId),n=e.clientX-t.x,s=e.clientY-t.y;this.handler.pointerInput&&this.handler.pointerInput(n,s,1,0)}else if(this.pointers.size===2){const[t,n]=Array.from(this.pointers.values()),s=this.getDistance(t,n),o=this.getAngle(t,n),i=this.getMidpoint(t,n);if(this.initialDistance&&this.initialAngle&&this.lastMidpoint){const c=s/this.initialDistance,f=o-this.initialAngle,M=i.x-this.lastMidpoint.x,y=i.y-this.lastMidpoint.y;this.handler.pointerInput&&this.handler.pointerInput(M,y,c,f),this.lastMidpoint=i}}this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY})}});r(this,"onPointerUp",e=>{this.pointers.delete(e.pointerId),this.pointers.size<2&&(this.initialDistance=null,this.initialAngle=null,this.lastMidpoint=null)});r(this,"onWheel",e=>{e.preventDefault();const t=e.deltaY<0?1/1.2:1.2;this.handler.pointerInput&&this.handler.pointerInput(0,0,t,0)});this.container=e,this.handler=t,this.container.addEventListener("pointerdown",this.onPointerDown),window.addEventListener("pointermove",this.onPointerMove),this.container.addEventListener("pointerup",this.onPointerUp),this.container.addEventListener("pointercancel",this.onPointerUp),this.container.addEventListener("wheel",this.onWheel)}getDistance(e,t){const n=t.x-e.x,s=t.y-e.y;return Math.sqrt(n*n+s*s)}getAngle(e,t){return Math.atan2(t.y-e.y,t.x-e.x)}getMidpoint(e,t){return{x:(e.x+t.x)/2,y:(e.y+t.y)/2}}cleanup(){this.container.removeEventListener("pointerdown",this.onPointerDown),window.removeEventListener("pointermove",this.onPointerMove),this.container.removeEventListener("pointerup",this.onPointerUp),this.container.removeEventListener("pointercancel",this.onPointerUp),this.container.removeEventListener("wheel",this.onWheel)}}const B=()=>{const a=x.useRef(null);return x.useEffect(()=>{console.log("useEffect: ",a.current);const e=new W(a.current),t=new L(a.current,e);return()=>{e.cleanUp(),t.cleanup()}},[]),A.jsx("div",{ref:a,style:{width:"100%",height:"100%"}})};export{B as default};
