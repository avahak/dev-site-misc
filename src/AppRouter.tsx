import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
const DzhanibekovApp = React.lazy(() => import('./dzhanibekov/App.tsx'));
const ParticlesApp = React.lazy(() => import('./particles/App.tsx'));
const SlimeMoldApp = React.lazy(() => import('./slime_mold/App.tsx'));
const GeoApp = React.lazy(() => import('./geo/App.tsx'));
const GeoParticlesApp = React.lazy(() => import('./geo_particles/App.tsx'));
const RegionJsonApp = React.lazy(() => import('./region_json/App.tsx'));
const FractalApp = React.lazy(() => import('./fractals/App.tsx'));
const ClassTemplateApp = React.lazy(() => import('./template_class/App.tsx'));
const WebGLApp = React.lazy(() => import('./primitives/App.tsx'));
const InputListenerApp = React.lazy(() => import('./input_listener/App.tsx'));
const GraphApp = React.lazy(() => import('./graph/App.tsx'));
const SolidApp = React.lazy(() => import('./solid/App.tsx'));
const WebGPUParticlesApp = React.lazy(() => import('./webgpu_particles/App.tsx'));
const WebGPUMeshParticleApp = React.lazy(() => import('./webgpu_mesh_particle/App.tsx'));
const CollisionDetectionApp = React.lazy(() => import('./collision_detection/App.tsx'));
import { FrontPage } from './FrontPage.tsx';


const AppRouter = () => {
    return (<>
        <HashRouter>
            <Suspense
                fallback={
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100vw"
                    }}>
                        <h2>Loading page...</h2>
                    </div>
                }
            >
                <Routes>
                    <Route path="/dzhanibekov" element={<DzhanibekovApp />} />
                    <Route path="/particles" element={<ParticlesApp />} />
                    <Route path="/slime_mold" element={<SlimeMoldApp />} />
                    <Route path="/geo" element={<GeoApp />} />
                    <Route path="/geo_particles" element={<GeoParticlesApp />} />
                    <Route path="/region_json" element={<RegionJsonApp />} />
                    <Route path="/fractals" element={<FractalApp />} />
                    <Route path="/template_class" element={<ClassTemplateApp />} />
                    <Route path="/webgl_tools_text" element={<WebGLApp mode="text" />} />
                    <Route path="/webgl_tools_splines" element={<WebGLApp mode="splines" />} />
                    <Route path="/webgl_tools_fat_splines" element={<WebGLApp mode="fat_splines" />} />
                    <Route path="/webgl_tools_fat_splines2" element={<WebGLApp mode="fat_splines2" />} />
                    <Route path="/input_listener" element={<InputListenerApp />} />
                    <Route path="/graph" element={<GraphApp />} />
                    <Route path="/solid_test" element={<SolidApp solidTest={true} />} />
                    <Route path="/solid_viewer" element={<SolidApp solidTest={false} />} />
                    <Route path="/webgpu_particles" element={<WebGPUParticlesApp />} />
                    <Route path="/webgpu_mesh_particle" element={<WebGPUMeshParticleApp />} />
                    <Route path="/collision_detection" element={<CollisionDetectionApp />} />
                    <Route path="/" element={<FrontPage />} />
                </Routes>
            </Suspense>
        </HashRouter>
    </>);
}

export { AppRouter };