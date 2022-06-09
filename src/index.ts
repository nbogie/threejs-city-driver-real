//my openprocessing sketches
// 1020500 threejs-start: https://openprocessing.org/sketch/1020500
// 1028620 threejs adding obstacles: https://openprocessing.org/sketch/1028620
// 1031685 threejs rainbow trails: https://openprocessing.org/sketch/1031685
// 1020528 gintaras added sound, diff cam angle: https://openprocessing.org/sketch/1020528

import { Scene } from 'three';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';
export function setupThreeJSScene(): void {

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    animate();
    function animate() {

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }

}

setupThreeJSScene();

