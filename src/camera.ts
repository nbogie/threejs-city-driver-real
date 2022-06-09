import { Camera, Object3D, PerspectiveCamera, Vector3 } from "three";
import { randFloatSpread } from "three/src/math/MathUtils";
import { pick } from "./randomUtils";
import { getAspect } from "./renderer";
import { farthestAirborneSheep, Sheepie } from "./sheep";
import { Car } from "./vehicle";

export interface Pedestrian {
    pos: Vector3 | null;
}

export type CamNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface CamConfig {
    camNumber: CamNumber;
    pedestrian: Pedestrian;
    shakeAmount: number;
}
//TO-DO: check old and new params for setting up camera
export function setupCamera(dim: { w: number, h: number }): PerspectiveCamera {
    const camera: PerspectiveCamera = new PerspectiveCamera(75, getAspect(dim), 1, 10000);
    camera.position.set(7, 6, 10);
    return camera;
}

export function cycleCameras(camConfig: CamConfig): void {
    camConfig.camNumber = ((camConfig.camNumber + 1) % 7) as CamNumber;
}

export function updateCamera({ camNumber, pedestrian, shakeAmount }: CamConfig, myVehicle: Car, sheepies: Sheepie[], cam: Camera, frameCount: number): void {
    switch (camNumber) {
        case 0:
            updateAutoOrbitCam(myVehicle.mesh, cam, frameCount / 80);
            break;
        case 1:
            updateChaseCam(myVehicle.mesh, cam, frameCount / 80);
            break;
        case 2:
            updateBoringChaseCam(myVehicle.mesh, cam, shakeAmount);
            break;
        case 3:
            updatePedestrianCam(myVehicle.mesh, cam, pedestrian);
            break;
        case 4:
            updateFirstPersonCam(myVehicle.mesh, cam);
            break;
        case 5:
            updateSheepCam(cam, sheepies, () => updateBoringChaseCam(myVehicle.mesh, cam, shakeAmount));
            break;
        case 6:
            updateRearFacingCam(myVehicle.mesh, cam, shakeAmount);
            break;
        default:
    }
}

export function updateAutoOrbitCam(targetMesh: Object3D, cam: Camera, t: number): void {
    const radius = 10;
    cam.position.y = 3;
    cam.position.z = targetMesh.position.z + radius * Math.cos(t);
    cam.position.x = targetMesh.position.x + radius * Math.sin(t);
    cam.lookAt(targetMesh.position);
}

export function updateChaseCam(targetMesh: Object3D, cam: Camera, t: number): void {
    cam.position.z = targetMesh.position.z + 5;
    cam.position.y = targetMesh.position.y + 2;
    cam.position.x = targetMesh.position.x + 5 * Math.sin(t);
    const targetPos = targetMesh.position.clone();
    targetPos.add(new Vector3(0, 0, -100))
    cam.lookAt(targetPos);

}

export function updateBoringChaseCam(targetMesh: Object3D, cam: Camera, shakeAmount: number): void {
    cam.position.x = targetMesh.position.x / 2;
    cam.position.y = 3;
    cam.position.z = targetMesh.position.z + 6;

    const targetPosition = targetMesh.position.clone();
    targetPosition.z -= 200;

    cam.lookAt(targetPosition);

    const shake = randFloatSpread(0.2) * shakeAmount;
    cam.position.x += shake;

}

export function updateSheepCam(cam: Camera, sheepies: Sheepie[], fnWhenNothingExcitingHappening: () => void): void {
    const sheep = farthestAirborneSheep(sheepies);
    if (!sheep) {
        fnWhenNothingExcitingHappening();
    } else {
        const desiredPos = sheep.mesh.position.clone();
        desiredPos.z += 10;
        cam.position.lerp(desiredPos, 0.1);
        cam.lookAt(sheep.mesh.position);
    }
}

export function updatePedestrianCam(targetMesh: Object3D, cam: Camera, pedestrian: Pedestrian): void {
    //make a new pedestrian position if we don't have one or the old one is too far behind car
    if (!pedestrian.pos || pedestrian.pos.z > (targetMesh.position.z + 300)) {
        pedestrian.pos = new Vector3(pick([-6, 6]), 1, targetMesh.position.z - 200);
    }
    cam.position.copy(pedestrian.pos);
    cam.lookAt(targetMesh.position);
}

export function updateFirstPersonCam(targetMesh: Object3D, cam: Camera): void {
    // TODO copy rotation from the car, not just position!
    // cam.quaternion.copy(targetMesh.quaternion);
    cam.position.copy(targetMesh.position);
    cam.position.add(new Vector3(0, 1, 0));
    const carPos = targetMesh.position;
    const target = new Vector3(carPos.x, carPos.y + 1, carPos.z - 100);
    cam.lookAt(target);
}


export function updateRearFacingCam(targetMesh: Object3D, cam: Camera, shakeAmount: number): void {
    cam.position.x = targetMesh.position.x;
    cam.position.y = 3;
    cam.position.z = targetMesh.position.z - 6;

    const targetPosition = targetMesh.position.clone();
    targetPosition.z += 200;
    cam.lookAt(targetPosition)
    const shake = randFloatSpread(0.2) * shakeAmount;
    cam.position.x += shake;
}