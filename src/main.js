import cellModelUrl from './assets/Cell.glb?url';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);

new RGBELoader()
  .setPath('/hdr/')
  .load('studio_small_03_1k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Свет
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
scene.add(dirLight);


// Загрузка GLB
const loader = new GLTFLoader();
loader.load(cellModelUrl, (gltf) => {
  const model = gltf.scene;
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      // Можно посмотреть на материалы
      console.log(child.material);
    }
  });

  scene.add(model);
}, undefined, (error) => {
  console.error(error);
});

camera.position.set(1, 4, 5);
camera.lookAt(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // <- без этого не будет работать нормально
  renderer.render(scene, camera);
}
animate();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// window.addEventListener('click', (event) => {
//   // Нормализуем координаты мыши
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);

//   // Получаем список объектов, с которыми пересекается луч
// });

// Словарь названий и описаний
const descriptions = {
  DNA: `<strong>DNA (Deoxyribonucleic Acid)</strong><br>DNA carries the genetic blueprint of an organism. Located in the cell nucleus, it consists of two long strands forming a double helix. DNA stores hereditary information, instructs protein synthesis, and ensures accurate cell replication. It plays a foundational role in development, function, and reproduction. Mutations in DNA can lead to genetic disorders, emphasizing its biological importance.`,

  Inner_nucleous: `<strong>Inner Nucleolus</strong><br>The inner nucleolus is a dense region within the nucleus where ribosomal RNA is synthesized and ribosome subunits are assembled. It supports essential functions in protein production and also contributes to cellular stress responses and regulation of the cell cycle.`,

  Nucleous_membrane: `<strong>Nuclear Membrane</strong><br>The nuclear membrane is a double-layered barrier that encloses the nucleus and separates it from the cytoplasm. Its embedded nuclear pores allow for the regulated exchange of RNA, proteins, and signaling molecules, maintaining the internal environment necessary for genome stability and gene expression control.<br /> <img src="https://ars.els-cdn.com/content/image/3-s2.0-B9780123944474200278-f20027-01-9780123944474.jpg" width="400px" height="300px" alt="cell_membrane">`,

  Nucleoplasm: `<strong>Nucleus</strong><br>The nucleus functions as the command center of the cell, housing DNA and regulating gene expression, replication, and transcription. It is surrounded by the nuclear membrane and filled with nucleoplasm, which supports chromatin, enzymes, and the nucleolus. This compartment ensures controlled and accurate management of genetic activity.`,

  Cell_membrane: `<strong>Cell Membrane</strong><br>The cell membrane is a flexible, semi-permeable structure that defines cell boundaries and regulates interactions with the external environment. It maintains homeostasis by controlling the movement of substances in and out of the cell and also plays a role in signaling, adhesion, and cellular communication.`,

  Centriole: `<strong>Centriole</strong><br>Centrioles are cylindrical organelles composed of microtubules. They are involved in organizing the mitotic spindle during cell division and contribute to the formation of centrosomes, cilia, and flagella. Their structural organization is key to maintaining cell polarity and division accuracy.`,

  Cytoplasm: `<strong>Cytoplasm</strong><br>The cytoplasm is a gel-like fluid that fills the interior of the cell, excluding the nucleus. It serves as a medium for biochemical reactions and provides support for organelles. Enzymes within the cytoplasm facilitate essential metabolic pathways, while cytoskeletal elements maintain cell shape and enable intracellular transport.`,

  ER_rough: `<strong>Rough Endoplasmic Reticulum</strong><br>The rough ER is a membrane-bound organelle studded with ribosomes, giving it a textured appearance. It plays a key role in protein synthesis and folding. Newly formed proteins are processed here before being sent to the Golgi apparatus for further modification and distribution.`,

  ER_smooth: `<strong>Smooth Endoplasmic Reticulum</strong><br>The smooth ER lacks ribosomes and is involved in lipid and steroid synthesis, detoxification of harmful substances, and calcium ion storage. It contributes to membrane production and is dynamically reshaped according to the metabolic needs of the cell.`,

  Golgi_aparatus: `<strong>Golgi Apparatus</strong><br>The Golgi apparatus is a stack of flattened membranes responsible for modifying, sorting, and packaging proteins and lipids for secretion or delivery to other organelles. It also produces lysosomes and plays a crucial role in post-translational processing of macromolecules.`,

  Lisosome: `<strong>Lysosome</strong><br>Lysosomes are membrane-bound organelles that contain digestive enzymes capable of breaking down waste, debris, and foreign substances. They are central to the process of autophagy, helping to recycle cellular components and protect the cell from damage and infection.`,

  Mitohondria: `<strong>Mitochondria</strong><br>Mitochondria are the energy producers of the cell, converting nutrients into ATP through aerobic respiration. In addition to energy production, they regulate apoptosis, calcium homeostasis, and the synthesis of key metabolic compounds. Their own DNA and evolutionary history point to an ancient symbiotic origin.`,

  Ribosome: `<strong>Ribosome</strong><br>Ribosomes are molecular machines responsible for translating genetic information from mRNA into proteins. Found either floating freely in the cytoplasm or attached to the rough ER, they are essential for maintaining the flow of genetic information and supporting the growth and function of the cell.`
};



// HTML-блок для описания
const infoBox = document.createElement('div');
infoBox.style.position = 'absolute';
infoBox.style.bottom = '10px';
infoBox.style.left = '10px';
infoBox.style.padding = '12px';
infoBox.style.maxWidth = '400px';
infoBox.style.background = 'rgba(0, 0, 0, 0.8)';
infoBox.style.color = 'white';
infoBox.style.borderRadius = '10px';
infoBox.style.fontFamily = 'sans-serif';
infoBox.style.display = 'none';
document.body.appendChild(infoBox);

// Обработка кликов
// window.addEventListener('click', (event) => {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(scene.children, true);

//   if (intersects.length > 0) {
//     const object = intersects[0].object;
//     const name = object.name;
//     const description = descriptions[name];

//     if (description) {
//       infoBox.innerHTML = `${description}`;
//       infoBox.style.display = 'block';
//     } else {
//       infoBox.style.display = 'none';
//     }
//   } else {
//     infoBox.style.display = 'none';
//   }
// });


const cursorOffset = {
  x: 10, // пикселей вправо
  y: 10  // пикселей вниз
};

window.addEventListener('click', (event) => {
  const offsetX = event.clientX + cursorOffset.x;
  const offsetY = event.clientY + cursorOffset.y;

  mouse.x = (offsetX / window.innerWidth) * 2 - 1;
  mouse.y = (offsetY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    console.log('Попал в:', clickedObject.name || 'анонимный объект');
  }
});

const descriptionBox = document.getElementById('description');
const raycasterClick = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycasterClick.setFromCamera(mouseClick, camera);
  const intersects = raycasterClick.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    const name = object.name;
    const desc = descriptions[name];

    if (desc) {
      descriptionBox.innerHTML = desc;
      descriptionBox.style.display = 'block';
    } else {
      descriptionBox.innerHTML = `<strong>${name}</strong><br>No description available.`;
      descriptionBox.style.display = 'block';
    }
  } else {
    descriptionBox.style.display = 'none';
  }
});


const tooltip = document.getElementById('tooltip');
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    tooltip.style.display = 'block';
    tooltip.style.left = (event.clientX + 10) + 'px';
    tooltip.style.top = (event.clientY + 10) + 'px';
    tooltip.textContent = object.name || 'Безымянный органоид';
  } else {
    tooltip.style.display = 'none';
  }
});

