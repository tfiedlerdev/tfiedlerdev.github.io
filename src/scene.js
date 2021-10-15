import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";
import { makeInstance } from "./terrain.js";

function getPlaneInstance(x, y, z, textureSrc) {
  const geometry = new THREE.PlaneGeometry(15, 7.5);
  const texture = new THREE.TextureLoader().load(textureSrc);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  const material = new THREE.MeshPhongMaterial({
    side: THREE.FrontSide,
    map: texture,
    color: 0xffffff,
    transparent: true,
    alphaTest: 0.5,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(x, y, z);
  return plane;
}

export default async function setupScene() {
  const scene = new THREE.Scene();
  const sources = [
    "./textures/birthday.png",
    "./textures/education.png",
    "./textures/internships.png",
    "./textures/professional_experience.png",
  ];

  const dZ = 20;

  let currentZ = 0;
  const selectables = [];
  sources.forEach((source) => {
    const plane = getPlaneInstance(0, 3, currentZ, source);
    currentZ -= dZ;
    scene.add(plane);
    //selectables.push(plane);
  });

  const light1 = new THREE.PointLight(0xffffff, 1, 22, 0.005);
  light1.position.set(0, 2, 0);
  scene.add(light1);

  let terrain = await makeInstance([16, 128], [16, 128]);
  terrain.position.set(0, 0, -60);
  scene.add(terrain);
  console.log(scene);
  return { scene, terrain, selectables, light: light1 };
}
