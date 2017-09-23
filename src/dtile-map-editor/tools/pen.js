/* globals TileTools */
(class Pen extends DTile.Tool {
    static get toolName() { return "pen"; }
    static get icon() { return "tool:pen"; }

    onMove({ tileX, tileY, shiftKey, button, previewTiles }) {
        this.doTap(tileX, tileY, shiftKey, button);
        previewTiles(this._tiles);
        this._tiles = {};
    }

    onTap({ tileX, tileY, shiftKey, button, commitTiles }) {
        this.doTap(tileX, tileY, shiftKey, button);
        commitTiles(this._tiles);
        this._tiles = {};
    }

    doTap(tileX, tileY, shiftKey, button) {
        const shouldRemove = button === 2;

        this._paintOrigin = { x: tileX, y: tileY };
        if (!shiftKey || !this._lastPaintPosition) {
            this._lastPaintPosition = { x: tileX, y: tileY };
        }
        this._paintTo(tileX, tileY, shouldRemove);
        this._lastPaintPosition = { x: tileX, y: tileY };
    }

    onTrack({ tileX, tileY, state, button, previewTiles, commitTiles }) {
        const shouldRemove = button === 2;

        if (state === "start") {
            this._tiles = {};
            this._paintOrigin = this._lastPaintPosition = { x: tileX, y: tileY };
            this._paintTo(tileX, tileY, shouldRemove);
        } else if (state === "track") {
            this._paintTo(tileX, tileY, shouldRemove);
            this._lastPaintPosition = { x: tileX, y: tileY };
            previewTiles(this._tiles);
        } else if (state === "end") {
            commitTiles(this._tiles);
            this._tiles = {};
        }
    }

    _paintAt(tileX, tileY, shouldRemove) {
        const map = this.currentMap;
        const tileArea = this.tileArea;

        const layerTileArea = this.layerAsTileArea;
        const newTiles = { ...this._tiles };

        for (let lx = 0; lx < (shouldRemove ? 1 : tileArea.width); lx++) {
            for (let ly = 0; ly < (shouldRemove ? 1 : tileArea.height); ly++) {
                const x = tileX + lx;
                const y = tileY + ly;
                const tile = shouldRemove
                    ? { tileId: -1, tilesetId: -1 }
                    : TileTools.getTilingTileData(
                        tileArea,
                        this._paintOrigin.x, this._paintOrigin.y,
                        x, y
                    );

                if (x < 0 || y < 0 || x >= map.width || y >= map.height ||
                    (!shouldRemove && tile.tileId === -1 || tile.tilesetId === -1)) continue;

                const layerIndex = this.currentLayerIndex;

                const tileIndex = TileTools.getTileIndex(layerTileArea, x, y);
                if (!newTiles[layerIndex]) newTiles[layerIndex] = [];
                newTiles[layerIndex][tileIndex] = { ...tile };
            }
        }

        this._tiles = newTiles;
    }

    _paintTo(tileX, tileY, shouldRemove) {
        let x0 = this._lastPaintPosition.x,
            y0 = this._lastPaintPosition.y,
            x1 = tileX, y1 = tileY;
        const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1;

        let err = dx - dy;

        while (true) {
            this._paintAt(x0, y0, shouldRemove);

            if ((x0 === x1) && (y0 === y1)) break;
            const e2 = err * 2;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }
}).register();
