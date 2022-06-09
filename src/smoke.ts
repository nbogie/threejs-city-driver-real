import { BoxGeometry, Color, Group, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";
import { randFloat, randFloatSpread } from "three/src/math/MathUtils";
import { removeObjectFromScene } from "./util";
import { WheelIndex } from "./vehicle";

let particles: ParticleMesh[] = [];
interface ParticleUserData {
    life: number;
    rotationSpeedX: number;
    rotationSpeedY: number;
}
interface ParticleMesh extends Mesh {
    userData: ParticleUserData;
}

// interface Particle {
//     life: number;
//     rotationSpeedX: number;
//     rotationSpeedY: number;
// }
//shared with ALL particles.  Performance optimisation.
const particleGeometryShared = new BoxGeometry(1, 1, 1);

export function emitSmokeParticle(scene: Scene, carModel: Group, deltaX: number, isFront: boolean): void {
    const isLeftWheel = deltaX > 0;
    const wheelIndex: WheelIndex = isLeftWheel ? (isFront ? "frontLeft" : "backLeft") : (isFront ? "backLeft" : "backRight")

    const wheel = carModel.userData.wheels[wheelIndex]
    console.assert(wheel, "Should be able to find wheel with index: " + wheelIndex)
    const wheelWorldPos = new Vector3(0, 0, 0);
    wheel.getWorldPosition(wheelWorldPos)
    if (!isFront) {
        wheelWorldPos.z += 0.5;
    }
    createParticles(scene, wheelWorldPos, 3);

}

export function createParticles(scene: Scene, position: Vector3, numOfParticles: number, hue: number | null = null): void {
    for (let i = 0; i < numOfParticles; i++) {
        const particle: ParticleMesh = createParticle(position, hue);
        scene.add(particle);
        particles.push(particle);
    }
}

export function createParticle(position: Vector3, hue: number | null = null): ParticleMesh {
    const size = randFloat(0.05, 0.5);
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
    pos.z += randFloat(0, 2);

    mesh.position.copy(pos);
    mesh.rotation.x = randFloat(0, Math.PI * 2);
    mesh.rotation.y = randFloat(0, Math.PI * 2);

    //TODO: do better!  Pushing through `unknown` gives us no checks of what's gone before.
    const particleMesh = mesh as unknown as ParticleMesh;
    particleMesh.userData.life = randFloat(40, 70);
    particleMesh.userData.rotationSpeedX = randFloatSpread(0.06);
    particleMesh.userData.rotationSpeedY = randFloatSpread(0.06);

    return particleMesh;
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
    //TODO: use pool of particles
    const particlesToRemove = particles.filter(p => p.userData.life <= 0);
    particlesToRemove.forEach(p => removeObjectFromScene(p, scene));

    particles = particles.filter(p => p.userData.life > 0);
}
