import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{a as r,i,o as a,r as o,t as s}from"./index-DsO_YNlD.js";import{Dr as c,Gr as l,It as u,Lt as d,Qt as f,U as p,Wr as m,Y as h,Yn as g,Zt as _,_t as v,en as y,fr as b,g as x,ht as S,lr as C,m as w,pr as T,r as E,v as D}from"./three.module-BwKQCz75.js";import{t as O}from"./lil-gui.module.min-Bwy4mqGm.js";import{t as k}from"./OrbitControls-Chp7DgHa.js";import{n as A,r as j,t as M}from"./hyperbolic-z5e7k9-Z.js";import{t as N}from"./groupAlgebra-DFdr-Jdl.js";var P=e(t(),1),F=class{constructor(e){this.cleanUpTasks=[],this.timer=new c,this.containerSize=new m(0,0),this.raycaster=new g,this.mouse=new m(-10,-10),this.deltaK=[],this.generators=[],this.exploredSubgroup=[],this.edgeClasses=[],this.params={preset:`6,4`,maxRadius:.9,depthL:3,showTestSegment:!0},this.testPoint1={x:-.25,y:.15},this.testPoint2={x:.25,y:-.15},this.draggingPoint=null,this.isDragging=!1,this.dragJustEnded=!1,this.diskBoundaryGroup=new h,this.tessellationGroup=new h,this.polygonOrbitGroup=new h,this.basePolygonGroup=new h,this.hoverHighlightGroup=new h,this.testSegmentGroup=new h,this.interactiveMeshes=[],this.hoveredMesh=null,this.container=e,this.isInitialized=!1,_.DEFAULT_UP.set(0,0,1)}async init(e){if(this.renderer=new E({antialias:!0,alpha:!0}),this.renderer.setClearColor(1118481,1),this.container.appendChild(this.renderer.domElement),this.triangleGroup=new N(6,4),this.setupCamera(),this.setupScene(),this.setupEvents(),this.createGUI(),this.isInitialized=!0,e.aborted){this.dispose();return}this.animate=this.animate.bind(this),this.renderer.setAnimationLoop(this.animate)}dispose(){if(this.isInitialized){this.renderer.setAnimationLoop(null),this.renderer.domElement.parentElement===this.container&&this.container.removeChild(this.renderer.domElement);for(let e of this.cleanUpTasks)e();this.controls.dispose(),this.timer.dispose(),this.gui&&this.gui.destroy(),this.renderer.dispose()}}handleResize(){let e=this.container.clientWidth,t=this.container.clientHeight;if(e<=0||t<=0||this.containerSize.x===e&&this.containerSize.y===t)return;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.containerSize.set(e,t),this.renderer.setSize(e,t);let n=e/t,r=2.4;this.camera.left=-r*n/2,this.camera.right=r*n/2,this.camera.top=r/2,this.camera.bottom=-r/2,this.camera.updateProjectionMatrix()}createGUI(){this.gui=new O,this.gui.add(this.params,`preset`,[`5,4`,`5,5`,`6,4`,`6,6`,`7,3`,`8,3`,`8,4`,`10,3`]).name(`Preset {p,q}`).onChange(()=>{let[e,t]=this.params.preset.split(`,`).map(Number);this.triangleGroup=new N(e,t),this.onParamsChange&&this.onParamsChange(this.params)}),this.gui.add(this.params,`maxRadius`,.7,.99,.005).name(`Max Radius`).onChange(()=>{this.onParamsChange&&this.onParamsChange(this.params)}),this.gui.add(this.params,`depthL`,1,10,1).name(`H Depth`).onChange(()=>{this.onParamsChange&&this.onParamsChange(this.params)}),this.gui.add(this.params,`showTestSegment`).name(`Show Test Segment`).onChange(()=>{this.rebuildTestSegment()})}setupCamera(){let e=(this.container.clientWidth||1)/(this.container.clientHeight||1),t=2.4;this.camera=new f(-t*e/2,t*e/2,t/2,-t/2,.1,100),this.camera.position.set(0,0,10),this.camera.lookAt(0,0,0),this.controls=new k(this.camera,this.renderer.domElement),this.controls.enableRotate=!1,this.controls.enableZoom=!0}setupScene(){this.scene=new C,this.scene.add(this.diskBoundaryGroup),this.scene.add(this.tessellationGroup),this.scene.add(this.polygonOrbitGroup),this.scene.add(this.basePolygonGroup),this.scene.add(this.hoverHighlightGroup),this.scene.add(this.testSegmentGroup),this.drawDiskBoundary()}drawDiskBoundary(){let e=new w,t=[];for(let e=0;e<=128;e++){let n=e/128*Math.PI*2;t.push(new l(Math.cos(n),Math.sin(n),0))}e.setFromPoints(t);let n=new v({color:5592405}),r=new S(e,n);r.renderOrder=1,this.diskBoundaryGroup.add(r),this.cleanUpTasks.push(()=>{e.dispose(),n.dispose()})}updateDeltaK(e,t=[]){this.deltaK=e,this.generators=t,this.rebuildTessellation()}updateExploredOrbit(e,t){this.exploredSubgroup=e,this.edgeClasses=t,this.rebuildTessellation(),this.rebuildOrbitAndBasePolygon(),this.rebuildTestSegment()}getTransformedTriangle(e,t){let[n,r,i]=this.triangleGroup.baseTriangleVertices,a=(n,r,i=16)=>A.getGeodesicPoints(n,r,i).map(n=>{let r=j.apply(e,{re:n.x,im:n.y});return new l(r.re,r.im,t)}),o=a(n,r,16),s=a(r,i,16).slice(1),c=a(i,n,16).slice(1);return[...o,...s,...c]}rebuildTessellation(){for(;this.tessellationGroup.children.length>0;){let e=this.tessellationGroup.children.pop();(e instanceof u||e instanceof S)&&(e.geometry.dispose(),e.material.dispose())}this.interactiveMeshes=[];for(let e of this.deltaK){let t=this.generators.some(t=>t.id===e.id||j.distance(t.matrix,e.matrix)<1e-4),n=!t&&this.exploredSubgroup.some(t=>j.distance(t.matrix,e.matrix)<1e-4),r=t?.03:n?.02:.01,i=t?20:n?15:10,a=this.getTransformedTriangle(e.matrix,r),o=new b;o.moveTo(a[0].x,a[0].y);for(let e=1;e<a.length;e++)o.lineTo(a[e].x,a[e].y);let s=1713455,c=.3,l=2899536;t?(s=2600544,c=.7,l=3066993):n&&(s=2719929,c=.6,l=6139362);let f=new u(new T(o),new d({color:s,transparent:!0,opacity:c,side:2,depthTest:!0,depthWrite:!1}));f.position.z=r,f.renderOrder=i,this.tessellationGroup.add(f),this.interactiveMeshes.push({mesh:f,element:e});let p=new S(new w().setFromPoints(a),new v({color:l,transparent:!0,opacity:c+.2,depthTest:!0,depthWrite:!1}));p.position.z=r,p.renderOrder=i+1,this.tessellationGroup.add(p)}}rebuildOrbitAndBasePolygon(){for(;this.polygonOrbitGroup.children.length>0;){let e=this.polygonOrbitGroup.children.pop();(e instanceof u||e instanceof S)&&(e.geometry.dispose(),e.material.dispose())}for(;this.basePolygonGroup.children.length>0;){let e=this.basePolygonGroup.children.pop();(e instanceof u||e instanceof S)&&(e.geometry.dispose(),e.material.dispose())}let e=this.triangleGroup.basePolygonVertices;for(let t of this.exploredSubgroup){let n=e.map(e=>{let n=j.apply(t.matrix,{re:e.x,im:e.y});return{x:n.re,y:n.im}}),r=[];for(let e=0;e<n.length;e++){let t=n[e],i=n[(e+1)%n.length],a=A.getGeodesicPoints(t,i,12);r.push(...a.map(e=>new l(e.x,e.y,.04)))}let i=new S(new w().setFromPoints(r),new v({color:4886754,transparent:!0,opacity:.6,depthTest:!0,depthWrite:!1}));i.renderOrder=30,this.polygonOrbitGroup.add(i)}let t=.008;for(let n=0;n<e.length;n++){let r=e[n],i=e[(n+1)%e.length],a=A.getGeodesicPoints(r,i,16),o=`#ffffff`;for(let e of this.edgeClasses)if(e.edgeIndices.includes(n)){o=e.color;break}let s=[],c=[];for(let e=0;e<a.length-1;e++){let n=a[e],r=a[e+1],i=r.x-n.x,o=r.y-n.y,l=Math.sqrt(i*i+o*o)||1,u=-o/l*t,d=i/l*t,f=s.length/3;s.push(n.x+u,n.y+d,.05,n.x-u,n.y-d,.05,r.x+u,r.y+d,.05,r.x-u,r.y-d,.05),c.push(f,f+1,f+2,f+1,f+3,f+2)}let l=new w;l.setAttribute(`position`,new p(s,3)),l.setIndex(c);let f=new u(l,new d({color:new D(o),side:2,depthTest:!0,depthWrite:!1}));f.renderOrder=40,this.basePolygonGroup.add(f)}}rebuildTestSegment(){for(;this.testSegmentGroup.children.length>0;){let e=this.testSegmentGroup.children.pop();(e instanceof u||e instanceof S)&&(e.geometry.dispose(),e.material.dispose())}if(!this.params.showTestSegment)return;for(let e of this.exploredSubgroup){if(e.word.canonicalString===`1`)continue;let t=j.apply(e.matrix,{re:this.testPoint1.x,im:this.testPoint1.y}),n=j.apply(e.matrix,{re:this.testPoint2.x,im:this.testPoint2.y}),r={x:t.re,y:t.im},i={x:n.re,y:n.im},a=A.getGeodesicPoints(r,i,16),o=new S(new w().setFromPoints(a.map(e=>new l(e.x,e.y,.07))),new v({color:15105570,transparent:!0,opacity:.85,depthTest:!0,depthWrite:!1}));o.renderOrder=80,this.testSegmentGroup.add(o);let s=new u(new x(.018,16),new d({color:16724838,transparent:!0,opacity:.85,depthTest:!0,depthWrite:!1}));s.position.set(r.x,r.y,.075),s.renderOrder=85,this.testSegmentGroup.add(s);let c=new u(new x(.018,16),new d({color:58879,transparent:!0,opacity:.85,depthTest:!0,depthWrite:!1}));c.position.set(i.x,i.y,.075),c.renderOrder=85,this.testSegmentGroup.add(c)}let e=A.getGeodesicPoints(this.testPoint1,this.testPoint2,24),t=new S(new w().setFromPoints(e.map(e=>new l(e.x,e.y,.08))),new v({color:16766720,linewidth:4,transparent:!0,opacity:1,depthTest:!1,depthWrite:!1}));t.renderOrder=1e3,this.testSegmentGroup.add(t);let n=new u(new x(.04,24),new d({color:16724838,transparent:!0,opacity:1,depthTest:!1,depthWrite:!1}));n.position.set(this.testPoint1.x,this.testPoint1.y,.09),n.renderOrder=1001,this.testSegmentGroup.add(n);let r=new u(new x(.04,24),new d({color:58879,transparent:!0,opacity:1,depthTest:!1,depthWrite:!1}));r.position.set(this.testPoint2.x,this.testPoint2.y,.09),r.renderOrder=1001,this.testSegmentGroup.add(r)}highlightElement(e,t){for(;this.hoverHighlightGroup.children.length>0;){let e=this.hoverHighlightGroup.children.pop();e instanceof u&&e.material.dispose()}if(!e)return;let n;if(t)n=t;else{let t=this.getTransformedTriangle(e.matrix,.06),r=new b;r.moveTo(t[0].x,t[0].y);for(let e=1;e<t.length;e++)r.lineTo(t[e].x,t[e].y);n=new T(r)}let r=new d({color:15844367,transparent:!0,opacity:.8,side:2,depthTest:!0,depthWrite:!1}),i=new u(n,r);i.position.z=.06,i.renderOrder=50,this.hoverHighlightGroup.add(i)}setupEvents(){let e=new y(new l(0,0,1),0),t=new l,n=()=>(this.raycaster.setFromCamera(this.mouse,this.camera),this.raycaster.ray.intersectPlane(e,t)?{x:t.x,y:t.y}:null);window.addEventListener(`pointerdown`,()=>{if(!this.params.showTestSegment)return;let e=n();if(!e)return;let t=Math.hypot(e.x-this.testPoint1.x,e.y-this.testPoint1.y),r=Math.hypot(e.x-this.testPoint2.x,e.y-this.testPoint2.y),i=.09;t<i&&t<=r?(this.draggingPoint=1,this.isDragging=!1,this.controls.enabled=!1):r<i&&(this.draggingPoint=2,this.isDragging=!1,this.controls.enabled=!1)}),window.addEventListener(`pointermove`,e=>{let t=this.renderer.domElement.getBoundingClientRect();if(this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1,this.draggingPoint!==null){this.isDragging=!0;let e=n();if(e){let t=Math.hypot(e.x,e.y),n=.98,r=t>n?{x:e.x/t*n,y:e.y/t*n}:e;this.draggingPoint===1?this.testPoint1=r:this.draggingPoint===2&&(this.testPoint2=r),this.rebuildTestSegment()}}});let r=()=>{this.draggingPoint!==null&&(this.isDragging&&(this.dragJustEnded=!0,setTimeout(()=>{this.dragJustEnded=!1},50)),this.draggingPoint=null,this.isDragging=!1,this.controls.enabled=!0)};window.addEventListener(`pointerup`,r),window.addEventListener(`pointercancel`,r),window.addEventListener(`click`,()=>{if(this.dragJustEnded){this.dragJustEnded=!1;return}if(this.hoveredMesh){let e=this.interactiveMeshes.find(e=>e.mesh===this.hoveredMesh);e&&this.onElementSelect&&this.onElementSelect(e.element)}})}animate(){this.timer.update(),this.controls.update(),this.handleResize(),this.raycaster.setFromCamera(this.mouse,this.camera);let e=this.raycaster.intersectObjects(this.interactiveMeshes.map(e=>e.mesh));if(e.length>0){let t=e[0].object;if(this.hoveredMesh!==t){this.hoveredMesh=t;let e=this.interactiveMeshes.find(e=>e.mesh===t);e&&(this.highlightElement(e.element,t.geometry),this.onElementHover&&this.onElementHover(e.element))}}else this.hoveredMesh!==null&&(this.hoveredMesh=null,this.highlightElement(null),this.onElementHover&&this.onElementHover(null));this.render()}render(){this.renderer.render(this.scene,this.camera)}},I=class{constructor(e){this.deltaK=[],this.overlayEl=null,this.renderManager=new F(e),this.triangleGroup=new N(6,4),this.subgroupState={generators:[],explorationDepth:3,exploredElements:[],stabilizerElements:[],edgeClasses:[]}}async start(e){let t=new AbortController,n=e||t.signal;if(await this.renderManager.init(n),n.aborted){this.dispose();return}this.buildUIOverlay(),this.bindEvents(),this.deltaK=this.triangleGroup.generateDeltaK(this.renderManager.params.maxRadius),this.renderManager.updateDeltaK(this.deltaK,this.subgroupState.generators),this.recomputeSubgroup()}dispose(){this.overlayEl&&this.overlayEl.parentElement&&(this.overlayEl.parentElement.removeChild(this.overlayEl),this.overlayEl=null),this.renderManager.dispose()}buildUIOverlay(){let e=document.createElement(`div`);e.className=`app-overlay`,e.innerHTML=`
            <style>
                .app-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none; display: flex; justify-content: space-between;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
                    color: #eaeaea; box-sizing: border-box; padding: 12px; gap: 12px;
                }
                .panel {
                    width: 280px; height: calc(100% - 24px); max-height: 100%;
                    background: rgba(20, 20, 28, 0.88); backdrop-filter: blur(8px);
                    border: 1px solid #333; border-radius: 8px; padding: 12px;
                    pointer-events: auto; display: flex; flex-direction: column; gap: 8px;
                    box-sizing: border-box; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                }
                .panel h3 { margin: 0; font-size: 15px; color: #fff; border-bottom: 1px solid #333; padding-bottom: 6px; }
                .panel h4 { margin: 6px 0 2px 0; font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; }
                
                .scroll-area {
                    flex: 1; min-height: 60px; overflow-y: auto;
                    border: 1px solid #2a2a35; border-radius: 4px; padding: 6px;
                    background: rgba(10, 10, 15, 0.5);
                }
                .scroll-area::-webkit-scrollbar { width: 6px; }
                .scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                .scroll-area::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
                .scroll-area::-webkit-scrollbar-thumb:hover { background: #666; }

                .word-item {
                    cursor: pointer; padding: 4px 6px; margin: 2px 0; border-radius: 4px;
                    font-size: 12px; font-family: monospace; transition: all 0.15s;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .word-item:hover { background: #2c3e50; }
                .word-item.generator { background: #27ae60; font-weight: bold; color: #fff; }
                .word-item.explored { background: rgba(41, 128, 185, 0.25); border-left: 3px solid #5dade2; color: #aed6f1; }
                .word-dist { font-size: 10px; color: #888; margin-left: 6px; }

                .gen-item {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 3px 6px; margin: 2px 0; background: rgba(39, 174, 96, 0.2);
                    border: 1px solid #27ae60; border-radius: 4px; font-size: 12px;
                }
                .remove-gen-btn {
                    background: none; border: none; color: #e74c3c; cursor: pointer;
                    font-weight: bold; font-size: 14px; padding: 0 4px; border-radius: 3px;
                }
                .remove-gen-btn:hover { background: rgba(231, 76, 60, 0.3); }

                .btn {
                    background: #e74c3c; color: white; border: none; padding: 6px 12px;
                    border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px;
                    transition: background 0.2s; text-align: center; margin-top: 4px;
                }
                .btn:hover { background: #c0392b; }

                .edge-badge {
                    display: inline-block; padding: 2px 6px; margin: 2px;
                    border-radius: 3px; color: #fff; font-weight: bold; font-size: 11px;
                }
                .edge-class-row {
                    margin-bottom: 6px; padding: 4px 6px; background: rgba(255,255,255,0.03);
                    border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);
                }
            </style>
            
            <!-- Left Panel -->
            <div class="panel">
                <h3>Subgroup H</h3>
                <div>H = &langle; <span id="gen-text">1</span> &rangle;</div>
                <button id="reset-btn" class="btn">Reset H</button>
                
                <h4>Generators</h4>
                <div id="generator-list">None</div>

                <h4>&Delta;<sub>k</sub> Word Window</h4>
                <div class="scroll-area" id="word-list"></div>
            </div>

            <!-- Right Panel -->
            <div class="panel">
                <h3>Edge Partition & Stats</h3>
                <div id="stats-info"></div>

                <h4>Polygon Stabilizer H<sub>P</sub></h4>
                <div id="stabilizer-info">None</div>

                <h4>Oriented Edge Classes</h4>
                <div class="scroll-area" id="edge-classes"></div>
            </div>
        `,this.overlayEl=e,this.renderManager.container.appendChild(e),this.generatorListEl=e.querySelector(`#generator-list`),this.wordListEl=e.querySelector(`#word-list`),this.edgeClassEl=e.querySelector(`#edge-classes`),this.stabilizerEl=e.querySelector(`#stabilizer-info`),this.statsEl=e.querySelector(`#stats-info`),e.querySelector(`#reset-btn`).addEventListener(`click`,()=>{this.subgroupState.generators=[],this.recomputeSubgroup()})}bindEvents(){this.renderManager.onParamsChange=e=>{let[t,n]=e.preset.split(`,`).map(Number);(this.triangleGroup.p!==t||this.triangleGroup.q!==n)&&(this.triangleGroup=new N(t,n),this.subgroupState.generators=[]),this.subgroupState.explorationDepth=e.depthL,this.deltaK=this.triangleGroup.generateDeltaK(e.maxRadius),this.renderManager.updateDeltaK(this.deltaK,this.subgroupState.generators),this.recomputeSubgroup()},this.renderManager.onElementHover=e=>{this.wordListEl.querySelectorAll(`.word-item`).forEach(t=>{e&&t.getAttribute(`data-id`)===e.id?t.style.outline=`1px solid #f1c40f`:t.style.outline=`none`})},this.renderManager.onElementSelect=e=>{this.toggleGenerator(e)}}toggleGenerator(e){let t=this.subgroupState.generators.findIndex(t=>t.id===e.id);t>=0?this.subgroupState.generators.splice(t,1):this.subgroupState.generators.push(e),this.recomputeSubgroup()}recomputeSubgroup(){let{generators:e,explorationDepth:t}=this.subgroupState;this.subgroupState.exploredElements=this.triangleGroup.exploreSubgroup(e,t),this.subgroupState.stabilizerElements=this.triangleGroup.findBasePolygonStabilizer(this.subgroupState.exploredElements),this.subgroupState.edgeClasses=this.triangleGroup.computeEdgeClasses(this.triangleGroup.p,this.subgroupState.stabilizerElements),this.renderManager.updateDeltaK(this.deltaK,this.subgroupState.generators),this.renderManager.updateExploredOrbit(this.subgroupState.exploredElements,this.subgroupState.edgeClasses),this.updateUI()}updateUI(){if(!this.overlayEl)return;let e=this.subgroupState.generators.map(e=>e.word.canonicalString);document.querySelector(`#gen-text`).innerText=e.length>0?e.join(`, `):`1`,this.generatorListEl.innerHTML=this.subgroupState.generators.map((e,t)=>`
            <div class="gen-item">
                <span>h<sub>${t+1}</sub> = <b>${e.word.canonicalString}</b></span>
                <button class="remove-gen-btn" data-id="${e.id}">&times;</button>
            </div>
        `).join(``)||`<div style="color:#777;">None</div>`,this.generatorListEl.querySelectorAll(`.remove-gen-btn`).forEach(e=>{e.addEventListener(`click`,e=>{e.stopPropagation();let t=e.currentTarget.getAttribute(`data-id`),n=this.subgroupState.generators.find(e=>e.id===t);n&&this.toggleGenerator(n)})}),this.wordListEl.innerHTML=this.deltaK.map(e=>{let t=this.subgroupState.generators.some(t=>t.id===e.id),n=!t&&this.subgroupState.exploredElements.some(t=>j.distance(t.matrix,e.matrix)<1e-4),r=`word-item`;t?r+=` generator`:n&&(r+=` explored`);let i=M.abs(j.apply(e.matrix,{re:0,im:0})).toFixed(2);return`
                <div class="${r}" data-id="${e.id}">
                    <span>${e.word.canonicalString}</span>
                    <span class="word-dist">r=${i}</span>
                </div>
            `}).join(``),this.wordListEl.querySelectorAll(`.word-item`).forEach(e=>{e.addEventListener(`mouseenter`,()=>{let t=e.getAttribute(`data-id`),n=this.deltaK.find(e=>e.id===t);n&&this.renderManager.highlightElement(n)}),e.addEventListener(`mouseleave`,()=>{this.renderManager.highlightElement(null)}),e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-id`),n=this.deltaK.find(e=>e.id===t);n&&this.toggleGenerator(n)})}),this.stabilizerEl.innerHTML=`
            <div>Size: <b>${this.subgroupState.stabilizerElements.length}</b></div>
            <div>Elements: ${this.subgroupState.stabilizerElements.map(e=>e.word.canonicalString).join(`, `)}</div>
        `,this.edgeClassEl.innerHTML=this.subgroupState.edgeClasses.map(e=>`
            <div class="edge-class-row">
                <b>${e.id}:</b>
                ${e.edgeIndices.map(t=>`<span class="edge-badge" style="background:${e.color}">e<sub>${t}</sub></span>`).join(``)}
            </div>
        `).join(``),this.statsEl.innerHTML=`
            <div>Explored subgroup elements: <b>${this.subgroupState.exploredElements.length}</b></div>
            <div>Edge equivalence classes: <b>${this.subgroupState.edgeClasses.length}</b></div>
        `}},L=n(),R=()=>{let e=(0,P.useRef)(null);return(0,P.useEffect)(()=>{if(!e.current)return;let t=new AbortController,n=new I(e.current);return n.start(t.signal),()=>{t.abort(),n.dispose()}},[]),(0,L.jsx)(`div`,{ref:e,style:{position:`relative`,width:`100%`,height:`100%`,overflow:`hidden`}})},z=()=>(0,L.jsxs)(i,{maxWidth:`xl`,children:[(0,L.jsx)(r,{display:`flex`,justifyContent:`center`,sx:{py:2},children:(0,L.jsx)(a,{variant:`h2`,children:`Hyperbolic space`})}),(0,L.jsx)(r,{sx:{position:`relative`,width:`100%`,height:`600px`},children:(0,L.jsx)(R,{})}),(0,L.jsx)(o,{component:s,to:`/`,variant:`body1`,color:`primary`,children:`Back`})]});export{z as default};