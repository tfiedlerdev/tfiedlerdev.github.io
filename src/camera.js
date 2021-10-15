import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";
export default function getCameraInstance() {
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.lookAt(0, 5, -30);
  camera.position.z = 4;
  camera.position.y = 1;
  return camera;
}
