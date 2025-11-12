import * as THREE from 'three';

// Shared raycaster and mouse
export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();

// Event listener for mouse movement
export function setupMouseEvents() {
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
}
