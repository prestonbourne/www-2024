"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "@/shaders/vert.glsl";
import fragmentShader from "@/shaders/frag.glsl";

const visibleHeightAtZDepth = ( depth: number, camera: THREE.PerspectiveCamera ) => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;
  
    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180; 
  
    // Math.abs to ensure the result is always positive
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
  };

  const visibleWidthAtZDepth = ( depth: number, camera: THREE.PerspectiveCamera ) => {
    const height = visibleHeightAtZDepth( depth, camera );
    return height * camera.aspect;
  };

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const rawPallete = ["#a8e1f7","#f7cef4","#ffe8f8","#e0105c","#cb73ab"]
    const pallete = rawPallete.map(color => new THREE.Color(color));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        const width = canvas.parentElement!.clientWidth;
        const height = canvas.parentElement!.clientHeight;

        const FOV = 50;

        const camera = new THREE.PerspectiveCamera(
            FOV,
            width / height,
            0.1,
            500
        );
        camera.position.set(0, 0, 1);

        const clock = new THREE.Clock();

        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setClearColor(0xffffff);
        renderer.setSize(width, height);
        // Initialize OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // optional, but this gives a smoother camera movement
        controls.dampingFactor = 0.1;


        const planeWidth = visibleWidthAtZDepth(0.0, camera) * 1.8;
      


        const geometry = new THREE.PlaneGeometry(planeWidth, planeWidth, 600, 600);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uColor: { value: pallete },
                time: { value: 0.0 },
            },
        });
        const plane = new THREE.Mesh(geometry, material);


        scene.add(plane);

        const handleResize = () => {
            const width = canvas.parentElement!.clientWidth;
            const height = canvas.parentElement!.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        const animate = () => {
            requestAnimationFrame(animate);

            const deltaTime = clock.getDelta();
            material.uniforms.time.value += deltaTime / 50;
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
        };
    }, [pallete]);

    return (
        <canvas
            className="top-0 left-0 w-full h-full z-50 m-0 p-0"
            ref={canvasRef}
        ></canvas>
    );
};