import { Box } from "@mui/material";
import { Settings } from "../geoTypes";
import { ProjectionSelector } from "./ProjectionSelector";

const SettingsComponent: React.FC<{ settings: Settings, setSettings: (s: Settings) => void, onDismiss: () => void }> = ({ settings, setSettings, onDismiss }) => {
    // const componentRef = useRef<HTMLDivElement>(null);
    // useEffect(() => {
    //     // Check if clicked outside. MUI adds temporary blocking items outside root 
    //     // (Select MenuItem) so ignore anything outside root.
    //     const handleClickOutside = (event: MouseEvent) => {
    //         const target = event.target as Node;
    //         const rootElement = document.getElementById('root');
    //         if (!componentRef.current || !rootElement || !rootElement.contains(target))
    //             return;
    //         if (!componentRef.current.contains(target))
    //             onDismiss();
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [onDismiss]);

    return (
        <Box /*ref={componentRef}*/ sx={{ maxWidth: "300px" }}>
            <ProjectionSelector projectionType={settings.projectionType} setProjectionType={(pt) => setSettings({ ...settings, projectionType: pt })} />            
        </Box>
    );
};

export { SettingsComponent };