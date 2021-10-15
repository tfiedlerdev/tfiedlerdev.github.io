import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";

import { OrbitControls } from "./threejs-addons/OrbitControls.js";
import getCameraInstance from "./camera.js";
import setupScene from "./scene.js";
THREE.Cache.enabled = true;

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas });

// setup camera
const camera = getCameraInstance();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let speedZ = 0;

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (mouse.y >= 0.8) {
    speedZ = -0.1;
  } else if (mouse.y <= -0.8) {
    speedZ = 0.1;
  } else {
    speedZ = 0;
  }
}

// setup controls
//const controls = new OrbitControls(camera, renderer.domElement);
/*controls.minAzimuthAngle = -Math.PI / 4;
  controls.maxAzimuthAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 2;*/
//controls.update();

let terrain = undefined;
let selectables = undefined;
let scene = undefined;
let light = undefined;
// setup scene

const init3D = async () => {
  const environment = await setupScene();
  console.log(environment);
  terrain = environment.terrain;
  scene = environment.scene;
  selectables = environment.selectables;
  light = environment.light;
  renderer.render(scene, camera);
  window.addEventListener("mousemove", onMouseMove, false);

  requestAnimationFrame(render);
};

init3D();
function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}

function render(time) {
  time *= 0.001; // convert time to seconds
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < selectables.length; i++) {
    selectables[i].material.color = new THREE.Color(0xffffff);
  }

  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color = new THREE.Color(0x808080);
  }
  resizeCanvasToDisplaySize();

  camera.position.z += speedZ;
  light.position.z = camera.position.z;
  if (terrain != undefined) {
    terrain.material.uniforms["u_time"].value =
      (new Date().getTime() % (1000 * 100)) / (1000 * 100); //
  }
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
