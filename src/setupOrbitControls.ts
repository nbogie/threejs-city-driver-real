import { Camera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


/** 
 * @param htmlElement - html (canvas?) element on which to listen for mouse events 
 * @param camera - camera to move, rotate and zoom based on user input
*/
export function setupOrbitControls(camera: Camera, htmlElement: HTMLElement): OrbitControls {

    const controls = new OrbitControls(camera, htmlElement);
    controls.autoRotate = false;
    controls.enableDamping = true;

    //IF you change the camera transform manually (e.g. position, orientation) you MUST call controls.update() after.
    // camera.position.set(0, 20, 100);
    // controls.update();

    return controls;
}