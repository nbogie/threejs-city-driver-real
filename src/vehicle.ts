import { BoxGeometry, MeshLambertMaterial, Mesh, Vector3, Group, Scene } from "three";
import { lerp, mapLinear, randFloatSpread } from "three/src/math/MathUtils";
import { randomColour } from "./colours";
import { loadModel } from "./loadModel";
import { Mouse } from "./mouse";
import { emitSmokeParticle } from "./smoke";

const carMaxSpeed = 1.1;

export interface Car {
    mesh: Mesh;
    vel: Vector3;
    acc: Vector3;
    availableAccel: number;
    dragsterModel: Group;
}

export async function createVehicle(scene: Scene): Promise<Car> {
    const geometry = new BoxGeometry(1, 0.5, 3);

    const material = new MeshLambertMaterial({
        color: randomColour()
    });

    const mesh = new Mesh(geometry, material);
    const dragsterModel = await loadCarModel(scene);

    const car = {
        mesh,
        vel: new Vector3(0, 0, -carMaxSpeed),
        availableAccel: 0.2,
        acc: new Vector3(0, 0, 0),
        dragsterModel
    }
    return car;
}

export async function loadCarModel(scene: Scene): Promise<Group> {
    const url = "./assets/dragster.glb";
    const dragsterModel = await loadModel(url)
    if (!dragsterModel) {
        throw new Error("error loading dragster model  from " + url);
    }
    dragsterModel.rotation.y = Math.PI;
    scene.add(dragsterModel);
    return dragsterModel;
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

    // myVehicle.mesh.position.y = mouse.y;
    const desiredCarX = mapLinear(mouse.x, -0.5, 0.5, -3, 3);
    // const desiredCarY = mapLinear(mouse.y, -0.5, 0.5, 5, 0);
    myVehicle.mesh.position.x = lerp(myVehicle.mesh.position.x, desiredCarX, 0.1);
    // myVehicle.mesh.position.y = lerp(myVehicle.mesh.position.y, desiredCarY, 0.1);

    const deltaX = desiredCarX - myVehicle.mesh.position.x;
    const rollAngle = mapLinear(deltaX, -6, 6, Math.PI / 6, -Math.PI / 6);
    const yawAngle = Math.PI + rollAngle;
    const pitchAngle = mapLinear(myVehicle.acc.z, 0.2, -0.2, -1, 1) * Math.PI / 16;
    const dragsterModel = myVehicle.dragsterModel;

    dragsterModel.position.copy(myVehicle.mesh.position);

    dragsterModel.rotation.z = rollAngle;
    dragsterModel.rotation.y = yawAngle;
    dragsterModel.rotation.x = pitchAngle;
    myVehicle.mesh.rotation.z = rollAngle;
    myVehicle.mesh.rotation.y = Math.PI + rollAngle;

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
    if (myVehicle.vel.length() > 0.8 && (deltaX > 1 || deltaX < -1) && dragsterModel) {
        // it should emit particles from the outside wheel
        // myVehicle.mesh.visible = true;

        emitSmokeParticle(scene, dragsterModel, deltaX, false);
    } else {
        // myVehicle.mesh.visible = false;
    }
}