import { HashRouter, Routes, Route } from 'react-router-dom';
import { App as DzhanibekovApp } from './dzhanibekov/App.tsx';
import { App as ParticlesApp } from './particles/App.tsx';
import { App as SlimeMoldApp } from './slime_mold/App.tsx';
import { App as GeoApp } from './geo/App.tsx';
import { App as GeoParticlesApp } from './geo_particles/App.tsx';
import { App as RegionJsonApp } from './region_json/App.tsx';
import { App as FractalApp } from './fractals/App.tsx';
import { App as ClassTemplateApp } from './template_class/App.tsx';
import { App as WebGLApp } from './webgl_tools/App.tsx';
import { App as InputListenerApp } from './input_listener/App.tsx';
import { FrontPage } from './FrontPage.tsx';

const AppRouter = () => {
    return (<>
        <HashRouter>
            <Routes>
                <Route path="/dzhanibekov" element={<DzhanibekovApp />} />
                <Route path="/particles" element={<ParticlesApp />} />
                <Route path="/slime_mold" element={<SlimeMoldApp />} />
                <Route path="/geo" element={<GeoApp />} />
                <Route path="/geo_particles" element={<GeoParticlesApp />} />
                <Route path="/region_json" element={<RegionJsonApp />} />
                <Route path="/fractals" element={<FractalApp />} />
                <Route path="/template_class" element={<ClassTemplateApp />} />
                <Route path="/webgl_tools" element={<WebGLApp />} />
                <Route path="/input_listener" element={<InputListenerApp />} />
                <Route path="/" element={<FrontPage />} />
            </Routes>
        </HashRouter>
    </>);
}

export { AppRouter };