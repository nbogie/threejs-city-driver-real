import { Audio, AudioListener, AudioLoader } from "three";

let sheepHitSound: Audio;

export function loadSounds(): void {
    // create an AudioListener and add it to the camera
    const listener = new AudioListener();
    // camera.add( listener );

    // create a global audio source
    sheepHitSound = new Audio(listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load('./assets/hit.ogg', function (buffer) {
        sheepHitSound.setBuffer(buffer);
        sheepHitSound.setLoop(false);
        sheepHitSound.setVolume(0.1);
    });
}

export function playSheepHitSound(): void {
    if (sheepHitSound.isPlaying) {
        sheepHitSound.stop();
    }
    sheepHitSound.play();
}