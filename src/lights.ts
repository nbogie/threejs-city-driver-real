import { AmbientLight, DirectionalLight, Scene } from "three";

export function makeLightsAndAddToScene(scene: Scene): { ambLight: AmbientLight; light: DirectionalLight; lowLight: DirectionalLight; } {
    const light = new DirectionalLight(0xFFA050);
    light.position.set(2, 2, 100);

    const lowLight = new DirectionalLight(0x0060FF);
    lowLight.position.set(1, -2, -3);

    const ambLight = new AmbientLight(0xffffff, 0.3);

    scene.add(ambLight);
    scene.add(light);
    scene.add(lowLight);

    return {
        ambLight,
        light,
        lowLight
    };
    // scene.add(new THREE.DirectionalLightHelper(light, 5))
    // scene.add(new THREE.DirectionalLightHelper(lowLight, 5));
}