import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function setupEffectComposer(
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    scene: Scene): EffectComposer {

    //Simplified from this example
    //https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html

    //The default render of the scene.  our postprocessing pipeline will start with this.
    const renderPass = new RenderPass(scene, camera);

    //Define (but do not yet apply) a bloom effect (a glow/blur effect)
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.8;
    bloomPass.strength = 0.5
    bloomPass.radius = 0;

    //Compose a simple pipeline - our basic render then pass it through the bloom effect
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    return composer;
}