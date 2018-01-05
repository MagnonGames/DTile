import {
    Group, Plane, Vector3
} from "../../node_modules/three/build/three.module.js";

export default class MapRenderer {
    constructor(tilesets, group) {
        this._tilesets = tilesets;
        this.layers = [];
        this.group = group;
    }

    set map(mapInfo) {
        this._map = mapInfo;

        this._regenerateMeshes();
    }

    set tilesets(tilesets) {
        this._tilesets = tilesets;

        this._regenerateMeshes();
    }

    // Returns tile { x, y } or null
    castRayOnLayer(layer, ray) {
        // layer is ignored for now but once DTile goes 3D, it's gonna be used
        // to raise or lower the plane, alternatively selecting an actualy 3D
        // object on a specific layer.
        const plane = new Plane(new Vector3(0, 0, 1), 0);

        const intersection = ray.intersectPlane(plane);

        if (intersection) {
            const tilePosition = {
                x: intersection.x + this._map.width / 2 - 0.5,
                y: -(intersection.y - this._map.height / 2) - 0.5
            };
            console.log(tilePosition);
            return tilePosition;
        } else {
            return null;
        }
    }

    _regenerateMeshes() {
        if (!this._map || !this._tilesets) return;

        const { width, height } = this._map;

        this.layers = this._map.layers.map(layer => {
            const group = new Group();

            layer.tiles.forEach(({ tileId, tilesetId }, i) => {
                const x = Math.floor(i % width);
                const y = Math.floor(i / width);

                const tileset = this._tilesets[tilesetId];
                if (!tileset) return;
                const tileMesh = tileset.meshes[tileId];
                if (!tileMesh) return;
                const mesh = tileMesh.clone();

                mesh.position.set(x - width / 2, (-y + height) - height / 2, 0);

                group.add(mesh);
            });

            return group;
        });

        this.group.children = [];
        this.layers.forEach(layer => this.group.add(layer));
    }
}
