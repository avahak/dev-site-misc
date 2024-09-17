import { HashRouter, Routes, Route } from 'react-router-dom';
import { App as DzhanibekovApp } from './dzhanibekov/App.tsx';
import { App as ParticlesApp } from './particles/App.tsx';
import { App as GeoApp } from './geo/App.tsx';
import { App as ClassTemplateApp } from './template_three_class/App.tsx';
import { App as ReactTemplateApp } from './template_three_react/App.tsx';
import { FrontPage } from './FrontPage.tsx';

const AppRouter = () => {
    return (<>
        <HashRouter>
            <Routes>
                <Route path="/dzhanibekov" element={<DzhanibekovApp />} />
                <Route path="/particles" element={<ParticlesApp />} />
                <Route path="/geo" element={<GeoApp />} />
                <Route path="/template_class" element={<ClassTemplateApp />} />
                <Route path="/template_react" element={<ReactTemplateApp />} />
                <Route path="/" element={<FrontPage />} />
            </Routes>
        </HashRouter>
    </>);
}

export { AppRouter };