import { PerspectiveCamera, WebGLRenderer } from "three";

export function setupRenderer(camera: PerspectiveCamera, dim: { w: number, h: number }): WebGLRenderer {

    const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(dim.w, dim.h);

    //Add the canvas (created by the renderer) to the end of the html page's body
    document.body.appendChild(renderer.domElement);



    //Register what to do if the window gets resized
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        dim.w = window.innerWidth;
        dim.h = window.innerHeight;

        camera.aspect = getAspect(dim);
        camera.updateProjectionMatrix();

        renderer.setSize(dim.w, dim.h);
    }

    return renderer;
}

export function getAspect(dim: { w: number, h: number }): number {
    return dim.w / dim.h;
}

