import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";

export function createSky(): Mesh {
    const geometry = new BoxGeometry(400, 600, 1);
    geometry.translate(0, 0, -540);
    const material = new MeshBasicMaterial({
        color: 0x7ec0ee
    });

    const mesh = new Mesh(geometry, material);

    return mesh;
}