import { AmbientLight, DirectionalLight, Scene } from "three";

export function setupLights(scene: Scene): void {
    const directionalLight1 = new DirectionalLight();
    directionalLight1.position.set(-2, 3, 2);
    scene.add(directionalLight1);

    const directionalLight2 = new DirectionalLight();
    directionalLight2.position.set(-5, 2, -2);
    scene.add(directionalLight2);

    const ambLight = new AmbientLight(0x604040); // soft white light from everywhere
    scene.add(ambLight);
}