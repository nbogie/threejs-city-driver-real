//my openprocessing sketches
// 1020500 threejs-start: https://openprocessing.org/sketch/1020500
// 1028620 threejs adding obstacles: https://openprocessing.org/sketch/1028620
// 1031685 threejs rainbow trails: https://openprocessing.org/sketch/1031685
// 1020528 gintaras added sound, diff camera angle: https://openprocessing.org/sketch/1020528

import { Mesh, Scene } from 'three';
import { mapLinear } from 'three/src/math/MathUtils';
import { CamConfig, cycleCameras, setupCamera, updateCamera } from './camera';
import { createCity, createGroundPlane, createRoad, createRoadStripes, recycleBuildings, recycleRoadStripes, updateBuildings } from './city';
import { setupHelpers } from './helpers';
import { makeLightsAndAddToScene, updateLightsAndSky } from './lights';
import { Mouse } from './mouse';
import { setupRenderer } from './renderer';
import { createSheepies, updateSheepies } from './sheep';
import { deleteSmokeParticles, updateSmokeParticles } from './smoke';
import { loadSounds } from './sound';
import { setupStatsPanel } from './statsPanel';
import { Car, createVehicle, loadCarModel, updateCar } from './vehicle';

export async function setupThreeJSScene(): Promise<void> {

    const scene = new Scene();

    const stats = setupStatsPanel();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const { axesHelper, gridHelper } = setupHelpers(scene);

    function handleMouseMove(event: MouseEvent) {
        mouse.y = mapLinear(event.clientY, 0, window.innerHeight, -0.5, 0.5);
        mouse.x = mapLinear(event.clientX, 0, window.innerWidth, -0.5, 0.5);
    }

    function handleMouseDown(ev: MouseEvent) {
        if (ev.button === 0) {
            mouse.leftButtonDown = true;
        }
        if (ev.button === 2) {
            mouse.rightButtonDown = true;
        }
    }

    function handleMouseUp(ev: MouseEvent) {
        if (ev.button === 0) {
            mouse.leftButtonDown = false;
        }
        if (ev.button === 2) {
            mouse.rightButtonDown = false;
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'c' || e.key === 'C') {
            cycleCameras(camConfig);
        }
        if (e.key === 'd') {
            axesHelper.visible = !axesHelper.visible;
            gridHelper.visible = !gridHelper.visible;
        }
    }

    function updateHelpers(myVehicle: Car) {
        axesHelper.position.copy(myVehicle.mesh.position);
        axesHelper.position.y = 0.1;
        gridHelper.position.copy(myVehicle.mesh.position);
        gridHelper.position.y = 1;
    }

    function shakeCamera(amt = 10) {
        camConfig.shakeAmount += amt;
    }

    function dampenShake() {
        camConfig.shakeAmount -= 0.25;
        if (camConfig.shakeAmount < 0) {
            camConfig.shakeAmount = 0;
        }
    }

    const mouse: Mouse = {
        x: 0,
        y: 0,
        leftButtonDown: false,
        rightButtonDown: false
    }

    const camConfig: CamConfig = {
        camNumber: 2,
        pedestrian: {
            pos: null
        },
        shakeAmount: 0
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    // not sure why we can't add this listener to the canvas
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);


    //don't trigger right-mouse-button context menu
    document.oncontextmenu = function () {
        return false;
    }

    const myVehicle: Car = await createVehicle(scene);
    loadSounds();

    const buildings: Mesh[] = createCity(scene, 200);
    createSheepies(scene);
    const road = createRoad();
    const roadStripes: Mesh[] = createRoadStripes(scene, 10);
    const ground = createGroundPlane();
    scene.add(road);
    scene.add(ground);

    const mySceneLights = makeLightsAndAddToScene(scene);

    let frameCount = 1;

    renderAndUpdateWorld();

    function renderAndUpdateWorld(): void {
        road.position.z = myVehicle.mesh.position.z;
        ground.position.z = myVehicle.mesh.position.z;

        updateCar(mouse, myVehicle, scene);
        updateHelpers(myVehicle);

        updateLightsAndSky(mySceneLights, scene, frameCount);
        updateCamera(camConfig, myVehicle, camera, frameCount);

        recycleBuildings(buildings, myVehicle.mesh.position);
        updateBuildings(buildings, myVehicle.mesh.position);

        updateSmokeParticles();
        deleteSmokeParticles(scene);

        updateSheepies(myVehicle.mesh.position, myVehicle.mesh.position, {
            shakeCamera
        }, scene);

        recycleRoadStripes(roadStripes, myVehicle.mesh.position);

        dampenShake();
        stats.update();

        renderer.render(scene, camera);

        requestAnimationFrame(renderAndUpdateWorld);

        frameCount += 1;
    }

}

setupThreeJSScene();

