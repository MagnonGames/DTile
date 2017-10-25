import {
    Color
} from "../../node_modules/three/build/three.module.js";

export let tilesUpdated = 0;
export const resetTilesUpdated = () => (tilesUpdated = 0);

export class RenderTile {
    constructor(renderer) {
        this._renderer = renderer;

        this._triUpdatedCount = 0;
        this._previousState = null;

        this.tint = false;
        this._previousTint = {};

        this.uvs = [];
    }

    set tint(tint) {
        if (tint instanceof Color) this._tint = tint;
        else this._tint = new Color(tint || 0x000000);
    }
    get tint() { return this._tint; }

    update(tile) {
        this._tile = tile;

        const ghostDefined = this.ghost &&
            this.ghost.tileId >= 0 && this.ghost.tilesetId >= 0;

        this.currentTile = {
            tileId: ghostDefined ? this.ghost.tileId : this._tile.tileId,
            tilesetId: ghostDefined ? this.ghost.tilesetId : this._tile.tilesetId
        };

        this.opacity = !this.ghost || tileEqual(this.ghost, this._tile) ? 1 : 0.8;

        const sameTile = tileEqual(this.currentTile, this._previousTile);
        const sameOpacity = this.opacity === this._previousOpacity;
        const sameTint = this.tint.equals(this._previousTint);

        if (!sameTile || (!this._hasTileset && this.currentTile.tilesetId >= 0)) {
            tilesUpdated++;

            const tileset = this._renderer.getTileset(this.currentTile.tilesetId);
            if (tileset) {
                this.uvs = tileset.getTileUvs(this.currentTile.tileId);
                this._hasTileset = true;
            } else this._hasTileset = false;
        }

        if (!sameTile || !sameOpacity || !sameTint) this.triRenderCount = 0;

        this._previousTile = this.currentTile;
        this._previousOpacity = this.opacity;
        this._previousTint = this.tint;
    }
}

const tileEqual = (tile1 = {}, tile2 = {}) =>
    tile1.tileId === tile2.tileId && tile1.tilesetId === tile2.tilesetId;
