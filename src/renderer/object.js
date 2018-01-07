import {
    BoxGeometry, MeshBasicMaterial, Mesh
} from "../../node_modules/three/build/three.module.js";

export const ObjectType = {
    CUBE: "cube"
};

export class RenderObject {
    constructor(type, params, parent) {
        this._parent = parent;

        const [geometry, Material] = (() => {
            if (type === ObjectType.CUBE) {
                const {
                    width, height, depth,
                    widthSegments, heightSegments, depthSegments
                } = (params.geometry || {});

                return [
                    new BoxGeometry(
                        width, height, depth,
                        widthSegments, heightSegments, depthSegments
                    ),
                    MeshBasicMaterial
                ];
            }
        })();

        const material = new Material(params.material);

        this._mesh = new Mesh(geometry, material);

        this._mesh.position.set(params.x || 0, params.y || 0, params.z || 0);

        this._parent.add(this._mesh);
    }

    get mesh() {
        return this._mesh;
    }

    removeSelf() {
        this._parent.remove(this._mesh);
    }
}
