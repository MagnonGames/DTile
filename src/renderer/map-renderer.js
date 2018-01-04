import {
    Group
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
