"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import vertexShader from "./vert.glsl";
import fragmentShader from "./frag.glsl";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Canvas } from "@/components/sketches/canvas";

const visibleHeightAtZDepth = (
  depth: number,
  camera: THREE.PerspectiveCamera
) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (
  depth: number,
  camera: THREE.PerspectiveCamera
) => {
  const height = visibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
};

const Sketch = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rawPallete = ["#e8f8ff", "#edeafa", "#edf6ff", "#e0fcf3", "#ffdce1"];
  const pallete = rawPallete.map((color) => new THREE.Color(color));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get parent element dimensions instead of canvas rect
    const parent = canvas.parentElement;
    if (!parent) return;
    
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    
    const FOV = 50;
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 500);
    camera.position.set(0, 0, 1);

    const clock = new THREE.Clock();

    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true // Optional: adds smoother edges
    });
    renderer.setSize(width, height, false); // false prevents setting canvas style
    renderer.setClearColor(0xffffff);
    // Initialize OrbitControls
    const devMode = process.env.NODE_ENV === "development";
    if (devMode) {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
    }

    const planeScalar = 1.8;
    const planeWidth = visibleWidthAtZDepth(0.0, camera) * planeScalar;

    const geometry = new THREE.PlaneGeometry(planeWidth, planeWidth, 400, 400);
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

    const scene = new THREE.Scene();
    scene.add(plane);
    camera.lookAt(plane.position);

    const handleResize = () => {
        if (!canvas || !canvas.parentElement) return;
        const width = canvas.parentElement.clientWidth;
        const height = canvas.parentElement.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      material.uniforms.time.value += (deltaTime / 10) * Math.random();
      renderer.render(scene, camera);
    };

    animate();

    return () => renderer.dispose();
  }, [pallete]);

  return <Canvas ref={canvasRef} />;
};

export default Sketch;
