import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './dzhanibekov/App.tsx';
import { FrontPage } from './FrontPage.tsx';

const AppRouter = () => {
    return (<>
        <BrowserRouter basename='/dev-site-misc'>
            <Routes>
                <Route path="/dzhanibekov" element={<App />} />
                <Route path="/" element={<FrontPage />} />
            </Routes>
        </BrowserRouter>
    </>);
}

export { AppRouter };