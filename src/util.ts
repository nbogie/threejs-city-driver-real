//These are not good, just temporary.
//Prefer instead something like https://github.com/mattdesl/canvas-sketch-util


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

