import * as THREE from 'three';

export function createSphereScene() {
    const scene = new THREE.Scene();
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    const innerObject = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.2, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );
    scene.add(innerObject);

    return scene;
}
