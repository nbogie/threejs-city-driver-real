import { Scene, AxesHelper, GridHelper } from "three";

export function setupHelpers(scene: Scene): void {
    const axesHelper = new AxesHelper(2);
    axesHelper.position.set(-8, 6, 0); //lift up from grid for visibility
    scene.add(axesHelper);
    const gridHelper = new GridHelper(100);
    // gridHelper.position.y = 1;
    scene.add(gridHelper);
}