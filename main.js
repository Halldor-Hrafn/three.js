import * as THREE from 'three';
import { raycaster, mouse, setupMouseEvents } from './globals.js';
import { createCubeScene } from './cubeScene.js';
import { createSphereScene } from './sphereScene.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

let isHovered = false;

// Create an array to store all interactive objects
const interactiveObjects = [];

// Example: Add another object
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Create star systems
const starSystems = [];
const starColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
const starPositions = [
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(0, 5, 0),
    new THREE.Vector3(0, -5, 0),
    new THREE.Vector3(0, 0, -5)
];

starPositions.forEach((position, index) => {
    const starGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({ color: starColors[index] });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.copy(position);
    scene.add(star);
    starSystems.push(star);
});

// Create hyperlanes (connections between star systems)
function createHyperlane(star1, star2) {
    const points = [
        star1.position.clone(),
        star2.position.clone()
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

// Define connections (hyperlanes)
createHyperlane(starSystems[0], starSystems[1]);
createHyperlane(starSystems[1], starSystems[2]);
createHyperlane(starSystems[2], starSystems[3]);
createHyperlane(starSystems[3], starSystems[4]);
createHyperlane(starSystems[0], starSystems[4]);

// Adjust camera to view the cluster
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

// Create a div for displaying text
const hoverText = document.createElement('div');
hoverText.style.position = 'absolute';
hoverText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
hoverText.style.color = 'white';
hoverText.style.padding = '5px';
hoverText.style.borderRadius = '5px';
hoverText.style.display = 'none';
hoverText.style.pointerEvents = 'none';
document.body.appendChild(hoverText);

function onMouseMove(event) {
    // Calculate normalized device coordinates (NDC) for the mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove);

// Variables to track camera movement
const cameraSpeed = 0.1;
const keys = {};

// Event listeners for key presses
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function updateCameraPosition() {
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    // Get the forward direction of the camera
    camera.getWorldDirection(forward);
    forward.normalize();

    // Calculate the right direction (perpendicular to forward)
    right.crossVectors(forward, camera.up).normalize();

    if (keys['w']) {
        camera.position.add(forward.multiplyScalar(cameraSpeed)); // Move forward
    }
    if (keys['s']) {
        camera.position.add(forward.multiplyScalar(-cameraSpeed)); // Move backward
    }
    if (keys['a']) {
        camera.position.add(right.multiplyScalar(-cameraSpeed)); // Move left
    }
    if (keys['d']) {
        camera.position.add(right.multiplyScalar(cameraSpeed)); // Move right
    }
    if (keys['q']) {
        camera.position.y += cameraSpeed; // Move up
    }
    if (keys['e']) {
        camera.position.y -= cameraSpeed; // Move down
    }
} 

// Variables to track camera rotation
let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Define a target point for the camera to look at
const cameraTarget = new THREE.Vector3(0, 0, 0);

function updateCameraRotation(deltaX, deltaY) {
    // Adjust the camera's rotation directly based on mouse movement
    camera.rotation.y -= deltaX * 0.002; // Horizontal rotation
    camera.rotation.x -= deltaY * 0.002; // Vertical rotation

    // Clamp the vertical rotation to prevent flipping
    // camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
}

function updateCameraRotationWithKeys() {
    if (keys['ArrowLeft']) {
        camera.rotation.y += 0.02; // Rotate left
    }
    if (keys['ArrowRight']) {
        camera.rotation.y -= 0.02; // Rotate right
    }
    if (keys['ArrowUp']) {
        camera.rotation.x += 0.02; // Rotate up
        // camera.rotation.z = Math.min(camera.rotation.x, Math.PI / 2); // Clamp rotation
    }
    if (keys['ArrowDown']) {
        camera.rotation.x -= 0.02; // Rotate down
        console.log(camera.rotation.x);
        console.log(camera.rotation.y);
        console.log(camera.rotation.z);
        // camera.rotation.z = Math.max(camera.rotation.x, -Math.PI / 2); // Clamp rotation
    }
}

// Event listeners for mouse down and up
window.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

window.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;

        // Update camera rotation relative to the target
        updateCameraRotation(deltaX, deltaY);

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

setupMouseEvents();

function renderScene(sceneToRender) {
    renderer.setAnimationLoop(() => {
        // Update camera position based on input
        updateCameraPosition();
        updateCameraRotationWithKeys();

        // Render the provided scene
        renderer.render(sceneToRender, camera);
    });
}

function onClick(event) {
    // Calculate normalized device coordinates (NDC) for the mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with all interactive objects
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (objectScenes.has(object)) {
            // Transition to the object's scene
            const newScene = objectScenes.get(object);
            hoverText.style.display = 'none'; // Hide hover text
            renderScene(newScene);
        }
    }
}

window.addEventListener('click', onClick);

// Function to draw a line between two objects
function drawLineBetweenObjects(object1, object2) {
    const points = [
        object1.position.clone(), // Start point
        object2.position.clone()  // End point
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffff00 }); // Yellow line
    const line = new THREE.Line(geometry, material);

    scene.add(line);
}

function animate() {
    // Update camera position based on input
    updateCameraPosition();
    updateCameraRotationWithKeys();

    // Update raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with all interactive objects
    const intersects = raycaster.intersectObjects(interactiveObjects);

    // Reset hover state for all objects
    interactiveObjects.forEach((object) => {
        if (object.userData.isHovered) {
            object.material.color.set(object.userData.originalColor);
            object.userData.isHovered = false;
        }
    });

    // Handle hover state for intersected objects
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (!object.userData.isHovered) {
            object.userData.originalColor = object.material.color.getHex();
            object.material.color.set(0xff0000); // Change color to red
            object.userData.isHovered = true;
        }

        // Display hover text
        hoverText.textContent = object.userData.text;
        hoverText.style.left = `${mouse.x * 0.5 * window.innerWidth + window.innerWidth / 2}px`;
        hoverText.style.top = `${-mouse.y * 0.5 * window.innerHeight + window.innerHeight / 2}px`;
        hoverText.style.display = 'block';
    } else {
        hoverText.style.display = 'none';
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
