(class Select extends DTile.Tool {
    static get toolName() { return "select"; }
    static get icon() { return "tool:select"; }

    onTap({ tileX, tileY, commitSelection, button }) {
        if (button) return;

        commitSelection([]);
    }

    onTrack({
        tileX, tileY, startTileX, startTileY, state, shiftKey, ctrlKey,
        previewSelection, commitSelection, button
    }) {
        if (button) return;

        const map = this.currentMap;
        const layer = this.currentLayerIndex;

        const selection = [];
        const xValues = [tileX, startTileX];
        const yValues = [tileY, startTileY];
        for (let x = Math.min(...xValues); x <= Math.max(...xValues); x++) {
            for (let y = Math.min(...yValues); y <= Math.max(...yValues); y++) {
                if (x < 0 || y < 0 || x >= map.width || y >= map.height) continue;
                selection.push({ x, y, layer });
            }
        }
        if (state === "end") commitSelection(selection);
        else previewSelection(selection);
    }
}).register();
