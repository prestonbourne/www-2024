"use client"
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@/components/sketches/Canvas";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getResizer, TWEAK_PANE_CONTAINER_ID } from "@/lib/sketches";
import vertexShader from "./waterVert.glsl";
import fragmentShader from "./waterFrag.glsl";
import { Pane } from "tweakpane";



const Sketch: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const renderer = new THREE.WebGLRenderer({ canvas });

            renderer.setSize(width, height);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                width / height,
                0.1,
                1000
            );
            camera.position.z = 5;
            camera.position.y = 5;
            camera.lookAt(0, 0, 0);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;

            const colors = {
                depthColor: "#186691",
                surfaceColor: "#9bd8ff",
                offset: .1,
                multiplier: 1.,
            };

            const smallWaves = {
                frequency: 1.5,
                speed: .2,
                elevation: .2,
            }

            const geometry = new THREE.PlaneGeometry(4, 4, 512, 512);
            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    uTime: { value: 0 },
                    uBigWavesElevation: { value: 0.2 },
                    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                    uBigWavesSpeed: { value: 0.75 },

                    uSmallWavesFrequency: { value: smallWaves.frequency },
                    uSmallWavesSpeed: { value: smallWaves.speed },
                    uSmallWavesElevation: { value: smallWaves.elevation },


                    uDepthColor: { value: new THREE.Color(colors.depthColor) },
                    uSurfaceColor: {
                        value: new THREE.Color(colors.surfaceColor),
                    },
                    uColorOffset: { value: colors.offset },
                    uColorMultiplier: { value: colors.multiplier },

                },
            });
            const container = document.getElementById(TWEAK_PANE_CONTAINER_ID) || undefined;
            const pane = new Pane({
                container,
            });

            const bigWavesFolder = pane.addFolder({
                title: "Big Waves",
            });

            bigWavesFolder.addBinding(material.uniforms.uBigWavesFrequency.value, "x", {
                min: 0,
                max: 10,
                label: "Big Wave Frequency X",
            });
            bigWavesFolder.addBinding(material.uniforms.uBigWavesFrequency.value, "y", {
                min: 0,
                max: 10,
                label: "Big Wave Frequency Y",
            });

            bigWavesFolder.addBinding(material.uniforms.uBigWavesElevation, "value", {
                min: 0,
                max: 1,
                label: "Big Wave Elevation",
            });

            bigWavesFolder.addBinding(material.uniforms.uBigWavesSpeed, "value", {
                min: 0,
                max: 3,
                label: "Big Wave Speed",
            });

            const colorsFolder = pane.addFolder({
                title: "Colors",
            });

            colorsFolder.addBinding(colors, "depthColor", {
                label: "Depth Color",
            }).on("change", e => {
             
                material.uniforms.uDepthColor.value.set(e.value);
                
            });
            colorsFolder.addBinding(colors, "surfaceColor", {
                label: "Surface Color",
            }).on("change", e => {
                material.uniforms.uSurfaceColor.value.set(e.value);
            });
            colorsFolder.addBinding(material.uniforms.uColorOffset, "value", {
                label: "Color Offset",
                max: 1,
                min: 0,
                step: 0.01,
            })
            colorsFolder.addBinding(material.uniforms.uColorMultiplier, "value", {
                label: "Color Multiplier",
                max: 5,
                min: 0,
                step: .01,
            });

            const smallWavesFolder = pane.addFolder({
                title: "Small Waves",
            })

            smallWavesFolder.addBinding(material.uniforms.uSmallWavesFrequency, "value", {
                label: "Small Wave Frequency",
                min: 0,
                max: 10,
            });
            smallWavesFolder.addBinding(material.uniforms.uSmallWavesSpeed, "value", {
                label: "Small Wave Speed",
                min: 0,
                max: 2,
            });
            smallWavesFolder.addBinding(material.uniforms.uSmallWavesElevation, "value", {
                label: "Small Wave Elevation",
                min: 0,
                max: 1,
            });

           

            const water = new THREE.Mesh(geometry, material);
            scene.add(water);
            water.rotation.x = -Math.PI / 2;
            water.rotation.z = Math.PI / 4;

            const clock = new THREE.Clock();

            let reqID: number;
            const animate = () => {
                reqID = requestAnimationFrame(animate);
                renderer.render(scene, camera);

                const elapsedTime = clock.getElapsedTime();
                material.uniforms.uTime.value = elapsedTime;
            };

            animate();
            const { handleResize } = getResizer(renderer, camera);
            window.addEventListener("resize", handleResize);
            return () => {
                window.cancelAnimationFrame(reqID);
                window.removeEventListener("resize", handleResize);
                pane.dispose();
            };
        }
    }, []);

    return <Canvas ref={canvasRef} />;
};

export default Sketch;