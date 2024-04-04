import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { IcosahedronGeometry, Points, Object3D } from "three";
import { material } from "./material";

const options = {
    perlin: {
        vel: 0.002,
        speed: 0.0005,
        perlins: 3.0,
        decay: 0.1,
        complex: 0.1,
        waves: 60.0,
        eqcolor: 11.0,
        fragment: true,
        redhell: false,
    },
    spin: {
        sinVel: 0.0,
        ampVel: 80.0,
    },
};

const geometry = new IcosahedronGeometry(16, 90);
export const mesh = new Points(geometry, material);

const perlin = new Object3D();

perlin.add(mesh);

class Perlin {
    camera: THREE.PerspectiveCamera;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    perlinMesh: THREE.Object3D;
    start: number;

    constructor() {
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.set(10, 0, 100);

        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.MeshNormalMaterial();
        // this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene = new THREE.Scene();

        // this.scene.add(this.mesh);
        this.perlinMesh = perlin;
        this.scene.add(perlin);
        // perlin.position.set(50, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor("white");

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        window.addEventListener("resize", this.handleSizing, false);

        this.start = Date.now();
        this.perlinMesh.position.set(20, 0, 0);
        

        this.animate();
    }

    animate = () => {
        this.animatePerlin();
        this.animateMaterial();

        // this.camera.lookAt(this.scene.position);
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate);
    };

    animatePerlin = () => {
        const { sinVel, ampVel } = options.spin;
        const performance = Date.now() * 0.003;
        perlin.rotation.x +=
            (Math.sin(performance * sinVel) * ampVel * Math.PI) / 180;
        perlin.rotation.y += options.perlin.vel;
    };

    animateMaterial = () => {
        material.uniforms["time"].value =
            options.perlin.speed * (Date.now() - this.start);
        material.uniforms["pointscale"].value = options.perlin.perlins;
        material.uniforms["decay"].value = options.perlin.decay;
        material.uniforms["complex"].value = options.perlin.complex;
        material.uniforms["waves"].value = options.perlin.waves;
        material.uniforms["eqcolor"].value = options.perlin.eqcolor;
        material.uniforms["fragment"].value = options.perlin.fragment;
        material.uniforms["redhell"].value = options.perlin.redhell;
    };

    handleSizing = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };
}

export const PerlinCanvas = () => {
    const perlin = new Perlin();

    return (
        <div
            className="absolute inset-0 w-screen h-screen pointer-events-none -z-10"
            ref={ref => {
              if (ref){
                ref.appendChild(perlin.renderer.domElement);
                
              } 
            }}
        />
    );
};
