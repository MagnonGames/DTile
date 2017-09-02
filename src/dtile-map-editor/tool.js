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
            return DTileTool.state.ui.currentTileArea;
        }

        onMove() {}
        onTap() {}
        onTrack() {}
    };
})();
