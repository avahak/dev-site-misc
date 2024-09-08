import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current)
            return;
        // Create a basic scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        const controls = new OrbitControls(camera, containerRef.current!);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        let requestID: number|null = null;
        let lastTime: number|null = null;

        // Append renderer to the DOM
        containerRef.current!.appendChild(renderer.domElement);

        // Add a basic cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshMatcapMaterial();
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const light = new THREE.PointLight(0xffffff, 200, 0);
        light.position.set(0, 50, 0);
        scene.add(new THREE.AmbientLight(0xddeeff, 0.8));
        scene.add(light);

        camera.position.set(2, 3, 5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Resize handler
        const resizeRenderer = () => {
            if (!containerRef?.current)
                return;
            const { clientWidth, clientHeight } = containerRef.current;
            renderer.setSize(clientWidth, clientHeight);
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
        };
        // Initial resize
        resizeRenderer();

        // Create a ResizeObserver to monitor the container's size
        const resizeObserver = new ResizeObserver(() => {
            resizeRenderer();
        });
        resizeObserver.observe(containerRef.current!);

        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);

        // Animation loop
        const animate = () => {
            requestID = requestAnimationFrame(animate);

            const currentTime = performance.now();
            const dt = lastTime ? Math.max(Math.min((currentTime-lastTime)/1000, 0.1), 0.0) : 0;
            lastTime = currentTime;

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup on unmount
        return () => {
            if (containerRef.current)
                resizeObserver.unobserve(containerRef.current);
            containerRef.current?.removeChild(renderer.domElement);
            controls.dispose();
            if (requestID)
                cancelAnimationFrame(requestID);
            // Should dispose a lot more here: 
            // https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeScene;
