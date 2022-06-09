//These are not good, just temporary.
//Prefer instead something like https://github.com/mattdesl/canvas-sketch-util

import { Vector3 } from "three";
import { randFloatSpread } from "three/src/math/MathUtils";

export function randomPosition(): Vector3 {
    return new Vector3(randFloatSpread(20), randFloatSpread(20), randFloatSpread(20));
}

export function polarToCartesian(radius: number, angle: number): { x: number, y: number } {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
        x,
        y
    };
}

export function snap(number: number, inc: number): number {
    return Math.round(number / inc) * inc;
}

