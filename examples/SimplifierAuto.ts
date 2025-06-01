import { Main, PerspectiveCameraAuto } from '@three.ez/main';
import { simplifyGeometries, simplifyGeometriesByAppearanceLOD, SimplifyParams } from '@three.ez/simplify-geometry';
import { AmbientLight, DirectionalLight, Mesh, MeshNormalMaterial, Scene, TorusKnotGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Pane } from 'tweakpane';

const main = new Main();
const scene = new Scene().activeSmartRendering();
const camera = new PerspectiveCameraAuto(50).translateZ(20);
const controls = new OrbitControls(camera, main.renderer.domElement);
controls.update();

scene.add(new AmbientLight());
const dirLight = new DirectionalLight('white', 2);
camera.add(dirLight, dirLight.target);

const meshes: Mesh[] = [];
const material = new MeshNormalMaterial();
const originalGeometries = [
  new TorusKnotGeometry(1, 0.4, 256, 32, 1, 1),
  new TorusKnotGeometry(1, 0.4, 256, 32, 1, 2),
  new TorusKnotGeometry(1, 0.4, 256, 32, 1, 3),
  new TorusKnotGeometry(1, 0.4, 256, 32, 1, 4),
  new TorusKnotGeometry(1, 0.4, 256, 32, 1, 5),
  new TorusKnotGeometry(1, 0.4, 256, 32, 2, 1),
  new TorusKnotGeometry(1, 0.4, 256, 32, 2, 3),
  new TorusKnotGeometry(1, 0.4, 256, 32, 3, 1),
  new TorusKnotGeometry(1, 0.4, 256, 32, 4, 1)
];

for (let i = 0; i < originalGeometries.length; i++) {
  const mesh = new Mesh(originalGeometries[i], material);
  mesh.position.set(i % 3 * 5 - 5, Math.floor(i / 3) * 5 - 5, 0);
  scene.add(mesh);
  meshes.push(mesh);
}

const params: SimplifyParams = {
  ratio: 0,
  error: 0,
  errorAbsolute: false,
  lockBorder: false,
  prune: false,
  sparse: false,
  logAppearanceError: false
};

const pane = new Pane();
pane.on('change', onChange);
pane.addBinding(params, 'ratio', { min: 0, max: 1, step: 0.001 });
pane.addBinding(params, 'error', { min: 0, max: 1, step: 0.001 });
pane.addBinding(params, 'errorAbsolute');
pane.addBinding(params, 'lockBorder');
pane.addBinding(params, 'prune');
pane.addBinding(params, 'sparse');

async function onChange(): Promise<void> {
  console.time('simplifyGeometries');
  const geometries = await simplifyGeometriesByAppearanceLOD(originalGeometries, params);
  console.timeEnd('simplifyGeometries');

  for (let i = 0; i < originalGeometries.length; i++) {
    meshes[i].geometry = geometries[i];
  }
  scene.needsRender = true;
}

main.createView({ scene, camera });
