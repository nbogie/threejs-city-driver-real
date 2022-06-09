import { PerspectiveCamera } from "three";
import { getAspect } from "./setupRenderer";

export function setupCamera(dim: { w: number, h: number }): PerspectiveCamera {

    const camera: PerspectiveCamera = new PerspectiveCamera(75, getAspect(dim), 0.1, 1000);

    camera.position.set(7, 6, 10);

    return camera;
}