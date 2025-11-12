import * as THREE from 'three';
import { raycaster, mouse, setupMouseEvents } from './globals.js';
import { createCubeScene } from './cubeScene.js';
import { createSphereScene } from './sphereScene.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let isHovered = false;

// Create an array to store all interactive objects
const interactiveObjects = [];

// Add the cube to the array
interactiveObjects.push(cube);

// Example: Add another object
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(2, 0, 0);
scene.add(sphere);
interactiveObjects.push(sphere);

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

// Assign unique text to objects
cube.userData.text = 'This is a cube';
sphere.userData.text = 'This is a sphere';

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

        // Adjust camera rotation based on mouse movement
        camera.rotation.y -= deltaX * 0.002; // Horizontal rotation
        camera.rotation.x -= deltaY * 0.002; // Vertical rotation

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

setupMouseEvents();

// Create a new scene for transitioning inside objects
const objectScenes = new Map();
objectScenes.set(cube, createCubeScene());
objectScenes.set(sphere, createSphereScene());

function renderScene(sceneToRender) {
    renderer.setAnimationLoop(() => {
        // Update camera position based on input
        updateCameraPosition();

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

// Draw a line between the cube and the sphere
drawLineBetweenObjects(cube, sphere);

function animate() {
    // Update camera position based on input
    updateCameraPosition();

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

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

renderer.setAnimationLoop(animate);
