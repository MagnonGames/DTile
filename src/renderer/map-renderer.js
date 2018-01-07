import {
    Group, Plane, Vector3
} from "../../node_modules/three/build/three.module.js";

export default class MapRenderer {
    constructor(tilesets, group) {
        this._tilesets = tilesets;

        this.layers = [];
        this.group = group;

        this._mapGroup = new Group();
        this._ghostGroup = new Group();

        this.group.add(this._mapGroup);
        this.group.add(this._ghostGroup);
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
                x: intersection.x + this._map.width / 2,
                y: -(intersection.y - this._map.height / 2)
            };
            return tilePosition;
        } else {
            return null;
        }
    }

    setGhosts(ghosts) {
        this._ghostGroup.children = [];

        this._map.layers.forEach((l, layerIndex) => l.tiles.forEach((tile, tileIndex) => {
            const ghost = (ghosts[layerIndex] || [])[tileIndex];
            const tileMesh = this._mapGroup.children[layerIndex].children
                .find(tileMesh => tileMesh.name === tileIndex);

            const ghostDefined = ghost && ghost.tilesetId >= 0 && ghost.tileId >= 0;

            if (ghostDefined) {
                const ghostDifferent =
                    !tile ||
                    ghost.tilesetId !== tile.tilesetId ||
                    ghost.tileId !== tile.tileId;

                if (ghostDifferent) {
                    if (tileMesh) {
                        tileMesh.visible = false;
                    }

                    const mesh = this._getTileMesh(
                        ghost.tilesetId,
                        ghost.tileId,
                        tileIndex
                    );
                    if (mesh) {
                        mesh.material = mesh.material.clone();
                        mesh.material.opacity = 0.7;

                        this._ghostGroup.add(mesh);

                        return;
                    }
                }
            }
            if (tileMesh) {
                tileMesh.visible = true;
            }
        }));
    }

    _regenerateMeshes() {
        if (!this._map || !this._tilesets) return;

        this.layers = this._map.layers.map((layer, layerIndex) => {
            const group = new Group();

            layer.tiles.forEach(({ tileId, tilesetId }, i) => {
                const mesh = this._getTileMesh(tilesetId, tileId, i);
                if (mesh) {
                    mesh.name = i;
                    group.add(mesh);
                }
            });

            return group;
        });

        this._mapGroup.remove(...this._mapGroup.children);
        this.layers.forEach(layer => this._mapGroup.add(layer));
    }

    _getTileMesh(tilesetId, tileId, mapTileIndex) {
        const tileset = this._tilesets[tilesetId];
        if (!tileset) return;
        const tileMesh = tileset.meshes[tileId];
        if (!tileMesh) return;
        const mesh = tileMesh.clone();

        const width = parseInt(this._map.width);
        const height = parseInt(this._map.height);

        const x = Math.floor(mapTileIndex % width);
        const y = Math.floor(mapTileIndex / width);

        mesh.position.set(x - width / 2 + 0.5, (-y + height) - height / 2 - 0.5, 0);

        return mesh;
    }
}
