import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";
import { terrainGeometry, makeInstance } from "./terrain.js";
import { OrbitControls } from "./threejs-addons/OrbitControls.js";
function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;
  camera.position.y = 1;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  //controls.update() must be called after any manual changes to the camera's transform

  const scene = new THREE.Scene();

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue

  const cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);

  const light1 = new THREE.PointLight(0xffff, 1, 10, 0.05);
  light1.position.set(3, 2, 3);
  scene.add(light1);

  const terrain = makeInstance(terrainGeometry([16, 40], [16, 40]), 0x58aca8);
  terrain.position.set(0, 0, -12);
  scene.add(terrain);

  renderer.render(scene, camera);

  console.log("Ich ermeter dich du Peterich!");

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

    resizeCanvasToDisplaySize();
    //cube.rotation.x = time;
    //cube.rotation.y = time;
    terrain.material.uniforms["u_time"].value =
      (new Date().getTime() % (1000 * 100)) / (1000 * 100); //

    renderer.render(scene, camera);

    requestAnimationFrame(render);
    controls.update();
  }
  requestAnimationFrame(render);
}

main();
