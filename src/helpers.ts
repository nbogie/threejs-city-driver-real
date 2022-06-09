import { AxesHelper, GridHelper, Scene } from "three";

export function setupHelpers(scene: Scene): { axesHelper: AxesHelper, gridHelper: GridHelper } {
    const axesHelper = new AxesHelper(5);
    axesHelper.position.set(-8, 6, 0); //lift up from grid for visibility
    scene.add(axesHelper);
    const gridHelper = new GridHelper(100);

    // gridHelper.position.y = 1;
    scene.add(gridHelper);
    axesHelper.visible = false;
    gridHelper.visible = false;

    return { axesHelper, gridHelper }
}
