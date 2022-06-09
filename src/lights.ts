import { AmbientLight, Color, DirectionalLight, DirectionalLightHelper, Scene } from "three";
import { mapLinear } from "three/src/math/MathUtils";

interface MySceneLights {
    ambLight: AmbientLight;
    frontDirectionalLight: DirectionalLight;
    lowDirectionalLight: DirectionalLight;
}

export function makeLightsAndAddToScene(scene: Scene): MySceneLights {
    const frontDirectionalLight = new DirectionalLight(0xFFA050);
    frontDirectionalLight.position.set(2, 2, 100);

    const lowDirectionalLight = new DirectionalLight(0x0060FF);
    lowDirectionalLight.position.set(1, -2, -3);

    const ambLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambLight);
    scene.add(frontDirectionalLight);
    scene.add(lowDirectionalLight);

    return {
        ambLight,
        frontDirectionalLight,
        lowDirectionalLight
    };
    // scene.add(new DirectionalLightHelper(frontDirectionalLight, 5))
    // scene.add(new DirectionalLightHelper(lowDirectionalLight, 5));
}

export function updateLightsAndSky({ ambLight }: MySceneLights, scene: Scene, frameCount: number): void {
    const skyColourTwo = new Color('skyblue');

    const skyFraction = mapLinear(Math.sin(frameCount / 1000), -1, 1, 0, 1);
    const ambLightFraction = mapLinear(Math.sin(frameCount / 1000), -1, 1, 0.6, 0.1);
    scene.background = new Color(skyColourTwo).lerp(new Color('black'), skyFraction);
    ambLight.intensity = ambLightFraction;
}