import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App as DzhanibekovApp } from './dzhanibekov/App.tsx';
import { App as ParticlesApp } from './particles/App.tsx';
import { FrontPage } from './FrontPage.tsx';

const AppRouter = () => {
    return (<>
        <BrowserRouter basename='/dev-site-misc'>
            <Routes>
                <Route path="/dzhanibekov" element={<DzhanibekovApp />} />
                <Route path="/particles" element={<ParticlesApp />} />
                <Route path="/" element={<FrontPage />} />
            </Routes>
        </BrowserRouter>
    </>);
}

export { AppRouter };