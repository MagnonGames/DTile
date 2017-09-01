/* globals TileTools */
(class Bucket extends DTile.Tool {
    static get toolName() { return "bucket"; }
    static get icon() { return "tool:bucket"; }

    onMove(e) {
        this._preview(e);
    }

    onTap(e) {
        this._fill(e);
    }

    onTrack(e) {
        if (e.state === "end") this._fill(e);
        else this._preview(e);
    }

    _preview({ tileX, tileY, previewTiles }) {
        const layerTileArea = this.layerAsTileArea;
        const tileArea = this.tileArea;

        if (!layerTileArea || !tileArea) return;
        if (tileX < 0 || tileY < 0 || tileX >= layerTileArea.width || tileY >= layerTileArea.height) {
            previewTiles([]);
        } else {
            previewTiles(TileTools.fillTileAreaAt(layerTileArea, tileX, tileY, tileArea).tiles);
        }
    }

    _fill({ tileX, tileY, button, commitTiles }) {
        if (button) return;

        const tileArea = this.layerAsTileArea;
        const newTileArea = TileTools.fillTileAreaAt(tileArea, tileX, tileY, this.tileArea);
        commitTiles(newTileArea.tiles);
    }
}).register();
