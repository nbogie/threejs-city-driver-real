import { Group } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

//A good place to start reading is: 
//https://threejs.org/manual/#en/load-gltf
export async function loadModel(url: string): Promise<Group | null> {
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data - only some gltf files need this.
    const dracoLoader = new DRACOLoader();
    //From a CDN.  We ought instead to take this from the local installed modules, but with parcel bundler, that's complex.
    //Note this is a specific version.
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.2/');
    loader.setDRACOLoader(dracoLoader);

    try {
        console.log('Attempting to load model: ', url)
        // const realURL = new URL(url, import.meta.url);
        const loadedGLTF = await loader.loadAsync(url);
        console.log("loaded model: ", url)
        const model = loadedGLTF.scene;
        return model;
    } catch (err) {
        console.error(`ERROR loading ${url}`, err)
        return null;
    }
}