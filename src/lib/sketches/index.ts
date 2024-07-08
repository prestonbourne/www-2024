import * as THREE from "three";

export const getResizer = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
) => {
  function handleResize() {
    const width = renderer.domElement.parentElement!.clientWidth;
    const height = renderer.domElement.parentElement!.clientHeight;

    renderer.setSize(width, height);

    // Update camera aspect ratio
    if ("aspect" in camera) {
      camera.aspect = width / height;
    }

    camera.updateProjectionMatrix();
  }

  handleResize();
  return { handleResize };
};

export const TWEAK_PANE_CONTAINER_ID = "tweak-container";

export { getSketches } from "./getSketches";
