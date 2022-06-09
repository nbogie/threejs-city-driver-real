//These are not good, just temporary.
//Prefer instead something like https://github.com/mattdesl/canvas-sketch-util

import { Mesh, Scene } from "three";


/** Convert given position from radius and angle form to {x, y} coordinates. */
export function polarToCartesian(radius: number, angle: number): { x: number, y: number } {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
        x,
        y
    };
}

/** snap (quantise) given value to nearest multiple (positive or negative) of the given increment. */
export function snap(value: number, increment: number): number {
    return Math.round(value / increment) * increment;
}


export function removeObjectFromScene(object: Mesh, scene: Scene): void {
    object.geometry.dispose();
    (Array.isArray(object.material) ? object.material : [object.material]).map(m => m.dispose());
    scene.remove(object);
}