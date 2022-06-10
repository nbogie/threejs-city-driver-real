import { BoxGeometry, BufferGeometry, CylinderGeometry, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial, Scene, Vector3 } from "three";
import { randFloat } from 'three/src/math/MathUtils';
import { randomColour } from "./colours";
import { pick } from "./randomUtils";

export function createCity(scene: Scene, numOfBuildings: number): Mesh[] {
    const buildings = [];
    for (let i = 0; i < numOfBuildings; i++) {
        const building = createBuilding();
        scene.add(building);
        buildings.push(building);
    }
    return buildings;
}

export function updateBuildingsFromHeaven(buildings: Mesh[], carPos: Vector3): void {
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

export function updateBuildingsHill(buildings: Mesh[], carPos: Vector3): void {
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

export function updateBuildings(buildings: Mesh[], carPos: Vector3): void {
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
    const height = randFloat(2, 20);
    // TODO reuse box' geometry for all buildings
    const radius = randFloat(0.5, 2);
    const isCyl = Math.random() < 0.5;
    const geometry = isCyl ? new CylinderGeometry(radius, radius, height, 8) : new BoxGeometry(randFloat(1, 4), height, randFloat(1, 4));
    // make the geometry's origin be the building's base.
    // not its centre (which is default)
    geometry.translate(0, height / 2, 0);
    const material = new MeshStandardMaterial({
        color: randomColour(),
        flatShading: true
    });

    const mesh = new Mesh(geometry, material);

    const x = pick([-1, 1]) * randFloat(6, 30);
    const z = randFloat(10, -300);

    const pos = new Vector3(x, 0, z);

    mesh.position.copy(pos);
    // mesh.scale.set(randFloat(0.3, 1.2), randFloat(0.3, 1.2), randFloat(0.3, 1.2));
    return mesh;
}

export function recycleBuildings(buildings: Mesh[], carPos: Vector3): void {
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

export function createRoadStripes(scene: Scene, length: number): Mesh[] {
    const roadStripes: Mesh[] = [];
    const numOfStripes = 540 / length;
    const geometry = new BoxGeometry(0.4, 0.021, length);
    const material = new MeshBasicMaterial({//consider material that responds to light, instead 
        color: 0xffffff
    })
    for (let i = 0; i < numOfStripes; i += 2) {
        const startPos = length * i + length;
        const roadStripe = createRoadStripe(startPos, geometry, material);
        scene.add(roadStripe);
        roadStripes.push(roadStripe);
    }
    return roadStripes;
}

function createRoadStripe(startPos: number, geometry: BufferGeometry, material: Material): Mesh {
    const mesh = new Mesh(geometry, material);
    mesh.position.set(0, 0, -startPos);
    return mesh;
}

export function recycleRoadStripes(roadStripes: Mesh[], carPos: Vector3): void {
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