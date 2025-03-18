var T=Object.defineProperty;var U=(n,e,t)=>e in n?T(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var i=(n,e,t)=>U(n,typeof e!="symbol"?e+"":e,t);import{q as x,x as I,N as k,R as C,t as J,u as D,l as y,v,w as M,i as z,V as R,X as O,Y as E,W as K,r as S,p as j}from"./index-D8oRi7ea.js";const g=`precision highp float;\r
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
    for (k = 0; (k < 1000) && (length(z) < 1.0e2); k++) {\r
        float temp = 2.0*z.x*z.y + c.y;\r
        z.x = z.x*z.x - z.y*z.y + c.x;\r
        z.y = temp;\r
    }\r
    iter = iter + float(k);\r
\r
    gl_FragColor = vec4(z, iter, 1.0);\r
}\r
`,B=`precision highp float;\r
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
}`,_=`precision highp float;\r
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
`,X=`precision highp float;\r
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
}`;class Y{constructor(e){i(this,"container");i(this,"camera");i(this,"fbosMandelbrot",[]);i(this,"fbosAccumulator",[]);i(this,"currentFboIndexMandelbrot",0);i(this,"currentFboIndexAccumulator",0);i(this,"disposeFbos");i(this,"sceneMandelbrot");i(this,"sceneAccumulator");i(this,"shaderMandelbrot");i(this,"shaderMandelbrot1");i(this,"shaderMandelbrot2");i(this,"shaderAccumulator");i(this,"shaderAccumulator1");i(this,"shaderAccumulator2");i(this,"meshMandelbrot");i(this,"meshAccumulator");i(this,"mandelbrotMode","basic");i(this,"workProgress",null);i(this,"box");this.container=e,this.setupMandelbrotScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosMandelbrot.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,r=e/t,[o,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.camera instanceof x&&(this.camera.top=s,this.camera.bottom=-s,this.camera.left=-o,this.camera.right=o,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderMandelbrot.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexMandelbrot=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosMandelbrot.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(){const{clientWidth:e,clientHeight:t}=this.container;return new I(e,t,{minFilter:k,magFilter:k,wrapS:C,wrapT:C,format:J,type:D})}setupMandelbrotScene(){this.sceneMandelbrot=new y,this.shaderMandelbrot1=new v({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:g,fragmentShader:W}),this.shaderMandelbrot2=new v({uniforms:{box:{value:null},subpixelOffset:{value:null},mandelMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:g,fragmentShader:_}),this.shaderMandelbrot=this.shaderMandelbrot1;const e=new M(2,2);this.meshMandelbrot=new z(e,this.shaderMandelbrot),this.sceneMandelbrot.add(this.meshMandelbrot)}setupAccumulatorScene(){this.sceneAccumulator=new y,this.shaderAccumulator1=new v({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},scale:{value:null},restart:{value:1}},vertexShader:g,fragmentShader:B}),this.shaderAccumulator2=new v({uniforms:{mandelMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},scale:{value:null},restart:{value:1}},vertexShader:g,fragmentShader:X}),this.shaderAccumulator=this.shaderAccumulator1;const e=new M(2,2);this.meshAccumulator=new z(e,this.shaderAccumulator),this.sceneAccumulator.add(this.meshAccumulator)}setupCamera(){this.camera=new x(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new R(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,r=e/t,[o,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.box=[this.workProgress.zoomCenter[0]-o*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]-s*this.workProgress.zoomScale,this.workProgress.zoomCenter[0]+o*this.workProgress.zoomScale,this.workProgress.zoomCenter[1]+s*this.workProgress.zoomScale],this.shaderMandelbrot.uniforms.box.value=this.box}switchMode(){this.mandelbrotMode==="basic"?(this.shaderAccumulator=this.shaderAccumulator2,this.shaderMandelbrot=this.shaderMandelbrot2):(this.shaderAccumulator=this.shaderAccumulator1,this.shaderMandelbrot=this.shaderMandelbrot1),this.mandelbrotMode=this.mandelbrotMode==="basic"?"DEM/M":"basic",this.meshMandelbrot.material=this.shaderMandelbrot,this.meshAccumulator.material=this.shaderAccumulator,this.resize()}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentMandelbrotFboTexture(){return this.fbosMandelbrot[this.currentFboIndexMandelbrot].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const o=Math.floor(t/2)*(t+1),s=(e*1579+o)%(t*t),l=s%t/t,a=Math.floor(s/t)/t;return[l+.5/t,a+.5/t]}iterateMandelbrot(e,t,r){const[o,s]=[this.currentFboIndexMandelbrot,(this.currentFboIndexMandelbrot+1)%2];this.shaderMandelbrot.uniforms.mandelMap.value=this.fbosMandelbrot[o].texture,this.shaderMandelbrot.uniforms.subpixelOffset.value=r,this.shaderMandelbrot.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosMandelbrot[s]),e.render(this.sceneMandelbrot,this.camera),e.setRenderTarget(null),this.currentFboIndexMandelbrot=s}accumulateSample(e,t){var s;const[r,o]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.mandelMap.value=this.getCurrentMandelbrotFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[r].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,this.shaderAccumulator.uniforms.scale.value=(s=this.workProgress)==null?void 0:s.zoomScale,e.setRenderTarget(this.fbosAccumulator[o]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=o}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateMandelbrot(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}const H=`precision highp float;\r
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
`,N=`// DEM/J algorithm, The Science of Fractal Images, p. 199\r
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
}`;class q{constructor(e){i(this,"container");i(this,"camera");i(this,"fbosJulia",[]);i(this,"fbosAccumulator",[]);i(this,"currentFboIndexJulia",0);i(this,"currentFboIndexAccumulator",0);i(this,"disposeFbos");i(this,"sceneJulia");i(this,"sceneAccumulator");i(this,"shaderJulia");i(this,"shaderAccumulator");i(this,"workProgress",null);this.container=e,this.setupJuliaScene(),this.setupAccumulatorScene(),this.setupCamera(),this.disposeFbos=()=>{this.fbosJulia.forEach(t=>t.dispose()),this.fbosAccumulator.forEach(t=>t.dispose())},this.resize()}resize(){const{clientWidth:e,clientHeight:t}=this.container,r=e/t,[o,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.camera instanceof x&&(this.camera.top=s,this.camera.bottom=-s,this.camera.left=-o,this.camera.right=o,this.camera.updateProjectionMatrix()),this.setupFbos(),this.shaderJulia.uniforms.resolution.value=this.getResolution(),this.shaderAccumulator.uniforms.resolution.value=this.getResolution(),this.setViewBoxUniforms()}setupFbos(){this.disposeFbos(),this.currentFboIndexJulia=0,this.currentFboIndexAccumulator=0;for(let e=0;e<2;e++)this.fbosJulia.push(this.createRenderTarget());for(let e=0;e<2;e++)this.fbosAccumulator.push(this.createRenderTarget())}createRenderTarget(e=4){const{clientWidth:t,clientHeight:r}=this.container;return new I(t,r,{minFilter:k,magFilter:k,wrapS:C,wrapT:C,format:[O,E,J][e],type:D})}setupJuliaScene(){this.sceneJulia=new y,this.shaderJulia=new v({uniforms:{box:{value:null},c:{value:null},subpixelOffset:{value:null},juliaMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:g,fragmentShader:H});const e=new M(2,2),t=new z(e,this.shaderJulia);this.sceneJulia.add(t)}setupAccumulatorScene(){this.sceneAccumulator=new y,this.shaderAccumulator=new v({uniforms:{juliaMap:{value:null},accumulatorMap:{value:null},resolution:{value:null},restart:{value:1}},vertexShader:g,fragmentShader:N});const e=new M(2,2),t=new z(e,this.shaderAccumulator);this.sceneAccumulator.add(t)}setupCamera(){this.camera=new x(-1,1,1,-1,.1,10),this.camera.position.set(0,0,1),this.camera.lookAt(0,0,0)}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new R(e,t)}setViewBoxUniforms(){if(!this.workProgress)return;const{clientWidth:e,clientHeight:t}=this.container,r=e/t,[o,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.shaderJulia.uniforms.box.value=[-o,-s,o,s]}assignWork(e){this.workProgress={...e,currentIteration:0,currentSample:0,isComplete:!1},this.setViewBoxUniforms()}getCurrentJuliaFboTexture(){return this.fbosJulia[this.currentFboIndexJulia].texture}getCurrentAccumulatorFboTexture(){return this.fbosAccumulator[this.currentFboIndexAccumulator].texture}getSubpixelOffset(e,t){const o=Math.floor(t/2)*(t+1),s=(e*1579+o)%(t*t),l=s%t/t,a=Math.floor(s/t)/t;return[l+.5/t,a+.5/t]}iterateJulia(e,t,r){var l;const[o,s]=[this.currentFboIndexJulia,(this.currentFboIndexJulia+1)%2];this.shaderJulia.uniforms.juliaMap.value=this.fbosJulia[o].texture,this.shaderJulia.uniforms.subpixelOffset.value=r,this.shaderJulia.uniforms.restart.value=t?1:0,this.shaderJulia.uniforms.c.value=(l=this.workProgress)==null?void 0:l.c,e.setRenderTarget(this.fbosJulia[s]),e.render(this.sceneJulia,this.camera),e.setRenderTarget(null),this.currentFboIndexJulia=s}accumulateSample(e,t){const[r,o]=[this.currentFboIndexAccumulator,(this.currentFboIndexAccumulator+1)%2];this.shaderAccumulator.uniforms.juliaMap.value=this.getCurrentJuliaFboTexture(),this.shaderAccumulator.uniforms.accumulatorMap.value=this.fbosAccumulator[r].texture,this.shaderAccumulator.uniforms.restart.value=t?1:0,e.setRenderTarget(this.fbosAccumulator[o]),e.render(this.sceneAccumulator,this.camera),e.setRenderTarget(null),this.currentFboIndexAccumulator=o}step(e){if(!this.workProgress||this.workProgress.isComplete)return!1;const t=this.getSubpixelOffset(this.workProgress.currentSample,this.workProgress.samplesPerAxis);return this.iterateJulia(e,this.workProgress.currentIteration===0,t),this.workProgress.currentIteration++,this.workProgress.currentIteration>=this.workProgress.iterations&&(this.accumulateSample(e,this.workProgress.currentSample===0),this.workProgress.currentIteration=0,this.workProgress.currentSample++),this.workProgress.currentSample>=this.workProgress.samplesPerAxis*this.workProgress.samplesPerAxis?(this.workProgress.isComplete=!0,!0):!1}}function A(n){return Math.round(n*1e12)/1e12}function F(n){n.context.strokeStyle=n.color,n.context.lineWidth=1,n.context.fillStyle=n.color,n.context.font="12px Arial",n.context.textAlign=n.orientation==="horizontal"?"center":"right",n.context.textBaseline=n.orientation==="horizontal"?"bottom":"middle",n.context.shadowColor="transparent",n.context.shadowBlur=3,n.context.shadowOffsetX=1,n.context.shadowOffsetY=1;const e=d=>n.orientation==="horizontal"?(d-n.tMin)/(n.tMax-n.tMin)*n.width:(n.tMax-d)/(n.tMax-n.tMin)*n.height,t=n.tMax-n.tMin,r=n.orientation==="horizontal"?t/n.width:t/n.height,o=Math.log10(r),s=Math.floor(o),l=Math.pow(10,s+3);let a=l,p=5;r/l<.005&&(a=l/2,p=5),r/l<.002&&(a=l/5,p=2);const h=Math.floor(n.tMin/a),u=Math.ceil(n.tMax/a),c=n.orientation==="horizontal"?n.height-20:n.width-20;n.orientation==="horizontal"?n.context.fillRect(0,c-1,n.width,2):n.context.fillRect(c-1,0,2,n.height);for(let d=h;d<=u;d++){let m=A(d*a),f=e(m);n.context.shadowColor="transparent",n.orientation==="horizontal"?n.context.fillRect(f-2,c-10,4,20):n.context.fillRect(c-10,f-2,20,4),n.context.shadowColor="rgba(0, 0, 0, 1.0)",n.orientation==="horizontal"?n.context.fillText(`${m}`,f,c-10):n.context.fillText(`${m}`,c-15,f);for(let b=1;b<p;b++){let P=A((d+b/p)*a);const w=e(P);n.context.shadowColor="transparent",n.orientation==="horizontal"?n.context.fillRect(w-1,c-10,2,10):n.context.fillRect(c-10,w-1,10,2)}}}const V=5e-5;class ${constructor(e){i(this,"container");i(this,"scene");i(this,"camera");i(this,"renderer");i(this,"cleanUpTasks");i(this,"animationRequestID",null);i(this,"lastTime",null);i(this,"isStopped",!1);i(this,"mandelbrotScene");i(this,"mandelbrotStage");i(this,"juliaScene");i(this,"juliaStage");i(this,"showJulia",!0);i(this,"mandelbrotMode","basic");i(this,"shader",null);i(this,"z0",[-.74993,.02667]);i(this,"zoomCenter",[-.5,0]);i(this,"zoomScale",1);i(this,"overlayCanvas");this.container=e,this.cleanUpTasks=[],this.renderer=new K({antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),e.appendChild(this.renderer.domElement),this.overlayCanvas=document.createElement("canvas"),this.overlayCanvas.style.position="absolute",this.overlayCanvas.style.top="0",this.overlayCanvas.style.left="0",this.overlayCanvas.style.width="100%",this.overlayCanvas.style.height="100%",this.overlayCanvas.style.pointerEvents="none",e.appendChild(this.overlayCanvas),this.renderer.getContext().getExtension("EXT_float_blend"),this.scene=this.setupScene(),this.camera=this.setupCamera(),this.mandelbrotScene=new Y(e),this.resetMandelbrotStage(),this.juliaScene=new q(e),this.resetJuliaStage(),this.setupResizeRenderer(),this.resizeRenderer(),this.cleanUpTasks.push(()=>{this.animationRequestID&&cancelAnimationFrame(this.animationRequestID)}),this.animate=this.animate.bind(this),this.animate()}resizeRenderer(){var l,a;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1));const{clientWidth:e,clientHeight:t}=this.container;this.overlayCanvas.width=e,this.overlayCanvas.height=t,this.renderer.setSize(e,t),console.log(`Resize! (${e}, ${t})`);const r=e/t,[o,s]=[r>1.5?r:1.5,r>1.5?1:1.5/r];this.camera instanceof x&&(this.camera.top=s,this.camera.bottom=-s,this.camera.left=-o,this.camera.right=o,this.camera.updateProjectionMatrix()),this.shader.uniforms.resolution.value=this.getResolution(),(l=this.mandelbrotScene)==null||l.resize(),this.resetMandelbrotStage(),(a=this.juliaScene)==null||a.resize(),this.resetJuliaStage()}setupResizeRenderer(){const e=new ResizeObserver(()=>{this.resizeRenderer()});e.observe(this.container),this.cleanUpTasks.push(()=>e.unobserve(this.container)),this.resizeRenderer()}cleanUp(){this.container.removeChild(this.renderer.domElement);for(const e of this.cleanUpTasks)e();this.renderer.dispose()}setupScene(){const e=new y;this.shader=new v({uniforms:{accumulatorMap1:{value:null},accumulatorMap2:{value:null},resolution:{value:null},showJulia:{value:null},showMandelbrot:{value:null},time:{value:0}},vertexShader:g,fragmentShader:L});const t=new M(2,2),r=new z(t,this.shader);return e.add(r),e}setupCamera(){const e=new x(-1,1,1,-1,.1,10);return e.position.set(0,0,1),e.lookAt(0,0,0),e}getResolution(){const{clientWidth:e,clientHeight:t}=this.container;return new R(e,t)}saveAsImage(e){const r=this.renderer.domElement.toDataURL("image/png"),o=document.createElement("a");o.href=r,o.download=e+".png",document.body.appendChild(o),o.click(),document.body.removeChild(o)}resetMandelbrotStage(){this.mandelbrotStage=0,this.progressMandelbrotStage()}resetJuliaStage(){this.juliaStage=0,this.progressJuliaStage()}progressMandelbrotStage(){if(this.mandelbrotStage>=3)return;const e={zoomCenter:this.zoomCenter,zoomScale:this.zoomScale,iterations:[1,16,64][this.mandelbrotStage],samplesPerAxis:[1,1,7][this.mandelbrotStage]};this.mandelbrotScene.assignWork(e),this.mandelbrotStage++}progressJuliaStage(){if(this.juliaStage>=3)return;const e={c:this.z0,zoomScale:this.zoomScale,iterations:[1,16,64][this.juliaStage],samplesPerAxis:[1,1,7][this.juliaStage]};this.juliaScene.assignWork(e),this.juliaStage++}pointerInput(e,t,r,o){const s=this.getResolution(),l=s.x/s.y,[a,p]=[l>1.5?l:1.5,l>1.5?1:1.5/l];this.zoomCenter=[this.zoomCenter[0]-this.zoomScale*2*a*e/s.x,this.zoomCenter[1]+this.zoomScale*2*p*t/s.y],this.zoomScale=Math.max(this.zoomScale*r,V),this.resetMandelbrotStage()}pointerMove(e,t){const r=this.getResolution(),o=r.x/r.y,[s,l]=[o>1.5?o:1.5,o>1.5?1:1.5/o],a=[s*(e/r.x-.5),l*(t/r.y-.5)];this.z0=[this.zoomCenter[0]+2*this.zoomScale*a[0],this.zoomCenter[1]-2*this.zoomScale*a[1]],this.resetJuliaStage()}animate(){this.animationRequestID=requestAnimationFrame(this.animate),this.animateStep(this.isStopped)}animateStep(e){const t=(this.lastTime??0)+(e?0:.01);this.lastTime=t,this.mandelbrotMode!=="off"&&this.mandelbrotScene.step(this.renderer)&&this.progressMandelbrotStage(),this.showJulia&&this.juliaScene.step(this.renderer)&&this.progressJuliaStage(),this.shader.uniforms.accumulatorMap1.value=this.mandelbrotScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.accumulatorMap2.value=this.juliaScene.getCurrentAccumulatorFboTexture(),this.shader.uniforms.showJulia.value=this.showJulia?1:0,this.shader.uniforms.showMandelbrot.value=this.mandelbrotMode==="off"?0:1,this.renderer.render(this.scene,this.camera);const r=this.overlayCanvas.getContext("2d");if(r){const o=this.getResolution();r.clearRect(0,0,o.x,o.y),this.mandelbrotMode!=="off"&&(F({context:r,width:o.x,height:o.y,tMin:this.mandelbrotScene.box[0],tMax:this.mandelbrotScene.box[2],orientation:"horizontal",color:this.showJulia?"rgba(100, 100, 100, 1.0)":"white"}),F({context:r,width:o.x,height:o.y,tMin:this.mandelbrotScene.box[1],tMax:this.mandelbrotScene.box[3],orientation:"vertical",color:this.showJulia?"rgba(100, 100, 100, 1.0)":"white"})),this.showJulia&&(r.strokeStyle="white",r.fillStyle="white",r.font="12px Arial",r.textAlign="right",r.textBaseline="top",r.fillText(`Julia z0 = (${A(this.z0[0])}, ${A(this.z0[1])})`,o.x-50,10))}}}function G(n,e,t){return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}class Q{constructor(e,t){i(this,"container");i(this,"mapper");i(this,"pointers",new Map);i(this,"lastDistance",null);i(this,"lastAngle",null);i(this,"lastMidpoint",null);i(this,"onContextmenu",e=>{e.preventDefault()});i(this,"onPointerDown",e=>{var r,o;e.preventDefault();const t=this.container.getBoundingClientRect();if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),e.pointerType==="mouse"&&((r=this.mapper.mouse)!=null&&r.down)?this.mapper.mouse.down(e.clientX-t.left,e.clientY-t.top,e.button):e.pointerType==="touch"&&this.pointers.size===1&&((o=this.mapper.touch)!=null&&o.start)&&this.mapper.touch.start(e.clientX-t.left,e.clientY-t.top),this.pointers.size===2&&e.pointerType==="touch"){const[s,l]=Array.from(this.pointers.values());this.lastDistance=this.getDistance(s,l),this.lastAngle=this.getAngle(s,l),this.lastMidpoint=this.getMidpoint(s,l)}});i(this,"onPointerMove",e=>{var l,a,p,h;e.preventDefault();const t=this.container.getBoundingClientRect();e.pointerType==="mouse"&&(l=this.mapper.mouse)!=null&&l.move&&this.mapper.mouse.move(e.clientX-t.left,e.clientY-t.top,G(t,e.clientX,e.clientY));const r=this.pointers.get(e.pointerId);if(!r)return;const o=e.clientX-r.x,s=e.clientY-r.y;if(e.pointerType==="mouse")(a=this.mapper.mouse)!=null&&a.drag&&this.mapper.mouse.drag(e.clientX-t.left,e.clientY-t.top,o,s,e.buttons);else if(e.pointerType==="touch"){if(this.pointers.size===1&&((p=this.mapper.touch)!=null&&p.dragSingle))this.mapper.touch.dragSingle(e.clientX-t.left,e.clientY-t.top,o,s);else if(this.pointers.size===2){const[u,c]=Array.from(this.pointers.values()),d=this.getDistance(u,c),m=this.getAngle(u,c),f=this.getMidpoint(u,c);if(this.lastDistance&&this.lastAngle&&this.lastMidpoint){const b=this.lastDistance/d,P=m-this.lastAngle,w={x:f.x-this.lastMidpoint.x,y:f.y-this.lastMidpoint.y};(h=this.mapper.touch)!=null&&h.dragPair&&this.mapper.touch.dragPair(f.x,f.y,w.x,w.y,b,P),this.lastDistance=d,this.lastAngle=m,this.lastMidpoint=f}}}this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY})});i(this,"onPointerUp",e=>{var r,o;e.preventDefault();const t=this.container.getBoundingClientRect();this.pointers.delete(e.pointerId),e.pointerType==="mouse"&&((r=this.mapper.mouse)!=null&&r.up)?this.mapper.mouse.up(e.clientX-t.left,e.clientY-t.top,e.button):e.pointerType==="touch"&&this.pointers.size===0&&((o=this.mapper.touch)!=null&&o.end)&&this.mapper.touch.end(e.clientX-t.left,e.clientY-t.top),this.pointers.size<2&&(this.lastDistance=null,this.lastAngle=null,this.lastMidpoint=null)});i(this,"onWheel",e=>{var r;e.preventDefault();const t=this.container.getBoundingClientRect();if((r=this.mapper.mouse)!=null&&r.wheel){const o=e.deltaY<0?.8333333333333334:1.2;this.mapper.mouse.wheel(e.clientX-t.left,e.clientY-t.top,o)}});i(this,"onKeydown",e=>{var t;(t=this.mapper.keyboard)!=null&&t.keydown&&this.mapper.keyboard.keydown({key:e.key,code:e.code,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,altKey:e.altKey,metaKey:e.metaKey})});i(this,"onKeyup",e=>{var t;(t=this.mapper.keyboard)!=null&&t.keyup&&this.mapper.keyboard.keyup({key:e.key,code:e.code,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,altKey:e.altKey,metaKey:e.metaKey})});this.container=e,this.mapper=t,this.container.style.touchAction="none",this.container.style.userSelect="none",this.container.addEventListener("pointerdown",this.onPointerDown),window.addEventListener("pointermove",this.onPointerMove),this.container.addEventListener("pointerup",this.onPointerUp),this.container.addEventListener("pointercancel",this.onPointerUp),this.container.addEventListener("wheel",this.onWheel),this.container.addEventListener("contextmenu",this.onContextmenu),document.addEventListener("keydown",this.onKeydown),document.addEventListener("keyup",this.onKeyup)}getDistance(e,t){const r=t.x-e.x,o=t.y-e.y;return Math.sqrt(r*r+o*o)}getAngle(e,t){return Math.atan2(t.y-e.y,t.x-e.x)}getMidpoint(e,t){return{x:(e.x+t.x)/2,y:(e.y+t.y)/2}}cleanup(){this.container.removeEventListener("pointerdown",this.onPointerDown),window.removeEventListener("pointermove",this.onPointerMove),this.container.removeEventListener("pointerup",this.onPointerUp),this.container.removeEventListener("pointercancel",this.onPointerUp),this.container.removeEventListener("wheel",this.onWheel),this.container.removeEventListener("contextmenu",this.onContextmenu),document.removeEventListener("keydown",this.onKeydown),document.removeEventListener("keyup",this.onKeyup)}}const te=({mandelbrotMode:n,setMandelbrotMode:e,showJulia:t,setShowJulia:r})=>{const o=S.useRef(null),s=S.useRef(null),l=()=>{s.current&&(s.current.mandelbrotMode!==n&&n!=="off"&&(s.current.mandelbrotScene.switchMode(),s.current.resetMandelbrotStage()),s.current.mandelbrotMode=n)};return S.useEffect(()=>{s.current&&(l(),s.current.showJulia=t)},[t,n]),S.useEffect(()=>{console.log("useEffect: ",o.current);const a=new $(o.current);s.current=a;const p=new Q(o.current,{mouse:{drag:(h,u,c,d,m)=>{(m&2||m&4)&&a.pointerInput(c,d,1,0),m&1&&a.pointerMove(h,u)},wheel:(h,u,c)=>a.pointerInput(0,0,c,0),down:(h,u,c)=>c===0&&a.pointerMove(h,u)},touch:{start:(h,u)=>a.pointerMove(h,u),dragSingle:(h,u,c,d)=>a.pointerMove(h,u),dragPair:(h,u,c,d,m,f)=>a.pointerInput(c,d,m,f)},keyboard:{keydown:h=>{h.key.toUpperCase()==="J"&&r(u=>!u),h.key.toUpperCase()==="M"&&e(u=>u==="off"?"basic":u==="basic"?"DEM/M":"off"),h.key==="-"&&a.pointerInput(0,0,1.2,0),h.key==="+"&&a.pointerInput(0,0,1/1.2,0)}}});return()=>{a.cleanUp(),p.cleanup()}},[]),j.jsx("div",{ref:o,style:{width:"100%",height:"100%"}})};export{te as default};
