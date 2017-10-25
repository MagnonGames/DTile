import {
    Mesh, MeshBasicMaterial, BoxGeometry
} from "../../node_modules/three/build/three.module.js";

const material = new MeshBasicMaterial({ transparent: true, opacity: 0.5, color: 0x00e5ff });

export class RenderMapObject extends Mesh {
    constructor(renderer, object) {
        const x = object.x * renderer.tileSize.x;
        const y = object.y * renderer.tileSize.y;
        const width = object.width * renderer.tileSize.x;
        const height = object.height * renderer.tileSize.y;

        const geometry = new BoxGeometry(width, height, 0.5);
        geometry.rotateZ(Math.PI);
        geometry.translate(width * 0.5, height * 0.5, 0);

        super(geometry, material.clone());

        this.position.set(x, y, 1);

        this._renderer = renderer;
        this._object = object;
    }

    get mapObject() {
        return this._object;
    }
}
