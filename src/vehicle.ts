import { Group, Object3D, Scene, Vector3 } from "three";
import { lerp, mapLinear, randFloatSpread } from "three/src/math/MathUtils";
import { loadModel } from "./loadModel";
import { Mouse } from "./mouse";
import { emitSmokeParticle } from "./smoke";

const carMaxSpeed = 1.1;
export type WheelIndex = "frontLeft" | "frontRight" | "backLeft" | "backRight";

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

    //Find the wheels sub-objects and cache references to them in userData, 
    //rather than search for them each frame.
    const wheels: Record<WheelIndex, Object3D> = {
        frontLeft: getChildObjectByNameOrFail(carModel, "wheel_fl"),
        frontRight: getChildObjectByNameOrFail(carModel, "wheel_fr"),
        backLeft: getChildObjectByNameOrFail(carModel, "wheel_bl"),
        backRight: getChildObjectByNameOrFail(carModel, "wheel_br"),
    }
    function getChildObjectByNameOrFail(parent: Group, partName: string): Object3D {
        const part = parent.getObjectByName(partName);
        if (!part) {
            throw new Error("missing part in car model: " + partName);
        }
        return part;
    }
    carModel.userData.wheels = wheels;

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
    const desiredCarY = myVehicle.isFlying ? mapLinear(mouse.y, -0.5, 0.5, 8, 0) : 0;
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
    const wheels: Object3D[] = Object.values(dragsterModel.userData.wheels)

    for (const wheel of wheels) {
        wheel.rotation.x += wheelAngle
    }

    // if car is going fast and turning fast
    if (myVehicle.vel.length() > 0.8 && (deltaX > 1 || deltaX < -1)) {
        // it should emit particles from the outside wheel
        emitSmokeParticle(scene, dragsterModel, deltaX, false);
    }
}