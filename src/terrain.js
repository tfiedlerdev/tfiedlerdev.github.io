import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";
//import { BufferGeometryUtils } from "./BufferGeometryUtils.js";
export function terrainGeometry(resolution, terrainDimensions) {
  const quadSize = [
    (0.5 * terrainDimensions[0]) / resolution[0],
    (0.5 * terrainDimensions[1]) / resolution[1],
  ];
  const geometry = new THREE.BufferGeometry();

  const vertices = new Float32Array(resolution[0] * resolution[1] * 6 * 3);
  const singleQuad = [
    1, 0, -1, -1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0, 1, 1, -0, -1,
  ];
  const yPos = 0;

  const normals = [];
  const uv = [];
  for (let x = 0; x < resolution[0]; x++) {
    const dXWorld =
      (x / resolution[0] - 0.5) * terrainDimensions[0] + quadSize[0];
    for (let z = 0; z < resolution[1]; z++) {
      normals.push(...[0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
      uv.push(...[1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1]);
      const dZWorld =
        (z / resolution[1] - 0.5) * terrainDimensions[1] + quadSize[1];
      const q = x * resolution[1] + z;
      const i_offset = q * 6 * 3;
      for (let i = 0; i < singleQuad.length; i++) {
        const axis = i % 3;
        const size = axis == 0 ? quadSize[0] : axis == 1 ? 0 : quadSize[1];
        vertices[i_offset + i] =
          (axis == 0 ? dXWorld : axis == 1 ? yPos : dZWorld) +
          singleQuad[i] * size;
      }
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );

  geometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(new Float32Array(normals), 3)
  );
  geometry.setAttribute(
    "uv",
    new THREE.BufferAttribute(new Float32Array(uv), 2)
  );
  return geometry;
}
export function makeInstance(geometry, color) {
  const material = new THREE.MeshBasicMaterial({ color, wireframe: true }); //new THREE.MeshPhongMaterial({ color });
  const mesh = new THREE.Mesh(geometry, terrainMaterial);

  //BufferGeometryUtils.toTrianglesDrawMode(mesh, THREE.TriangleStripDrawMode);
  return mesh;
}
const terrainMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_time: { value: 1.0 },
  },
  vertexShader: document.getElementById("terrainVertexShader").textContent,
  fragmentShader: document.getElementById("terrainFragmentShader").textContent,
});
