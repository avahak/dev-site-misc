import React, { useEffect, useRef, useState } from 'react';
import { BaseScene } from './baseScene';
// import scandinaviaJson from '../../public/geo/scandinavia?raw';

const SceneComponent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scandinavia, setScandinavia] = useState<string>();

    const loadScandinaviaJson = async () => {
        console.log("loadData()");
        try {
            const response = await fetch(`/dev-site-misc/geo/scandinavia.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch JSON file');
            }
            const data = await response.json();
            setScandinavia(data);
        } catch (error) {
            console.error('Error loading JSON:', error);
        }
    };

    useEffect(() => {
        if (!scandinavia) {
            loadScandinaviaJson();
            return;
        }
        console.log("useEffect: ", containerRef.current);
        const scene = new BaseScene(containerRef.current!, scandinavia);
        return () => {
            scene.cleanUp();
        };
    }, [scandinavia]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default SceneComponent;
