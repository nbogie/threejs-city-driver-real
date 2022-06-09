//These are not good, just temporary.
//Prefer instead something like https://github.com/mattdesl/canvas-sketch-util

import { Vector3 } from "three";


export function randomPosition(): Vector3 {
    return new Vector3(rand(-10, 10), rand(-10, 10), rand(-10, 10));
}

export function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
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

