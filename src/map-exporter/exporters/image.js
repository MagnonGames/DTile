(() => {
    /* globals saveAs */
    DTile.exporters.push(class ImageExporter {
        static get exporterName() { return "Image (PNG)"; }

        static async exportMap(state) {
            const currentMap = state.entities.maps[state.ui.currentMapId].present;
            const currentProject = state.entities.projects[state.ui.currentProjectId];

            const mapWidth = parseInt(currentMap.width);
            const mapHeight = parseInt(currentMap.height);
            const tileWidth = parseInt(currentMap.tileWidth);
            const tileHeight = parseInt(currentMap.tileHeight);

            const canvas = document.createElement("canvas");
            canvas.width = mapWidth * tileWidth;
            canvas.height = mapHeight * tileHeight;

            const tilesetIdMap = new Map();

            const tilesets = await Promise.all(currentProject.tilesetIds.map((id, index) => {
                tilesetIdMap.set(id, index);

                const img = new Image();
                const tileset = state.entities.tilesets[id];
                const promise = new Promise((resolve, reject) => {
                    img.onload = () => resolve({
                        img,
                        size: [tileset.tileWidth, tileset.tileHeight]
                    });
                });
                img.src = tileset.url;
                return promise;
            }));

            const ctx = canvas.getContext("2d");

            for (let layer of currentMap.layers) {
                layer.tiles.forEach(({ tileId, tilesetId }, i) => {
                    if (tileId < 0 || tilesetId < 0) return;

                    const { img, size: [tw, th] } = tilesets[tilesetIdMap.get(tilesetId)];

                    const tilesHorizontal = img.naturalWidth / tileWidth;

                    ctx.drawImage(
                        img,

                        Math.floor(tileId % tilesHorizontal) * tw,
                        Math.floor(tileId / tilesHorizontal) * th,
                        tw,
                        th,

                        Math.floor(i % mapWidth) * tileWidth,
                        Math.floor(i / mapWidth) * tileHeight,
                        tileWidth,
                        tileHeight
                    );
                });
            }

            const blob = await new Promise(resolve => canvas.toBlob(b => resolve(b)));
            saveAs(blob, `${currentMap.name}.png`);
        }
    });
})();
