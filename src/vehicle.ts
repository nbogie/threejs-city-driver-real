import { Group, Scene, Vector3 } from "three";
import { lerp, mapLinear, randFloatSpread } from "three/src/math/MathUtils";
import { loadModel } from "./loadModel";
import { Mouse } from "./mouse";
import { emitSmokeParticle } from "./smoke";

const carMaxSpeed = 1.1;

export interface Car {
    mesh: Group;
    vel: Vector3;
    acc: Vector3;
    availableAccel: number;
    isFlying: boolean;
}

export async function createVehicle(scene: Scene): Promise<Car> {
    const dragsterModel = await loadCarModel(scene);

    const car = {
        mesh: dragsterModel,
        vel: new Vector3(0, 0, -carMaxSpeed),
        availableAccel: 0.2,
        acc: new Vector3(0, 0, 0),
        isFlying: false
    }
    return car;
}

export async function loadCarModel(scene: Scene): Promise<Group> {
    const url = "./assets/dragster.glb";
    const carModel = await loadModel(url)
    if (!carModel) {
        throw new Error("error loading car model from " + url);
    }
    carModel.rotation.y = Math.PI;
    scene.add(carModel);
    return carModel;
}

export function updateCar(mouse: Mouse, myVehicle: Car, scene: Scene): void {
    const isAccelerating = mouse.leftButtonDown && !mouse.rightButtonDown;

    const isBraking = mouse.rightButtonDown;

    if (isAccelerating) {
        myVehicle.acc.z = lerp(myVehicle.acc.z, -myVehicle.availableAccel, 0.1);
    } else if (isBraking) {
        const targetBraking = myVehicle.vel.z < 0 ? 0.03 : 0;
        myVehicle.acc.z = lerp(myVehicle.acc.z, targetBraking, 0.1);

    } else { //coasting
        myVehicle.acc.z = lerp(myVehicle.acc.z, 0, 0.1);
    }

    myVehicle.vel = myVehicle.vel.add(myVehicle.acc);
    myVehicle.vel = myVehicle.vel.multiplyScalar(0.995).clampScalar(-carMaxSpeed, 0);
    myVehicle.mesh.position.add(myVehicle.vel);

    const desiredCarX = mapLinear(mouse.x, -0.5, 0.5, -3, 3);
    const desiredCarY = myVehicle.isFlying ? mapLinear(mouse.y, -0.5, 0.5, 5, 0) : 0;
    myVehicle.mesh.position.x = lerp(myVehicle.mesh.position.x, desiredCarX, 0.1);
    myVehicle.mesh.position.y = lerp(myVehicle.mesh.position.y, desiredCarY, 0.1);

    const deltaX = desiredCarX - myVehicle.mesh.position.x;
    const rollAngle = mapLinear(deltaX, -6, 6, Math.PI / 6, -Math.PI / 6);
    const yawAngle = Math.PI + rollAngle;
    const pitchAngle = mapLinear(myVehicle.acc.z, 0.2, -0.2, -1, 1) * Math.PI / 16;
    const dragsterModel = myVehicle.mesh;

    dragsterModel.rotation.x = pitchAngle;
    dragsterModel.rotation.y = yawAngle;
    dragsterModel.rotation.z = rollAngle;


    if (isBraking && myVehicle.vel.length() > 0.2) {
        emitSmokeParticle(scene, dragsterModel, randFloatSpread(2), true);
    }
    // wheels rotation

    //todo: this shouldbe calculated based on circumference of wheel, and current speed
    const wheelAngle = mapLinear(myVehicle.vel.z, -carMaxSpeed, 0, Math.PI / 3, 0);

    const wheel_fl = dragsterModel.getObjectByName("wheel_fl");
    const wheel_br = dragsterModel.getObjectByName("wheel_br");
    const wheel_bl = dragsterModel.getObjectByName("wheel_bl");
    const wheel_fr = dragsterModel.getObjectByName("wheel_fr");
    for (const wheel of [wheel_fl, wheel_bl, wheel_br, wheel_fr]) {
        if (wheel) {
            wheel.rotation.x += wheelAngle
        }
    }


    // if car is going fast and turning fast
    if (myVehicle.vel.length() > 0.8 && (deltaX > 1 || deltaX < -1)) {
        // it should emit particles from the outside wheel
        // dragsterModel.visible = true;

        emitSmokeParticle(scene, dragsterModel, deltaX, false);
    } else {
        // dragsterModel.visible = false;
    }
}