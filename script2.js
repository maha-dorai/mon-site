document.addEventListener('DOMContentLoaded', function () {
  // === Section 1: graduation_hat.glb model ===
  const container1 = document.getElementById("model-container");
  const scene1 = new THREE.Scene();
  const camera1 = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  const renderer1 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer1.setSize(container1.clientWidth, container1.clientHeight);
  renderer1.setClearColor(0x000000, 0); // Fond transparent
  container1.appendChild(renderer1.domElement);

  camera1.position.set(2, 1.5, 5);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene1.add(ambientLight, directionalLight);

  const controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);
  controls1.enableDamping = true;
  controls1.dampingFactor = 0.05;
  controls1.enableZoom = false;
  controls1.enablePan = false;
  controls1.autoRotate = true;
  controls1.autoRotateSpeed = 1;

  const loader1 = new THREE.GLTFLoader();
  loader1.load('graduation_hat.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(1.1, 1.1, 1.1);
    scene1.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    model.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        const material = child.material.clone();

        if (name.includes("torus_hat")) {
          material.color.set("#2e3245");
        } else if (name.includes("sphere_roope") || name.includes("sphere_bood_0")) {
          material.color.set("#b38500");
        } else if (name.includes("cube_book_0")) {
          material.color.set("#d13f5b");
        } else if (name.includes("cube001_book_2__0")) {
          material.color.set("#2a4d77");
        } else if (name.includes("pages")) {
          material.color.set("#ffffff");
        }

        child.material = material;
        child.castShadow = true;
      }
    });
  }, undefined, function (error) {
    console.error("Error loading GLB model:", error);
  });

  // Particules pour scene1
  const particlesCount = 150;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const velocities = [];
  const colorOptions = ['#ff4d6d', '#6c5ce7', '#00b894', '#0984e3', '#fd79a8'];
  const color = new THREE.Color();

  for (let i = 0; i < particlesCount; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 7;
    const z = (Math.random() - 0.5) * 10;
    positions.push(x, y, z);
    color.set(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
    colors.push(color.r, color.g, color.b);
    velocities.push((Math.random() - 0.5) * 0.002, (Math.random() - 0.5) * 0.002, (Math.random() - 0.5) * 0.002);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  const particles = new THREE.Points(geometry, particleMaterial);
  scene1.add(particles);

  // === Section 2: untitled.glb logo ===
  const container2 = document.getElementById('logo-3d');
  const scene2 = new THREE.Scene();
  const camera2 = new THREE.PerspectiveCamera(75, container2.clientWidth / container2.clientHeight, 0.1, 1000);
  const renderer2 = new THREE.WebGLRenderer({ alpha: true });
  renderer2.setSize(container2.clientWidth, container2.clientHeight);
  container2.appendChild(renderer2.domElement);

  // Éclairage amélioré
  const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.8);
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight2.position.set(5, 10, 7);
  scene2.add(ambientLight2, directionalLight2);

  // Rotation automatique sans OrbitControls
  let logoRotationSpeed = 0.005;
  let logoModel = null;

  const loader2 = new THREE.GLTFLoader();
  loader2.load('untitled.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(2.5, 2.5, 2.5);
    
    // Centrer le modèle
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    
    scene2.add(model);
    camera2.position.z = 3.5;
    
    // Stocker la référence du modèle
    logoModel = model;
  }, undefined, function (error) {
    console.error(error);
  });

  // Boucle d'animation unifiée
  function animate() {
    requestAnimationFrame(animate);

    controls1.update();
    renderer1.render(scene1, camera1);

    // Rotation automatique du logo
    if (logoModel) {
      logoModel.rotation.y += logoRotationSpeed;
    }
    renderer2.render(scene2, camera2);

    // Animation des particules
    const posAttr = geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      posAttr[i * 3 + 0] += velocities[i * 3 + 0];
      posAttr[i * 3 + 1] += velocities[i * 3 + 1];
      posAttr[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(posAttr[i * 3 + 0]) > 5) velocities[i * 3 + 0] *= -1;
      if (Math.abs(posAttr[i * 3 + 1]) > 3.5) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posAttr[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }
    geometry.attributes.position.needsUpdate = true;
  }

  animate();

  // Gestion du redimensionnement
  window.addEventListener('resize', function () {
    const w1 = container1.clientWidth;
    const h1 = container1.clientHeight;
    camera1.aspect = w1 / h1;
    camera1.updateProjectionMatrix();
    renderer1.setSize(w1, h1);

    const w2 = container2.clientWidth;
    const h2 = container2.clientHeight;
    camera2.aspect = w2 / h2;
    camera2.updateProjectionMatrix();
    renderer2.setSize(w2, h2);
  });

  // === Gestion du formulaire ===
  const form = document.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!email || !password) {
      alert('Veuillez remplir tous les champs.');
    } else {
      window.location.href = 'home.html';
    }
  });

  // === Basculer entre les formulaires ===
  const wrapper = document.querySelector('.wrapper');
  const loginForm = document.querySelector('form');
  const signupForm = document.querySelector('.signup-form');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToSignin = document.getElementById('switch-to-signin');
  const signupAlt = document.getElementById('signup-alternative');
  const signupText = document.querySelector('.signup-text');

  switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.add('flip');
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    signupText.classList.add('hidden');
    signupAlt.classList.remove('hidden');
  });

  switchToSignin.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.remove('flip');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    signupText.classList.remove('hidden');
    signupAlt.classList.add('hidden');
  });
});
