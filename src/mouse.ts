import { mapLinear } from "three/src/math/MathUtils";

/** 
 * Details of current mouse state.
 * 
 * x and y range are both from -0.5 to 0.5
 * */
export interface Mouse {
    x: number;
    y: number;
    leftButtonDown: boolean;
    rightButtonDown: boolean;
}
/** Set up and return a Mouse object that will be updated by events on the given canvas, 
 * and which provides x, y and button info.
 * 
 * mouse.x and mouse.y are both normalised to be between -0.5 and 0.5 */
export function setupMouse(canvasElem: HTMLCanvasElement): Mouse {

    const mouse: Mouse = {
        x: 0,
        y: 0,
        leftButtonDown: false,
        rightButtonDown: false
    }
    canvasElem.addEventListener('mousemove', handleMouseMove);
    canvasElem.addEventListener('mousedown', handleMouseDown);
    canvasElem.addEventListener('mouseup', handleMouseUp);

    function handleMouseMove(event: MouseEvent) {
        mouse.y = mapLinear(event.clientY, 0, canvasElem.width, -0.5, 0.5);
        mouse.x = mapLinear(event.clientX, 0, canvasElem.height, -0.5, 0.5);
    }

    function handleMouseDown(ev: MouseEvent) {
        if (ev.button === 0) {
            mouse.leftButtonDown = true;
        }
        if (ev.button === 2) {
            mouse.rightButtonDown = true;
        }
    }

    function handleMouseUp(ev: MouseEvent) {
        if (ev.button === 0) {
            mouse.leftButtonDown = false;
        }
        if (ev.button === 2) {
            mouse.rightButtonDown = false;
        }
    }

    //don't trigger right-mouse-button context menu
    canvasElem.oncontextmenu = function () {
        return false;
    }
    return mouse;
}
