import{r as m,j as f}from"./index-GvIz0RE-.js";import{l as b,m as v,O as x,W as g,p as C,r as A,f as E,n as M,A as j,V as z}from"./OrbitControls-CihZXVym.js";const y=()=>{const e=m.useRef(null);return m.useEffect(()=>{if(!e.current)return;const s=new b,t=new v(60,1,.1,1e3),d=new x(t,e.current),r=new g({antialias:!0,alpha:!0});r.setClearColor(0,0);let o=null;e.current.appendChild(r.domElement);const p=new C(1,1,1),h=new A,w=new E(p,h);s.add(w);const a=new M(16777215,200,0);a.position.set(0,50,0),s.add(new j(14544639,.8)),s.add(a),t.position.set(1,1,1.5),t.lookAt(new z(0,0,0));const i=()=>{if(!(e!=null&&e.current))return;const{clientWidth:n,clientHeight:l}=e.current;r.setSize(n,l),t.aspect=n/l,t.updateProjectionMatrix()},c=new ResizeObserver(()=>{i()});c.observe(e.current),i();const u=()=>{o=requestAnimationFrame(u),performance.now(),r.render(s,t)};return u(),()=>{var n;e.current&&c.unobserve(e.current),(n=e.current)==null||n.removeChild(r.domElement),d.dispose(),o&&cancelAnimationFrame(o)}},[]),f.jsx("div",{ref:e,style:{width:"100%",height:"100%"}})};export{y as default};