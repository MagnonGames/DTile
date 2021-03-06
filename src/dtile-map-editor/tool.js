(() => {
    const tools = [];

    DTile.Tool = class DTileTool {
        static register() {
            tools.push(new this());
        }

        static get allTools() { return tools; }

        static get store() { return DTile.store; }
        static get state() { return DTileTool.store.getState(); }

        get currentMap() {
            const state = DTileTool.state;
            return state.entities.maps[state.ui.currentMapId].present;
        }

        get currentLayerIndex() {
            return DTileTool.state.ui.currentLayerIndex;
        }

        get currentLayer() {
            return this.currentMap.layers[this.currentLayerIndex];
        }

        get layerAsTileArea() {
            if (!this.currentLayer) return;

            const map = this.currentMap;
            return {
                width: map.width,
                height: map.height,
                tiles: this.currentLayer.tiles
            };
        }

        get tileArea() {
            return DTileTool.state.ui.currentTileArea || {
                width: 0,
                height: 0,
                tiles: []
            };
        }

        getTileMeta(tilesetId, tileId) {
            if (tilesetId < 0 || tileId < 0) return {};
            return DTileTool.state.entities.tilesets[tilesetId].tileMeta[tileId] || {};
        }

        onMove() {}
        onTap() {}
        onTrack() {}
    };
})();
