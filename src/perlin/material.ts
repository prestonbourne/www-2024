import { ShaderMaterial } from "three";
//@ts-ignore
import fragmentShader from "./shaders/fragment.glsl";
//@ts-ignore
import vertexShader from "./shaders/vertex.glsl";

export const material = new ShaderMaterial({
    wireframe: false,
    //fog: true,
    uniforms: {
        time: {
            value: 0.0,
        },
        pointscale: {
            value: 0.0,
        },
        decay: {
            value: 0.0,
        },
        complex: {
            value: 0.0,
        },
        waves: {
            value: 0.0,
        },
        eqcolor: {
            value: 0.0,
        },
        fragment: {
            value: true,
        },
        redhell: {
            value: true,
        },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});
