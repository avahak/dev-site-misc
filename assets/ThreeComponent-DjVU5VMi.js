var D=Object.defineProperty;var U=(o,e,t)=>e in o?D(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var i=(o,e,t)=>U(o,typeof e!="symbol"?e+"":e,t);import{r as k,j as E}from"./index-Bx8vq5kq.js";import{O as g,u as I,N as C,R as A,q as J,r as T,l as w,s as y,t as M,f as z,i as P,y as O,z as K,W as j}from"./three.module-CyiO67I9.js";const S=`precision highp float;\r
\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0.0, 1.);\r
    vUv = uv;\r
    gl_Position = vPosition;\r
}`,L=`precision highp float;\r
\r
uniform sampler2D accumulatorMap1;\r
uniform sampler2D accumulatorMap2;\r
uniform vec2 resolution;\r
uniform int showMandelbrot;\r
uniform int showJulia;\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
void main() {\r
    vec4 color1 = texture2D(accumulatorMap1, vUv);\r
    vec4 color2 = texture2D(accumulatorMap2, vUv);\r
    if (showMandelbrot != 1 || showJulia != 1) {\r
        gl_FragColor = vec4(float(showMandelbrot)*color1.rgb + float(showJulia)*color2.rrr, 1.0);\r
        return;\r
    }\r
    gl_FragColor = vec4(color1.rgb*(0.3-0.25*color2.b), 1.0) + vec4(color2.rrr, color2.b);\r
}`,W=`precision highp float;\r
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
`,_=`precision highp float;\r
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
    return vec4(hsv2rgb(vec3(fract(0.5*log(1.0+iter)), 0.9, 0.7)), 1.0);\r
}\r
\r
void main() {\r
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);\r
    float iter = accOld.a;\r
    vec4 color = getColor(vUv);\r
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);\r
    gl_FragColor = vec4(accNewColor, iter+1.0);\r
}`;class B{constructor(e){i(this,"container");i(this,"camera");i(this,"fbosMandelbrot",[]);i(this,"fbosAccumulator",[]);i(this,"currentFboIndexMandelbrot",0);i(this,"currentFboIndexAccumulator",0);i(this,"disposeFbos");i(this,"sceneMandelbrot");i(this,"sceneAccumulator");i(this,"shaderMandelbrot");i(this,"shaderAccumulator");i(this,"workProgress",null);i(this,"box");this.container=e,this.setupMandelbrotScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosMandelbrot.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,r=e/t,[n,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.camera instanceof g&&(this.camera.top=s,this.camera.bottom=-s,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMandelbrot.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexMandelbrot=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosMandelbrot.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(){const{clientWidth:e,clientHeight:t}=this.container;return new I(e,t,{minFilter:C,magFilter:C,wrapS:A,wrapT:A,format:J,type:T})}setupMandelbrotScene(){this.sceneMandelbrot=new w,this.shaderMandelbrot=new y({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:S,fragmentShader:W});const e=new M(2,2),t=new z(e,this.shaderMandelbrot);this.sceneMandelbrot.add(t)}setupAccumulatorScene(){this.sceneAccumulator=new w,this.shaderAccumulator=new y({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},scale:{value:null},restart:{value:1}},vertexShader:S,fragmentShader:_});const e=new M(2,2),t=new z(e,this.shaderAccumulator);this.sceneAccumulator.add(t)}setupCamera(){this.camera=new g(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new P(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,r=e/t,[n,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.box=[this.workProgress.zoomCenter[0]-n*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]-s*this.workProgress.zoomScale,this.workProgress.zoomCenter[0]+n*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]+s*this.workProgress.zoomScale],this.shaderMandelbrot.uniforms.box.value=this.box}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentMandelbrotFboTexture(){return this.fbosMandelbrot[this.currentFboIndexMandelbrot].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const n=Math.floor(t/2)*(t+1),s=(e*1579+n)%(t*t),a=s%t/t,l=Math.floor(s/t)/t;return[a+.5/t,l+.5/t]}iterateMandelbrot(e,t,r){const[n,s]=[this.currentFboIndexMandelbrot,(this.currentFboIndexMandelbrot+1)%2];this.shaderMandelbrot.uniforms.mandelMap.value=this.fbosMandelbrot[n].texture,this.shaderMandelbrot.uniforms.subpixelOffset.value=r,this.shaderMandelbrot.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosMandelbrot[s]),e.render(this.sceneMandelbrot,this.camera),e.setRenderTarget(null),this.currentFboIndexMandelbrot=s}accumulateSample(e,t){var s;const[r,n]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.mandelMap.value=this.getCurrentMandelbrotFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[r].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,this.shaderAccumulator.uniforms.scale.value=(s=this.workProgress)==null?void 0:s.zoomScale,e.setRenderTarget(this.fbosAccumulator[n]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=n}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateMandelbrot(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}const X=`precision highp float;\r
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
    for (k = 0; (k < 2000) && (z.x*z.x + z.y*z.y < 1.0e3); k++) {\r
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
`,Y=`precision highp float;\r
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
    if (rz2 < 1.0e3)\r
        return vec4(0.0, 0.0, 1.0, 1.0);        // 0\r
    if (rw2 > 1.0e20)\r
        return vec4(1.0, 0.0, 1.0, 1.0);        // -1\r
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
}`;class H{constructor(e){i(this,"container");i(this,"camera");i(this,"fbosJulia",[]);i(this,"fbosAccumulator",[]);i(this,"currentFboIndexJulia",0);i(this,"currentFboIndexAccumulator",0);i(this,"disposeFbos");i(this,"sceneJulia");i(this,"sceneAccumulator");i(this,"shaderJulia");i(this,"shaderAccumulator");i(this,"workProgress",null);this.container=e,this.setupJuliaScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosJulia.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,r=e/t,[n,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.camera instanceof g&&(this.camera.top=s,this.camera.bottom=-s,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderJulia.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexJulia=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosJulia.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(e=4){const{clientWidth:t,clientHeight:r}=this.container;return new I(t,r,{minFilter:C,magFilter:C,wrapS:A,wrapT:A,format:[O,K,J][e],type:T})}setupJuliaScene(){this.sceneJulia=new w,this.shaderJulia=new y({uniforms:{box:{value:null},c:{value:null},subpixelOffset:{value:null},juliaMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:S,fragmentShader:X});const e=new M(2,2),t=new z(e,this.shaderJulia);this.sceneJulia.add(t)}setupAccumulatorScene(){this.sceneAccumulator=new w,this.shaderAccumulator=new y({uniforms:{juliaMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:S,fragmentShader:Y});const e=new M(2,2),t=new z(e,this.shaderAccumulator);this.sceneAccumulator.add(t)}setupCamera(){this.camera=new g(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new P(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,r=e/t,[n,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.shaderJulia.uniforms.box.value=[-n,-s,n,s]}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentJuliaFboTexture(){return this.fbosJulia[this.currentFboIndexJulia].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const n=Math.floor(t/2)*(t+1),s=(e*1579+n)%(t*t),a=s%t/t,l=Math.floor(s/t)/t;return[a+.5/t,l+.5/t]}iterateJulia(e,t,r){var a;const[n,s]=[this.currentFboIndexJulia,(this.currentFboIndexJulia+1)%2];this.shaderJulia.uniforms.juliaMap.value=this.fbosJulia[n].texture,this.shaderJulia.uniforms.subpixelOffset.value=r,this.shaderJulia.uniforms.restart.value=t?1:0,this.shaderJulia.uniforms.c.value=(a=this.workProgress)==null?void 0:a.c,e.setRenderTarget(this.fbosJulia[s]),e.render(this.sceneJulia,this.camera),e.setRenderTarget(null),this.currentFboIndexJulia=s}accumulateSample(e,t){const[r,n]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.juliaMap.value=this.getCurrentJuliaFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[r].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosAccumulator[n]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=n}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateJulia(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}function R(o){return Math.round(o*1e12)/1e12}function F(o){o.context.strokeStyle=o.color,o.context.lineWidth=1,o.context.fillStyle=o.color,o.context.font="12px Arial",o.context.textAlign=o.orientation==="horizontal"?"center":"right",o.context.textBaseline=o.orientation==="horizontal"?"bottom":"middle",o.context.shadowColor="transparent",o.context.shadowBlur=3,o.context.shadowOffsetX=1,o.context.shadowOffsetY=1;const e=d=>o.orientation==="horizontal"?(d-o.tMin)/(o.tMax-o.tMin)*o.width:(o.tMax-d)/(o.tMax-o.tMin)*o.height,t=o.tMax-o.tMin,r=o.orientation==="horizontal"?t/o.width:t/o.height,n=Math.log10(r),s=Math.floor(n),a=Math.pow(10,s+3);let l=a,c=5;r/a<.005&&(l=a/2,c=5),r/a<.002&&(l=a/5,c=2);const f=Math.floor(o.tMin/l),h=Math.ceil(o.tMax/l),u=o.orientation==="horizontal"?o.height-20:o.width-20;o.orientation==="horizontal"?o.context.fillRect(0,u-1,o.width,2):o.context.fillRect(u-1,0,2,o.height);for(let d=f;d<=h;d++){let p=d*l;p=Math.round(p*1e12)/1e12;let m=e(p);o.context.shadowColor="transparent",o.orientation==="horizontal"?o.context.fillRect(m-2,u-10,4,20):o.context.fillRect(u-10,m-2,20,4),o.context.shadowColor="rgba(0, 0, 0, 1.0)",o.orientation==="horizontal"?o.context.fillText(`${p}`,m,u-10):o.context.fillText(`${p}`,u-15,m);for(let x=1;x<c;x++){let v=(d+x/c)*l;v=Math.round(v*1e12)/1e12;const b=e(v);o.context.shadowColor="transparent",o.orientation==="horizontal"?o.context.fillRect(b-1,u-10,2,10):o.context.fillRect(u-10,b-1,10,2)}}}const q=5e-5;class N{constructor(e){i(this,"container");i(this,"scene");i(this,"camera");i(this,"renderer");i(this,"cleanUpTasks");i(this,"animationRequestID",null);i(this,"lastTime",null);i(this,"isStopped",!1);i(this,"mandelbrotScene");i(this,"mandelbrotStage");i(this,"juliaScene");i(this,"juliaStage");i(this,"showJulia",!0);i(this,"showMandelbrot",!0);i(this,"shader",null);i(this,"z0",[-.5,0]);i(this,"zoomCenter",[-.5,0]);i(this,"zoomScale",1);i(this,"overlayCanvas");this.container=e,this.cleanUpTasks=[],this.renderer=new j({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.overlayCanvas=document.createElement("canvas"),this.overlayCanvas.style.position="absolute",this.overlayCanvas.style.top="0",this.overlayCanvas.style.left="0",this.overlayCanvas.style.width="100%",this.overlayCanvas.style.height="100%",this.overlayCanvas.style.pointerEvents="none",e.appendChild(this.overlayCanvas),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.mandelbrotScene=new B(e),this.resetMandelbrotStage(),this.juliaScene=new H(e),this.resetJuliaStage(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){var a,l;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1));const{clientWidth:e,clientHeight:t}=this.container;this.overlayCanvas.width=e,this.overlayCanvas.height=t,this.renderer.setSize(e,t),console.log(`Resize! (${e}, ${t})`);const r=e/t,[n,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.camera instanceof g&&(this.camera.top=s,this.camera.bottom=-s,this.camera.left=-n,this.camera.right=n,this.camera.updateProjectionMatrix()),this.shader.uniforms.resolution.value=this.getResolution(),(a=this.mandelbrotScene)==null||a.resize(),this.resetMandelbrotStage(),(l=this.juliaScene)==null||l.resize(),this.resetJuliaStage()}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new w;this.shader=new y({uniforms:{accumulatorMap1:{value:null},accumulatorMap2:{value:null},resolution:{value:null},showJulia:{value:null},showMandelbrot:{value:null},time:{value:0}},vertexShader:S,fragmentShader:L});const t=new M(2,2),r=new z(t,this.shader);return e.add(r),e}setupCamera(){const e=new g(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new P(e,t)}saveAsImage(e){const r=this.renderer.domElement.toDataURL("image/png"),n=document.createElement("a");n.href=r,n.download=e+".png",document.body.appendChild(n),n.click(),document.body.removeChild(n)}resetMandelbrotStage(){this.mandelbrotStage=0,this.progressMandelbrotStage()}resetJuliaStage(){this.juliaStage=0,this.progressJuliaStage()}progressMandelbrotStage(){if(this.mandelbrotStage>=2)return;const e={zoomCenter:this.zoomCenter,zoomScale:this.zoomScale,iterations:[1,32][this.mandelbrotStage],samplesPerAxis:[1,5][this.mandelbrotStage]};this.mandelbrotScene.assignWork(e),this.mandelbrotStage++}progressJuliaStage(){if(this.juliaStage>=2)return;const e={c:this.z0,zoomScale:this.zoomScale,iterations:[1,32][this.juliaStage],samplesPerAxis:[1,5][this.juliaStage]};this.juliaScene.assignWork(e),this.juliaStage++}pointerInput(e,t,r,n){const s=this.getResolution(),a=s.x/s.y,[l,c]=[a>1.5?a:1.5,a>1.5?1:1.5/a];this.zoomCenter=[this.zoomCenter[0]-this.zoomScale*2*l*e/s.x,this.zoomCenter[1]+this.zoomScale*2*c*t/s.y],this.zoomScale=Math.max(this.zoomScale*r,q),this.resetMandelbrotStage()}pointerMove(e,t){const r=this.getResolution(),n=r.x/r.y,[s,a]=[n>1.5?n:1.5,n>1.5?1:1.5/n],l=[s*(e/r.x-.5),a*(t/r.y-.5)];this.z0=[this.zoomCenter[0]+2*this.zoomScale*l[0],this.zoomCenter[1]-2*this.zoomScale*l[1]],this.resetJuliaStage()}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.01);this.lastTime=t,this.showMandelbrot&&this.mandelbrotScene.step(this.renderer)&&this.progressMandelbrotStage(),this.showJulia&&this.juliaScene.step(this.renderer)&&this.progressJuliaStage(),this.shader.uniforms.accumulatorMap1.value=this.mandelbrotScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.accumulatorMap2.value=this.juliaScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.showJulia.value=this.showJulia?1:0,this.shader.uniforms.showMandelbrot.value=this.showMandelbrot?1:0,this.renderer.render(this.scene,this.camera);const r=this.overlayCanvas.getContext("2d");if(r){const n=this.getResolution();r.clearRect(0,0,n.x,n.y),this.showMandelbrot&&(F({context:r,width:n.x,height:n.y,tMin:this.mandelbrotScene.box[0],tMax:this.mandelbrotScene.box[2],orientation:"horizontal",color:this.showJulia?"rgba(100, 100, 100, 1.0)":"white"}),F({context:r,width:n.x,height:n.y,tMin:this.mandelbrotScene.box[1],tMax:this.mandelbrotScene.box[3],orientation:"vertical",color:this.showJulia?"rgba(100, 100, 100, 1.0)":"white"})),this.showJulia&&(r.strokeStyle="white",r.fillStyle="white",r.font="12px Arial",r.textAlign="right",r.textBaseline="top",r.fillText(`Julia z0 = (${R(this.z0[0])}, ${R(this.z0[1])})`,n.x-50,10))}}}function V(o,e,t){return e>=o.left&&e<=o.right&&t>=o.top&&t<=o.bottom}class ${constructor(e,t){i(this,"container");i(this,"mapper");i(this,"pointers",new Map);i(this,"lastDistance",null);i(this,"lastAngle",null);i(this,"lastMidpoint",null);i(this,"onContextmenu",e=>{e.preventDefault()});i(this,"onPointerDown",e=>{var r,n;e.preventDefault();const t=this.container.getBoundingClientRect();if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),e.pointerType==="mouse"&&((r=this.mapper.mouse)!=null&&r.down)?this.mapper.mouse.down(e.clientX-t.left,e.clientY-t.top,e.button):e.pointerType==="touch"&&this.pointers.size===1&&((n=this.mapper.touch)!=null&&n.start)&&this.mapper.touch.start(e.clientX-t.left,e.clientY-t.top),this.pointers.size===2&&e.pointerType==="touch"){const[s,a]=Array.from(this.pointers.values());this.lastDistance=this.getDistance(s,a),this.lastAngle=this.getAngle(s,a),this.lastMidpoint=this.getMidpoint(s,a)}});i(this,"onPointerMove",e=>{var a,l,c,f;e.preventDefault();const t=this.container.getBoundingClientRect();e.pointerType==="mouse"&&(a=this.mapper.mouse)!=null&&a.move&&this.mapper.mouse.move(e.clientX-t.left,e.clientY-t.top,V(t,e.clientX,e.clientY));const r=this.pointers.get(e.pointerId);if(!r)return;const n=e.clientX-r.x,s=e.clientY-r.y;if(e.pointerType==="mouse")(l=this.mapper.mouse)!=null&&l.drag&&this.mapper.mouse.drag(e.clientX-t.left,e.clientY-t.top,n,s,e.buttons);else if(e.pointerType==="touch"){if(this.pointers.size===1&&((c=this.mapper.touch)!=null&&c.dragSingle))this.mapper.touch.dragSingle(e.clientX-t.left,e.clientY-t.top,n,s);else if(this.pointers.size===2){const[h,u]=Array.from(this.pointers.values()),d=this.getDistance(h,u),p=this.getAngle(h,u),m=this.getMidpoint(h,u);if(this.lastDistance&&this.lastAngle&&this.lastMidpoint){const x=this.lastDistance/d,v=p-this.lastAngle,b={x:m.x-this.lastMidpoint.x,y:m.y-this.lastMidpoint.y};(f=this.mapper.touch)!=null&&f.dragPair&&this.mapper.touch.dragPair(m.x,m.y,b.x,b.y,x,v),this.lastDistance=d,this.lastAngle=p,this.lastMidpoint=m}}}this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY})});i(this,"onPointerUp",e=>{var r,n;e.preventDefault();const t=this.container.getBoundingClientRect();this.pointers.delete(e.pointerId),e.pointerType==="mouse"&&((r=this.mapper.mouse)!=null&&r.up)?this.mapper.mouse.up(e.clientX-t.left,e.clientY-t.top,e.button):e.pointerType==="touch"&&this.pointers.size===0&&((n=this.mapper.touch)!=null&&n.end)&&this.mapper.touch.end(e.clientX-t.left,e.clientY-t.top),this.pointers.size<2&&(this.lastDistance=null,this.lastAngle=null,this.lastMidpoint=null)});i(this,"onWheel",e=>{var r;e.preventDefault();const t=this.container.getBoundingClientRect();if((r=this.mapper.mouse)!=null&&r.wheel){const n=e.deltaY<0?.8333333333333334:1.2;this.mapper.mouse.wheel(e.clientX-t.left,e.clientY-t.top,n)}});i(this,"onKeydown",e=>{var t;(t=this.mapper.keyboard)!=null&&t.keydown&&this.mapper.keyboard.keydown({key:e.key,code:e.code,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,altKey:e.altKey,metaKey:e.metaKey})});i(this,"onKeyup",e=>{var t;(t=this.mapper.keyboard)!=null&&t.keyup&&this.mapper.keyboard.keyup({key:e.key,code:e.code,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,altKey:e.altKey,metaKey:e.metaKey})});this.container=e,this.mapper=t,this.container.style.touchAction="none",this.container.addEventListener("pointerdown",this.onPointerDown),window.addEventListener("pointermove",this.onPointerMove),this.container.addEventListener("pointerup",this.onPointerUp),this.container.addEventListener("pointercancel",this.onPointerUp),this.container.addEventListener("wheel",this.onWheel),this.container.addEventListener("contextmenu",this.onContextmenu),document.addEventListener("keydown",this.onKeydown),document.addEventListener("keyup",this.onKeyup)}getDistance(e,t){const r=t.x-e.x,n=t.y-e.y;return Math.sqrt(r*r+n*n)}getAngle(e,t){return Math.atan2(t.y-e.y,t.x-e.x)}getMidpoint(e,t){return{x:(e.x+t.x)/2,y:(e.y+t.y)/2}}cleanup(){this.container.removeEventListener("pointerdown",this.onPointerDown),window.removeEventListener("pointermove",this.onPointerMove),this.container.removeEventListener("pointerup",this.onPointerUp),this.container.removeEventListener("pointercancel",this.onPointerUp),this.container.removeEventListener("wheel",this.onWheel),this.container.removeEventListener("contextmenu",this.onContextmenu),document.removeEventListener("keydown",this.onKeydown),document.removeEventListener("keyup",this.onKeyup)}}const ee=({showMandelbrot:o,showJulia:e})=>{const t=k.useRef(null),r=k.useRef(null);return k.useEffect(()=>{r.current&&(r.current.showMandelbrot=o,r.current.showJulia=e)},[e,o]),k.useEffect(()=>{console.log("useEffect: ",t.current);const n=new N(t.current);r.current=n;const s=new $(t.current,{mouse:{drag:(a,l,c,f,h)=>{(h&2||h&4)&&n.pointerInput(c,f,1,0),h&1&&n.pointerMove(a,l)},wheel:(a,l,c)=>n.pointerInput(0,0,c,0),down:(a,l,c)=>c===0&&n.pointerMove(a,l)},touch:{start:(a,l)=>n.pointerMove(a,l),dragSingle:(a,l,c,f)=>n.pointerMove(a,l),dragPair:(a,l,c,f,h,u)=>n.pointerInput(c,f,h,u)},keyboard:{keydown:a=>{a.key.toUpperCase()==="J"&&(n.showJulia=!n.showJulia),a.key.toUpperCase()==="M"&&(n.showMandelbrot=!n.showMandelbrot),a.key==="-"&&n.pointerInput(0,0,1.2,0),a.key==="+"&&n.pointerInput(0,0,1/1.2,0)}}});return()=>{n.cleanUp(),s.cleanup()}},[]),E.jsx("div",{ref:t,style:{width:"100%",height:"100%"}})};export{ee as default};
