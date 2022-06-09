import { Mesh, BoxGeometry, MeshLambertMaterial, Vector3, Scene, MeshBasicMaterial } from "three";
import { randomColour } from "./colours";
import { pick } from "./randomUtils";
import { rand } from "./util";


const buildings: Mesh[] = [];
const roadStripes: Mesh[] = [];

export function createCity(scene: Scene, numOfBuildings: number): void {
    for (let i = 0; i < numOfBuildings; i++) {
        const building = createBuilding();
        scene.add(building);
        buildings.push(building);
    }
}

export function updateBuildingsFromHeaven(carPos: Vector3): void {
    const growthLimitNear = carPos.z - 200;
    const growthLimitFar = carPos.z - 300;
    for (const b of buildings) {
        if (b.position.z < growthLimitNear &&
            b.position.z > growthLimitFar) {

            const zFraction = (growthLimitNear - growthLimitFar) /
                (b.position.z - growthLimitFar);
            b.scale.y = zFraction;

        }
    }
}

export function updateBuildingsHill(carPos: Vector3): void {
    const growthLimitNear = carPos.z - 150;
    const growthLimitFar = carPos.z - 300;

    for (const b of buildings) {
        b.visible = b.position.z > growthLimitFar;
        if (b.position.z < growthLimitNear &&
            b.position.z > growthLimitFar) {
            const zFraction = (b.position.z - growthLimitFar) /
                (growthLimitNear - growthLimitFar);
            b.scale.y = zFraction;

        }
    }
}

export function updateBuildings(carPos: Vector3): void {
    const growthLimitNear = carPos.z - 225;
    const growthLimitFar = carPos.z - 300;
    for (const b of buildings) {
        b.visible = b.position.z > growthLimitFar

        if (b.position.z < growthLimitNear &&
            b.position.z > growthLimitFar) {

            const zFraction = (b.position.z - growthLimitFar) /
                (growthLimitNear - growthLimitFar);

            // zFraction = snap(zFraction, 0.1);
            b.scale.y = zFraction;

        }
    }
}

export function createBuilding(): Mesh {
    const height = rand(2, 20);
    // TODO reuse box' geometry for all buildings
    const geometry = new BoxGeometry(rand(1, 4),
        height,
        rand(1, 4));
    // make the geometry's origin be the building's base.
    // not its centre (which is default)
    geometry.translate(0, height / 2, 0);
    const material = new MeshLambertMaterial({
        color: randomColour()
    });

    const mesh = new Mesh(geometry, material);

    const x = pick([-1, 1]) * rand(6, 30);
    const z = rand(10, -300);

    const pos = new Vector3(x, 0, z);

    mesh.position.copy(pos);
    // mesh.scale.set(rand(0.3, 1.2), rand(0.3, 1.2), rand(0.3, 1.2));
    return mesh;
}

export function recycleBuildings(carPos: Vector3): void {
    for (const b of buildings) {
        if (b.position.z - 30 > carPos.z) {
            //TODO: change colour, dimensions, and x position, too.
            b.position.z = carPos.z - 300;
        }
    }
}

export function createRoad(): Mesh {
    const geometry = new BoxGeometry(8, 0.02, 400);
    geometry.translate(0, 0, -140);
    const material = new MeshLambertMaterial({
        color: 0x606060
    });

    const mesh = new Mesh(geometry, material);

    return mesh;
}

export function createRoadStripes(scene: Scene, length: number): void {
    const numOfStripes = 540 / length;

    for (let i = 0; i < numOfStripes; i += 2) {
        const startPos = length * i + length;
        const roadStripe = createRoadStripe(length, startPos);
        scene.add(roadStripe);
        roadStripes.push(roadStripe);
    }
}

export function createRoadStripe(length: number | undefined, startPos: number): Mesh {
    const geometry = new BoxGeometry(0.4, 0.021, length);
    const material = new MeshBasicMaterial({
        color: 0xffffff
    })

    const mesh = new Mesh(geometry, material);

    const pos = new Vector3(0, 0, -startPos);

    mesh.position.copy(pos);

    return mesh;
}

export function recycleRoadStripes(carPos: Vector3): void {
    for (const rs of roadStripes) {
        if (rs.position.z - 100 > carPos.z) {
            rs.position.z = carPos.z - 400;
        }
    }
}

export function createGroundPlane(): Mesh {
    const geometry = new BoxGeometry(480, 0.01, 400);
    geometry.translate(0, 0, -140);
    const material = new MeshLambertMaterial({
        color: 0xffffff
    });

    const mesh = new Mesh(geometry, material);

    return mesh;
}