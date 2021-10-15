import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";
import { makeInstance } from "./terrain.js";

export default async function setupScene() {
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

  let terrain = await makeInstance([16, 64], [16, 64]);
  terrain.position.set(0, 0, -12);
  scene.add(terrain);
  console.log(scene);
  return { scene, terrain, selectables: [plane] };
}
