import { BoxGeometry, Color, Group, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";
import { rand } from "./util";

let particles: Mesh[] = [];

// interface Particle {
//     life: number;
//     rotationSpeedX: number;
//     rotationSpeedY: number;
// }
//shared with ALL particles.  Performance optimisation.
const particleGeometryShared = new BoxGeometry(1, 1, 1);


export function emitSmokeParticle(scene: Scene, model: Group, deltaX: number, isFront: boolean): void {
    const isLeftWheel = deltaX > 0;
    //TODO: inefficient.  store these object references when car loaded.
    const sideChar = isLeftWheel ? "l" : "r";
    const endChar = isFront ? "f" : "b";
    const wheelName = `wheel_${endChar}${sideChar}`;
    const wheel = model.getObjectByName(wheelName);
    if (wheel) {
        const wheelWorldPos = new Vector3(0, 0, 0);
        wheel.getWorldPosition(wheelWorldPos)
        if (!isFront) {
            wheelWorldPos.z += 0.5;
        }
        createParticles(scene, wheelWorldPos, 3);
    }
}

export function createParticles(scene: Scene, position: Vector3, numOfParticles: number, hue: number | null = null): void {
    for (let i = 0; i < numOfParticles; i++) {
        const particle = createParticle(position, hue);
        scene.add(particle);
        particles.push(particle);
    }
}


export function createParticle(position: Vector3, hue: number | null = null): Mesh {
    const size = rand(0.05, 0.5);
    const geometry = particleGeometryShared;

    //TODO: reuse this material
    const colour = hue === null ? 0xffffff : new Color(`hsl(${hue}, 100%, 50%)`);
    const opacity = hue === null ? 0.6 : 1;
    const transparent = hue === null;
    const material = new MeshLambertMaterial({
        color: colour,
        opacity,
        transparent
    });

    const mesh = new Mesh(geometry, material);
    mesh.scale.set(size, size, size);
    const pos = position.clone();
    pos.z += rand(0, 2);

    mesh.position.copy(pos);
    mesh.rotation.x = Math.random() * Math.PI * 2;
    mesh.rotation.y = Math.random() * Math.PI * 2;
    //TODO: put these on userData
    mesh.userData.life = rand(40, 70);
    mesh.userData.rotationSpeedX = rand(-0.03, 0.03);
    mesh.userData.rotationSpeedY = rand(-0.03, 0.03);

    return mesh;
}

export function updateSmokeParticles(): void {
    for (const p of particles) {
        p.position.y += 0.01;
        p.position.z -= 0.04;
        p.rotation.x += p.userData.rotationSpeedX;
        p.rotation.y += p.userData.rotationSpeedY
        p.scale.multiplyScalar(1.01);
        p.userData.life -= 1;
    }
}

export function deleteSmokeParticles(scene: Scene): void {
    const particlesToRemove = particles.filter(p => p.userData.life <= 0);
    particlesToRemove.forEach(p => removeObjectFromScene(p, scene));

    particles = particles.filter(p => p.userData.life > 0);
}

export function removeObjectFromScene(object: Mesh, scene: Scene): void {
    object.geometry.dispose();
    (Array.isArray(object.material) ? object.material : [object.material]).map(m => m.dispose());
    scene.remove(object);
}