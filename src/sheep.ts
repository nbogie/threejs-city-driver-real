import { Object3D, Scene, Vector3 } from "three";
import { loadModel } from "./loadModel";
import { createParticles } from "./smoke";
import { rand } from "./util";

// this tab copied from https://www.openprocessing.org/sketch/1028620
const sheepies: Sheepie[] = [];
interface Sheepie {
    mesh: Object3D,
    velocity: Vector3,
    isDynamic: boolean,
    hue: number
}
export async function createSheepies(scene: Scene): Promise<void> {
    //todo: i think we should use Instanced mesh to share the geometry across all sheep meshes
    //https://threejs.org/docs/#api/en/objects/InstancedMesh

    const sheepMesh = await loadModel("./assets/sheep.glb");

    //dev: check what submeshes the sheep model has...
    //console.log(loadedMesh.children[0].children.map(c => c.name));
    if (!sheepMesh) {
        throw new Error("couldn't load sheep model")
    }

    for (let i = 0; i < 20; i++) {
        const clone = sheepMesh.clone(true);
        resetSheepMesh(clone);
        const sheepObj: Sheepie = {
            mesh: clone,
            velocity: new Vector3(0, 0, 0),
            isDynamic: false,//true if we need to apply physics to this sheep...
            hue: 0
        };
        scene.add(clone);
        sheepies.push(sheepObj);
    }
}

export function updateSheepies(carPosition: Vector3, cleanupPosition: Vector3, {
    shakeCamera
}: { shakeCamera: () => void }, scene: Scene): void {

    const gravityAccel = new Vector3(0, -0.1, 0);
    for (const sheep of sheepies) {
        if (sheep.isDynamic) {
            sheep.velocity.add(gravityAccel);
            sheep.mesh.position.add(sheep.velocity);
            sheep.hue = (sheep.hue + 20) % 360;
            createParticles(scene, sheep.mesh.position, 3, sheep.hue);

            if (sheep.mesh.position.y < 0) {
                respawnSheep(sheep, cleanupPosition);
                continue;
            }
        }

        const carBumperPosition = carPosition.clone();
        carBumperPosition.z -= 1;
        carBumperPosition.y += 0.4;
        if (sheep.mesh.position.distanceTo(carBumperPosition) < 20 &&
            Math.abs(sheep.mesh.position.x - carPosition.x) < 1) {

            const config: PartsVisibilities = [
                ["eyes_alarmed", true],
                ["legs_alarmed", true],
                ["eyes_sleepy", false],
                ["legs_sleepy", false],
            ];

            setPartsVisibility(config, sheep.mesh);
        }

        if (sheep.mesh.position.distanceTo(carPosition) < 1) {
            hitSheep(sheep, {
                shakeCamera
            });
        }

        if (sheep.mesh.position.z - 30 > cleanupPosition.z) {
            respawnSheep(sheep, cleanupPosition);

        }
    }
}

export function farthestAirborneSheep(): Sheepie | null {
    let farthest = null;
    for (const sheep of sheepies) {
        if (sheep.isDynamic && (farthest === null || sheep.mesh.position.z < farthest.mesh.position.z)) {
            farthest = sheep;
        }
    }
    return farthest;
}

export function hitSheep(sheep: Sheepie, {
    shakeCamera
}: { shakeCamera: (amt: number) => void }): void {
    const config: PartsVisibilities = [
        ["eyes_alarmed", true],
        ["legs_alarmed", true],
        ["eyes_sleepy", false],
        ["legs_sleepy", false],
    ];

    setPartsVisibility(config, sheep.mesh);

    sheep.hue = rand(0, 360);

    //pop up into the air a little
    sheep.mesh.position.y += 2;
    //assume awkward rotation (we will not spin during flight)
    sheep.mesh.rotation.z = Math.random() * Math.PI;
    sheep.mesh.rotation.x = Math.random() * Math.PI;
    //prepare for take-off...
    sheep.isDynamic = true;
    sheep.velocity.set(rand(-1, 1), rand(1, 4), rand(-2, -3));
    //todo: use the car's velocity and positioning to allow skill-booping the sheep into outer space / onto targets

    shakeCamera(2); //todo: shake according to sheep size?  e.g. sheep.mesh.scale.x ?
}


export function respawnSheep(sheep: Sheepie, playerPos: Vector3): void {
    sheep.isDynamic = false;
    sheep.velocity.set(0, 0, 0);

    resetSheepMesh(sheep.mesh);
    sheep.mesh.position.z = playerPos.z - rand(200, 300);
}

type PartsVisibilities = [string, boolean][]
export function resetSheepMesh(mesh: Object3D): void {
    const scale = rand(1.5, 2.5);
    mesh.scale.set(scale, scale, scale);
    //this model has optional parts - two sets of eyes and legs for state. (*should really be done as an animation in gltf...)

    const config: PartsVisibilities = [
        ["eyes_alarmed", false],
        ["legs_alarmed", false],
        ["eyes_sleepy", true],
        ["legs_sleepy", true],
    ];

    setPartsVisibility(config, mesh);
    mesh.position.copy(randomSheepPosition());
    mesh.rotation.set(0, 0, 0);
    mesh.rotation.y = rand(-1, 1) * Math.PI / 4;

}

function setPartsVisibility(config: PartsVisibilities, mesh: Object3D) {
    for (const [partName, visibility] of config) {
        const part = mesh.getObjectByName(partName);
        if (part) {
            part.visible = visibility;
        }
    }

}


export function randomSheepPosition(): Vector3 {
    return new Vector3(rand(-1, 1) * 6, 0, rand(-300, 0));
}