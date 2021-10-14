import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";
import { makeInstance } from "./terrain.js";
import { OrbitControls } from "./threejs-addons/OrbitControls.js";

THREE.Cache.enabled = true;

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas });

// setup camera
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.lookAt(0, 5, -30);
camera.position.z = 4;
camera.position.y = 1;

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

// setup scene
const scene = new THREE.Scene();
const geometry = new THREE.PlaneGeometry(15, 7.5);
const texture = new THREE.TextureLoader().load("./textures/hideThePain.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1);
const material = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  map: texture,
  color: 0xffffff,
});
const plane = new THREE.Mesh(geometry, material);
plane.position.set(0, 5, -40);

scene.add(plane);

const light1 = new THREE.PointLight(0xffffff, 1, 80, 0.005);
light1.position.set(0, 2, 3);
scene.add(light1);

let terrain = null;
const loadTerrain = async () => {
  terrain = await makeInstance([16, 64], [16, 64]);
  terrain.position.set(0, 0, -12);
  scene.add(terrain);
};

loadTerrain();

renderer.render(scene, camera);

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
console.log(camera);
function render(time) {
  time *= 0.001; // convert time to seconds
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  plane.material.color = new THREE.Color(0xffffff);
  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color = new THREE.Color(0x808080);
  }
  resizeCanvasToDisplaySize();

  camera.position.z += speedZ;

  //cube.rotation.x = time;
  //cube.rotation.y = time;
  if (terrain != undefined) {
    terrain.material.uniforms["u_time"].value =
      (new Date().getTime() % (1000 * 100)) / (1000 * 100); //
  }
  renderer.render(scene, camera);

  requestAnimationFrame(render);
  //controls.update();
}
window.addEventListener("mousemove", onMouseMove, false);
requestAnimationFrame(render);
