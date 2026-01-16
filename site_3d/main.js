// ===================
// CENA
// ===================
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x050510, 10, 30);

// ===================
// CÂMERA CINEMATOGRÁFICA
// ===================
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 10);

// ===================
// RENDER
// ===================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ===================
// LUZES CINEMÁTICAS
// ===================
const keyLight = new THREE.DirectionalLight(0x88ccff, 1.2);
keyLight.position.set(5, 10, 5);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0xff0080, 1, 20);
rimLight.position.set(-5, 3, -5);
scene.add(rimLight);

scene.add(new THREE.AmbientLight(0x404040));

// ===================
// PRODUTOS 3D
// ===================
const products = [];
const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);

for (let i = 0; i < 5; i++) {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(`hsl(${i * 60},100%,55%)`),
    metalness: 0.6,
    roughness: 0.25
  });

  const cube = new THREE.Mesh(geo, mat);
  cube.position.set(i * 2 - 4, 0, 0);
  cube.userData = { name: `Produto ${i + 1}` };

  scene.add(cube);
  products.push(cube);
}

// ===================
// INTERAÇÃO
// ===================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", e => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObjects(products)[0];

  if (hit) {
    hit.object.scale.set(1.6, 1.6, 1.6);
    setTimeout(() => hit.object.scale.set(1.2,1.2,1.2), 300);
    alert("🛒 " + hit.object.userData.name);
  }
});

// ===================
// ANIMAÇÃO CINEMÁTICA
// ===================
function animate() {
  requestAnimationFrame(animate);

  products.forEach((p, i) => {
    p.rotation.y += 0.01;
    p.position.y = Math.sin(Date.now() * 0.002 + i) * 0.3;
  });

  camera.position.x = Math.sin(Date.now() * 0.0005) * 1.5;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

// ===================
// RESPONSIVO
// ===================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
