import * as THREE from 'three';

export function createCubeScene() {
    const scene = new THREE.Scene();
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    const innerObject = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff00ff })
    );
    scene.add(innerObject);

    return scene;
}
