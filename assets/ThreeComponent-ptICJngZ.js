var U=Object.defineProperty;var O=(r,e,t)=>e in r?U(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var s=(r,e,t)=>O(r,typeof e!="symbol"?e+"":e,t);import{q as b,x as R,N as z,R as S,t as I,u as J,l as x,v as m,w as g,i as p,V as A,X as D,Y as j,W as E,r as M,Z as W,p as B}from"./index-CoH1wM2G.js";const f=`precision highp float;\r
\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
void main() {\r
    vPosition = vec4(position.xy, 0.0, 1.);\r
    vUv = uv;\r
    gl_Position = vPosition;\r
}`,_=`precision highp float;\r
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
vec3 juliaBaseColor = vec3(1.0, 0.9, 0.9);\r
\r
void main() {\r
    vec4 color1 = texture2D(accumulatorMap1, vUv);\r
    vec4 color2 = texture2D(accumulatorMap2, vUv);\r
    if (showMandelbrot != 1 || showJulia != 1) {\r
        gl_FragColor = vec4(float(showMandelbrot)*color1.rgb + float(showJulia)*color2.r*juliaBaseColor, 1.0);\r
        return;\r
    }\r
    gl_FragColor = vec4(color1.rgb*(0.3-0.25*color2.b), 1.0) + vec4(color2.r*juliaBaseColor, color2.b);\r
}`,H=`precision highp float;\r
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
    for (k = 0; (k < 1000) && (length(z) < 1.0e2); k++) {\r
        float temp = 2.0*z.x*z.y + c.y;\r
        z.x = z.x*z.x - z.y*z.y + c.x;\r
        z.y = temp;\r
    }\r
    iter = iter + float(k);\r
\r
    gl_FragColor = vec4(z, iter, 1.0);\r
}\r
`,K=`precision highp float;\r
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
    float r = length(z);\r
    iter = iter - log(log(r)/log(100.0))/log(2.0);\r
\r
    if (r < 2.0)\r
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
}`,N=`precision highp float;\r
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
    vec4 tex = (restart == 1) ? vec4(0.0, 0.0, 0.0, 0.0) : texture2D(mandelMap, vUv);\r
\r
    vec2 cSubpixelOffset = subpixelOffset / resolution * vec2(box.z-box.x, box.w-box.y);\r
    vec2 c = vec2(mix(box.x, box.z, vUv.x), mix(box.y, box.w, vUv.y)) + cSubpixelOffset;\r
    vec2 z = tex.xy;\r
    vec2 w = tex.zw;\r
\r
    int k;\r
    float temp;\r
    for (k = 0; (k < 1000) && (length(z) < 1.0e2); k++) {\r
\r
        if (length(w) < 1.0e32) {\r
            temp = 2.0*z.x*w.y + 2.0*z.y*w.x;\r
            w.x = 2.0*z.x*w.x - 2.0*z.y*w.y + 1.0;\r
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
`,q=`precision highp float;\r
\r
uniform sampler2D mandelMap;\r
uniform sampler2D accumulatorMap;\r
uniform vec2 resolution;\r
uniform int restart;            // 1: restart from zero\r
uniform float scale;\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
#define PI 3.14159265359\r
\r
vec3 baseColor = vec3(0.9, 0.9, 1.0);\r
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
    vec2 w = tex.zw;\r
\r
    float rz = length(z);\r
    float rw = length(w);\r
\r
    if (rz < 1.0e2)\r
        return vec4(0.0, 0.0, 0.0, 1.0);        // 0\r
    if (rw > 1.0e32)\r
        return vec4(baseColor, 1.0);        // -1\r
\r
    float d = 2.0*(rz/rw)*log(rz);\r
\r
    float b = 0.1*scale;\r
\r
    float s = log(d/b);\r
    vec3 colorOut = hsv2rgb(vec3(fract(s), 1.0, 1.0));\r
\r
    if (d > b)\r
        return vec4(0.0*colorOut, 1.0);\r
\r
    if (d > 0.1*b) {\r
        float t = smoothstep(0.1*b, b, d);\r
        return vec4(mix(0.1*baseColor, vec3(0.0), t), 1.0);\r
    }\r
\r
    if (d > 0.01*b) {\r
        float t = smoothstep(0.01*b, 0.1*b, d);\r
        return vec4(mix(0.2*baseColor, 0.1*baseColor, t), 1.0);\r
    }\r
\r
    if (d > 0.001*b) {\r
        float t = smoothstep(0.001*b, 0.01*b, d);\r
        return vec4(mix(0.4*baseColor, 0.2*baseColor, t), 1.0);\r
    }\r
\r
    float t = smoothstep(0.0, 0.001*b, d);\r
    return vec4(mix(baseColor, 0.4*baseColor, t), 1.0);\r
}\r
\r
void main() {\r
    vec4 accOld = restart == 1 ? vec4(0.0) : texture2D(accumulatorMap, vUv);\r
    float iter = accOld.a;\r
    vec4 color = getColor(vUv);\r
    vec3 accNewColor = (accOld.rgb*iter+color.rgb) / (iter+1.0);\r
    gl_FragColor = vec4(accNewColor, iter+1.0);\r
}`;class V{constructor(e){s(this,"container");s(this,"camera");s(this,"fbosMandelbrot",[]);s(this,"fbosAccumulator",[]);s(this,"currentFboIndexMandelbrot",0);s(this,"currentFboIndexAccumulator",0);s(this,"disposeFbos");s(this,"sceneMandelbrot");s(this,"sceneAccumulator");s(this,"shaderMandelbrot");s(this,"shaderMandelbrot1");s(this,"shaderMandelbrot2");s(this,"shaderAccumulator");s(this,"shaderAccumulator1");s(this,"shaderAccumulator2");s(this,"meshMandelbrot");s(this,"meshAccumulator");s(this,"mandelbrotMode","basic");s(this,"workProgress",null);s(this,"box");this.container=e,this.setupMandelbrotScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosMandelbrot.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,n=e/t,[o,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.camera instanceof b&&(this.camera.top=i,this.camera.bottom=-i,this.camera.left=-o,this.camera.right=o,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMandelbrot.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexMandelbrot=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosMandelbrot.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(){const{clientWidth:e,clientHeight:t}=this.container;return new R(e,t,{minFilter:z,magFilter:z,wrapS:S,wrapT:S,format:I,type:J})}setupMandelbrotScene(){this.sceneMandelbrot=new x,this.shaderMandelbrot1=new m({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:f,fragmentShader:H}),this.shaderMandelbrot2=new m({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:f,fragmentShader:N}),this.shaderMandelbrot=this.shaderMandelbrot1;const e=new g(2,2);this.meshMandelbrot=new p(e,this.shaderMandelbrot),this.sceneMandelbrot.add(this.meshMandelbrot)}setupAccumulatorScene(){this.sceneAccumulator=new x,this.shaderAccumulator1=new m({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},scale:{value:null},restart:{value:1}},vertexShader:f,fragmentShader:K}),this.shaderAccumulator2=new m({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},scale:{value:null},restart:{value:1}},vertexShader:f,fragmentShader:q}),this.shaderAccumulator=this.shaderAccumulator1;const e=new g(2,2);this.meshAccumulator=new p(e,this.shaderAccumulator),this.sceneAccumulator.add(this.meshAccumulator)}setupCamera(){this.camera=new b(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new A(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,n=e/t,[o,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.box=[this.workProgress.zoomCenter[0]-o*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]-i*this.workProgress.zoomScale,this.workProgress.zoomCenter[0]+o*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]+i*this.workProgress.zoomScale],this.shaderMandelbrot.uniforms.box.value=this.box}switchMode(){this.mandelbrotMode==="basic"?(this.shaderAccumulator=this.shaderAccumulator2,this.shaderMandelbrot=this.shaderMandelbrot2):(this.shaderAccumulator=this.shaderAccumulator1,this.shaderMandelbrot=this.shaderMandelbrot1),this.mandelbrotMode=this.mandelbrotMode==="basic"?"DEM/M":"basic",this.meshMandelbrot.material=this.shaderMandelbrot,this.meshAccumulator.material=this.shaderAccumulator,this.resize()}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentMandelbrotFboTexture(){return this.fbosMandelbrot[this.currentFboIndexMandelbrot].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const o=Math.floor(t/2)*(t+1),i=(e*1579+o)%(t*t),c=i%t/t,l=Math.floor(i/t)/t;return[c+.5/t,l+.5/t]}iterateMandelbrot(e,t,n){const[o,i]=[this.currentFboIndexMandelbrot,(this.currentFboIndexMandelbrot+1)%2];this.shaderMandelbrot.uniforms.mandelMap.value=this.fbosMandelbrot[o].texture,this.shaderMandelbrot.uniforms.subpixelOffset.value=n,this.shaderMandelbrot.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosMandelbrot[i]),e.render(this.sceneMandelbrot,this.camera),e.setRenderTarget(null),this.currentFboIndexMandelbrot=i}accumulateSample(e,t){var i;const[n,o]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.mandelMap.value=this.getCurrentMandelbrotFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[n].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,this.shaderAccumulator.uniforms.scale.value=(i=this.workProgress)==null?void 0:i.zoomScale,e.setRenderTarget(this.fbosAccumulator[o]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=o}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateMandelbrot(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}const G=`precision highp float;\r
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
    for (k = 0; (k < 2000) && (length(z) < 1.0e2); k++) {\r
\r
        if (length(w) < 1.0e32) {\r
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
`,$=`// DEM/J algorithm, The Science of Fractal Images, p. 199\r
\r
precision highp float;\r
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
    float rz = length(z);\r
    float rw = length(w);\r
\r
    if (rz < 1.0e2)\r
        return vec4(0.0, 0.0, 1.0, 1.0);        // 0\r
    if (rw > 1.0e32)\r
        return vec4(1.0, 0.0, 1.0, 1.0);        // -1\r
\r
    float d = 2.0*(rz/rw)*log(rz);\r
\r
    float b = 0.1;\r
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
}`;class L{constructor(e){s(this,"container");s(this,"camera");s(this,"fbosJulia",[]);s(this,"fbosAccumulator",[]);s(this,"currentFboIndexJulia",0);s(this,"currentFboIndexAccumulator",0);s(this,"disposeFbos");s(this,"sceneJulia");s(this,"sceneAccumulator");s(this,"shaderJulia");s(this,"shaderAccumulator");s(this,"workProgress",null);this.container=e,this.setupJuliaScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosJulia.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,n=e/t,[o,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.camera instanceof b&&(this.camera.top=i,this.camera.bottom=-i,this.camera.left=-o,this.camera.right=o,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderJulia.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexJulia=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosJulia.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(e=4){const{clientWidth:t,clientHeight:n}=this.container;return new R(t,n,{minFilter:z,magFilter:z,wrapS:S,wrapT:S,format:[D,j,I][e],type:J})}setupJuliaScene(){this.sceneJulia=new x,this.shaderJulia=new m({uniforms:{box:{value:null},c:{value:null},subpixelOffset:{value:null},juliaMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:f,fragmentShader:G});const e=new g(2,2),t=new p(e,this.shaderJulia);this.sceneJulia.add(t)}setupAccumulatorScene(){this.sceneAccumulator=new x,this.shaderAccumulator=new m({uniforms:{juliaMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:f,fragmentShader:$});const e=new g(2,2),t=new p(e,this.shaderAccumulator);this.sceneAccumulator.add(t)}setupCamera(){this.camera=new b(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new A(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,n=e/t,[o,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.shaderJulia.uniforms.box.value=[-o,-i,o,i]}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentJuliaFboTexture(){return this.fbosJulia[this.currentFboIndexJulia].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const o=Math.floor(t/2)*(t+1),i=(e*1579+o)%(t*t),c=i%t/t,l=Math.floor(i/t)/t;return[c+.5/t,l+.5/t]}iterateJulia(e,t,n){var c;const[o,i]=[this.currentFboIndexJulia,(this.currentFboIndexJulia+1)%2];this.shaderJulia.uniforms.juliaMap.value=this.fbosJulia[o].texture,this.shaderJulia.uniforms.subpixelOffset.value=n,this.shaderJulia.uniforms.restart.value=t?1:0,this.shaderJulia.uniforms.c.value=(c=this.workProgress)==null?void 0:c.c,e.setRenderTarget(this.fbosJulia[i]),e.render(this.sceneJulia,this.camera),e.setRenderTarget(null),this.currentFboIndexJulia=i}accumulateSample(e,t){const[n,o]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.juliaMap.value=this.getCurrentJuliaFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[n].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosAccumulator[o]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=o}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateJulia(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}function y(r){return Math.round(r*1e12)/1e12}function F(r){r.context.strokeStyle=r.color,r.context.lineWidth=1,r.context.fillStyle=r.color,r.context.font="12px Arial",r.context.textAlign=r.orientation==="horizontal"?"center":"right",r.context.textBaseline=r.orientation==="horizontal"?"bottom":"middle",r.context.shadowColor="transparent",r.context.shadowBlur=3,r.context.shadowOffsetX=1,r.context.shadowOffsetY=1;const e=d=>r.orientation==="horizontal"?(d-r.tMin)/(r.tMax-r.tMin)*r.width:(r.tMax-d)/(r.tMax-r.tMin)*r.height,t=r.tMax-r.tMin,n=r.orientation==="horizontal"?t/r.width:t/r.height,o=Math.log10(n),i=Math.floor(o),c=Math.pow(10,i+3);let l=c,u=5;n/c<.005&&(l=c/2,u=5),n/c<.002&&(l=c/5,u=2);const a=Math.floor(r.tMin/l),v=Math.ceil(r.tMax/l),h=r.orientation==="horizontal"?r.height-20:r.width-20;r.orientation==="horizontal"?r.context.fillRect(0,h-1,r.width,2):r.context.fillRect(h-1,0,2,r.height);for(let d=a;d<=v;d++){let k=y(d*l),w=e(k);r.context.shadowColor="transparent",r.orientation==="horizontal"?r.context.fillRect(w-2,h-10,4,20):r.context.fillRect(h-10,w-2,20,4),r.context.shadowColor="rgba(0, 0, 0, 1.0)",r.orientation==="horizontal"?r.context.fillText(`${k}`,w,h-10):r.context.fillText(`${k}`,h-15,w);for(let C=1;C<u;C++){let T=y((d+C/u)*l);const P=e(T);r.context.shadowColor="transparent",r.orientation==="horizontal"?r.context.fillRect(P-1,h-10,2,10):r.context.fillRect(h-10,P-1,10,2)}}}const X=5e-5;class Y{constructor(e){s(this,"container");s(this,"scene");s(this,"camera");s(this,"renderer");s(this,"cleanUpTasks");s(this,"animationRequestID",null);s(this,"lastTime",null);s(this,"isStopped",!1);s(this,"mandelbrotScene");s(this,"mandelbrotStage");s(this,"juliaScene");s(this,"juliaStage");s(this,"showJulia",!0);s(this,"mandelbrotMode","basic");s(this,"shader",null);s(this,"z0",[-.74993,.02667]);s(this,"zoomCenter",[-.5,0]);s(this,"zoomScale",1);s(this,"overlayCanvas");this.container=e,this.cleanUpTasks=[],this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.overlayCanvas=document.createElement("canvas"),this.overlayCanvas.style.position="absolute",this.overlayCanvas.style.top="0",this.overlayCanvas.style.left="0",this.overlayCanvas.style.width="100%",this.overlayCanvas.style.height="100%",this.overlayCanvas.style.pointerEvents="none",e.appendChild(this.overlayCanvas),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.mandelbrotScene=new V(e),this.resetMandelbrotStage(),this.juliaScene=new L(e),this.resetJuliaStage(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){var c,l;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1));const{clientWidth:e,clientHeight:t}=this.container;this.overlayCanvas.width=e,this.overlayCanvas.height=t,this.renderer.setSize(e,t),console.log(`Resize! (${e}, ${t})`);const n=e/t,[o,i]=[n>1.5?n:1.5,n>1.5?1:1.5/n];this.camera instanceof b&&(this.camera.top=i,this.camera.bottom=-i,this.camera.left=-o,this.camera.right=o,this.camera.updateProjectionMatrix()),this.shader.uniforms.resolution.value=this.getResolution(),(c=this.mandelbrotScene)==null||c.resize(),this.resetMandelbrotStage(),(l=this.juliaScene)==null||l.resize(),this.resetJuliaStage()}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new x;this.shader=new m({uniforms:{accumulatorMap1:{value:null},accumulatorMap2:{value:null},resolution:{value:null},showJulia:{value:null},showMandelbrot:{value:null},time:{value:0}},vertexShader:f,fragmentShader:_});const t=new g(2,2),n=new p(t,this.shader);return e.add(n),e}setupCamera(){const e=new b(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new A(e,t)}saveAsImage(e){const n=this.renderer.domElement.toDataURL("image/png"),o=document.createElement("a");o.href=n,o.download=e+".png",document.body.appendChild(o),o.click(),document.body.removeChild(o)}resetMandelbrotStage(){this.mandelbrotStage=0,this.progressMandelbrotStage()}resetJuliaStage(){this.juliaStage=0,this.progressJuliaStage()}progressMandelbrotStage(){if(this.mandelbrotStage>=3)return;const e={zoomCenter:this.zoomCenter,zoomScale:this.zoomScale,iterations:[1,16,64][this.mandelbrotStage],samplesPerAxis:[1,1,7][this.mandelbrotStage]};this.mandelbrotScene.assignWork(e),this.mandelbrotStage++}progressJuliaStage(){if(this.juliaStage>=3)return;const e={c:this.z0,zoomScale:this.zoomScale,iterations:[1,16,64][this.juliaStage],samplesPerAxis:[1,1,7][this.juliaStage]};this.juliaScene.assignWork(e),this.juliaStage++}pointerInput(e,t,n,o){const i=this.getResolution(),c=i.x/i.y,[l,u]=[c>1.5?c:1.5,c>1.5?1:1.5/c];this.zoomCenter=[this.zoomCenter[0]-this.zoomScale*2*l*e/i.x,this.zoomCenter[1]+this.zoomScale*2*u*t/i.y],this.zoomScale=Math.max(this.zoomScale*n,X),this.resetMandelbrotStage()}pointerMove(e,t){const n=this.getResolution(),o=n.x/n.y,[i,c]=[o>1.5?o:1.5,o>1.5?1:1.5/o],l=[i*(e/n.x-.5),c*(t/n.y-.5)];this.z0=[this.zoomCenter[0]+2*this.zoomScale*l[0],this.zoomCenter[1]-2*this.zoomScale*l[1]],this.resetJuliaStage()}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.01);this.lastTime=t,this.mandelbrotMode!=="off"&&this.mandelbrotScene.step(this.renderer)&&this.progressMandelbrotStage(),this.showJulia&&this.juliaScene.step(this.renderer)&&this.progressJuliaStage(),this.shader.uniforms.accumulatorMap1.value=this.mandelbrotScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.accumulatorMap2.value=this.juliaScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.showJulia.value=this.showJulia?1:0,this.shader.uniforms.showMandelbrot.value=this.mandelbrotMode==="off"?0:1,this.renderer.render(this.scene,this.camera);const n=this.overlayCanvas.getContext("2d");if(n){const o=this.getResolution();n.clearRect(0,0,o.x,o.y),this.mandelbrotMode!=="off"&&(F({context:n,width:o.x,height:o.y,tMin:this.mandelbrotScene.box[0],tMax:this.mandelbrotScene.box[2],orientation:"horizontal",color:this.showJulia?"rgba(100, 100, 100, 1.0)":"white"}),F({context:n,width:o.x,height:o.y,tMin:this.mandelbrotScene.box[1],tMax:this.mandelbrotScene.box[3],orientation:"vertical",color:this.showJulia?"rgba(100, 100, 100, 1.0)":"white"})),this.showJulia&&(n.strokeStyle="white",n.fillStyle="white",n.font="12px Arial",n.textAlign="right",n.textBaseline="top",n.fillText(`Julia z0 = (${y(this.z0[0])}, ${y(this.z0[1])})`,o.x-50,10))}}}const ee=({mandelbrotMode:r,setMandelbrotMode:e,showJulia:t,setShowJulia:n})=>{const o=M.useRef(null),i=M.useRef(null),c=()=>{i.current&&(i.current.mandelbrotMode!==r&&r!=="off"&&(i.current.mandelbrotScene.switchMode(),i.current.resetMandelbrotStage()),i.current.mandelbrotMode=r)};return M.useEffect(()=>{i.current&&(c(),i.current.showJulia=t)},[t,r]),M.useEffect(()=>{console.log("useEffect: ",o.current);const l=new Y(o.current);i.current=l;const u=new W(o.current,{mouse:{drag:a=>{(a.buttons&2||a.buttons&4)&&l.pointerInput(a.dx,a.dy,1,0),a.buttons&1&&l.pointerMove(a.x,a.y)},down:a=>a.button===0&&l.pointerMove(a.x,a.y)},touch:{start:a=>l.pointerMove(a.x,a.y),dragSingle:a=>l.pointerMove(a.x,a.y),dragPair:a=>l.pointerInput(a.dx,a.dy,a.scale,a.angle)},wheel:{zoom:a=>l.pointerInput(0,0,1+.001*a.delta,0),pan:a=>l.pointerInput(a.dx,a.dy,1,0)},safariGesture:{change:a=>l.pointerInput(0,0,a.scale,a.angle)},keyboard:{keydown:a=>{a.key.toUpperCase()==="J"&&n(v=>!v),a.key.toUpperCase()==="M"&&e(v=>v==="off"?"basic":v==="basic"?"DEM/M":"off"),a.key==="-"&&l.pointerInput(0,0,1.2,0),a.key==="+"&&l.pointerInput(0,0,1/1.2,0)}}});return()=>{l.cleanUp(),u.cleanup()}},[]),B.jsx("div",{ref:o,style:{width:"100%",height:"100%"}})};export{ee as default};
