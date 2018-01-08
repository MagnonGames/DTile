import {
    BoxGeometry, PlaneGeometry,
    MeshBasicMaterial, ShaderMaterial,
    Mesh, TextureLoader, NearestFilter
} from "../../node_modules/three/build/three.module.js";

import { getTileUv } from "./tileset.js";

export const ObjectType = {
    CUBE: "cube",
    PLANE: "plane"
};

export class RenderObject {
    constructor(type, params, parent) {
        this._parent = parent;
        this._object3D = makeObject3D(type, params);

        const x = (params.x || 0) - 0.5;
        const y = (params.y || 0) + 0.5;
        const z = (params.z || 0) - 0.5;
        const width = params.width || 1;
        const height = params.height || 1;
        const depth = params.depth || 1;

        this.object3D.position.set(x + width / 2, y - height / 2, z + depth / 2);
        this.object3D.scale.set(params.width || 1, params.height || 1, params.depth || 1);
        this._parent.add(this._object3D);
    }

    get object3D() {
        return this._object3D;
    }

    removeSelf() {
        this._parent.remove(this.object3D);
    }
}

const loadedTextures = new Map();

function makeObject3D(type, params) {
    let uv, mesh;

    if (params.material.map) {
        const { texture, textureSize, gridSize, subSprite } = params.material.map;
        let tex = loadedTextures.get(texture);
        if (!tex) {
            tex = new TextureLoader().load(texture);
            tex.minFilter = tex.magFilter = NearestFilter;
            loadedTextures.set(texture, tex);
        }

        params.material.map = tex;
        uv = getTileUv(subSprite, textureSize[0], textureSize[1], gridSize[0], gridSize[1]);
    }

    const material = new ((() => {
        if (params.useShaderMaterial) {
            return ShaderMaterial;
        } else {
            return MeshBasicMaterial;
        }
    })())(params.material);

    if (type === ObjectType.CUBE) {
        const {
            width, height, depth,
            widthSegments, heightSegments, depthSegments
        } = (params.geometry || {});

        mesh = new Mesh(
            new BoxGeometry(
                width, height, depth,
                widthSegments, heightSegments, depthSegments
            ),
            material
        );
    } else if (type === ObjectType.PLANE) {
        const {
            width, height, widthSegments, heightSegments
        } = (params.geometry || {});

        mesh = new Mesh(
            new PlaneGeometry(width, height, widthSegments, heightSegments),
            material
        );
    }

    if (uv) {
        mesh.geometry.faceVertexUvs = [uv];
        mesh.geometry.uvsNeedUpdate = true;
    }

    return mesh;
}
