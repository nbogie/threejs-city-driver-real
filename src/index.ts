import { Mesh, Scene } from 'three';
import { CamConfig, cycleCameras, setupCamera, updateCamera } from './camera';
import { createCity, createGroundPlane, createRoad, createRoadStripes, recycleBuildings, recycleRoadStripes, updateBuildings } from './city';
import { setupHelpers } from './helpers';
import { makeLightsAndAddToScene, updateLightsAndSky } from './lights';
import { setupMouse } from './mouse';
import { setupEffectComposer } from './postProcessing';
import { setupRenderer } from './renderer';
import { createSheepies, Sheepie, updateSheepies } from './sheep';
import { deleteSmokeParticles, updateSmokeParticles } from './smoke';
import { loadSounds } from './sound';
import { setupStatsPanel } from './statsPanel';
import { Car, createVehicle, updateCar } from './vehicle';

export async function setupThreeJSScene(): Promise<void> {

    const scene = new Scene();

    const stats = setupStatsPanel();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const effectComposer = setupEffectComposer(camera, renderer, scene);
    const { axesHelper, gridHelper } = setupHelpers(scene);
    let isPostProcessingEnabled = false;

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'c' || e.key === 'C') {
            cycleCameras(camConfig);
        }
        if (e.key === 'd') {
            axesHelper.visible = !axesHelper.visible;
            gridHelper.visible = !gridHelper.visible;
        }
        if (e.key === 'f') {
            myVehicle.isFlying = !myVehicle.isFlying;
        }
        if (e.key === "p") {
            isPostProcessingEnabled = !isPostProcessingEnabled;
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

    const mouse = setupMouse(renderer.domElement);

    const camConfig: CamConfig = {
        camNumber: 2,
        pedestrian: {
            pos: null
        },
        shakeAmount: 0
    };

    // not sure why we can't add this listener to the canvas
    window.addEventListener('keydown', handleKeyDown);


    const myVehicle: Car = await createVehicle(scene);
    loadSounds();

    const buildings: Mesh[] = createCity(scene, 200);
    const sheepies: Sheepie[] = await createSheepies(scene);

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

        updateCar(mouse, myVehicle, scene, frameCount);
        updateHelpers(myVehicle);

        updateLightsAndSky(mySceneLights, scene, frameCount);
        updateCamera(camConfig, myVehicle, sheepies, camera, frameCount);

        recycleBuildings(buildings, myVehicle.mesh.position);
        updateBuildings(buildings, myVehicle.mesh.position);

        updateSmokeParticles();
        deleteSmokeParticles(scene);

        updateSheepies(sheepies, myVehicle.mesh.position, myVehicle.mesh.position, {
            shakeCamera
        }, scene);

        recycleRoadStripes(roadStripes, myVehicle.mesh.position);

        dampenShake();
        stats.update();
        if (isPostProcessingEnabled) {
            effectComposer.render()
        } else {
            renderer.render(scene, camera);
        }

        // document.getElementById("info")!.innerText = "mouse: " + mouse.x.toFixed(2) + ", " + mouse.y.toFixed(2);
        requestAnimationFrame(renderAndUpdateWorld);

        frameCount += 1;
    }

}

setupThreeJSScene();

