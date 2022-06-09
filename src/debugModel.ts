import { Object3D } from "three";

/** Given an Object3D (e.g. a mesh, or a group), report its hierarchy of children,
 *  if any, to the console.  */
export function dumpObjectToConsoleAsString(root: Object3D): void {
    console.log(dumpObjectToTextLines(root).join("\n"))
}

//This function taken directly from greggman's excellent three.js fundamentals documentation: 
// https://threejs.org/manual/#en/load-gltf
//
//You don't have to worry about how this function works, at all.
export function dumpObjectToTextLines(obj: Object3D, lines: string[] = [], isLast = true, prefix = ''): string[] {
    if (!obj || !obj.children) {
        return lines;
    }
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObjectToTextLines(child, lines, isLast, newPrefix);
    });
    return lines;
}
