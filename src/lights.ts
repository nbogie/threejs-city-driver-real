import { AmbientLight, Color, DirectionalLight, Scene } from "three";
import { mapLinear } from "three/src/math/MathUtils";

interface MySceneLights {
    ambLight: AmbientLight;
    light: DirectionalLight;
    lowLight: DirectionalLight;
}

export function makeLightsAndAddToScene(scene: Scene): MySceneLights {
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

export function updateLights({ ambLight }: MySceneLights, scene: Scene, frameCount: number): void {
    const skyColourTwo = new Color('skyblue');

    const skyFraction = mapLinear(Math.sin(frameCount / 1000), -1, 1, 0, 1);
    const ambLightFraction = mapLinear(Math.sin(frameCount / 1000), -1, 1, 0.6, 0.1);
    scene.background = new Color(skyColourTwo).lerp(new Color('black'), skyFraction);
    ambLight.intensity = ambLightFraction;
}