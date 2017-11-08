(() => {
    const compress = true;
    const useEmbeddedTilesets = false;

    /* globals pako saveAs */
    DTile.exporters.push(class DTileJSONExporter {
        static get exporterName() { return "DTile (JSON)"; }

        static async exportMap(state) {
            const tilesetMapping = new Map();

            const currentMap = state.entities.maps[state.ui.currentMapId].present;

            currentMap.width = parseInt(currentMap.width);
            currentMap.height = parseInt(currentMap.height);
            currentMap.tileWidth = parseInt(currentMap.tileWidth);
            currentMap.tileHeight = parseInt(currentMap.tileHeight);

            const currentProject = state.entities.projects[state.ui.currentProjectId];
            const tilesets = await Promise.all(currentProject.tilesetIds
                .map((id, index) => {
                    tilesetMapping.set(id, index);
                    return state.entities.tilesets[id];
                })
                .map(async tileset => {
                    const externalTileset = isExternalUrl(tileset.url);

                    const url = (externalTileset && !useEmbeddedTilesets)
                        ? tileset.url
                        : undefined;
                    const path = (!externalTileset && !useEmbeddedTilesets)
                        ? `${tileset.name.toLowerCase()}.png`
                        : undefined;

                    const imageData = useEmbeddedTilesets
                        ? fetchTilesetAsBytes(tileset.url)
                        : undefined;

                    return {
                        ...tileset,
                        tileWidth: parseInt(tileset.tileWidth),
                        tileHeight: parseInt(tileset.tileHeight),
                        url,
                        path,
                        imageData
                    };
                }));

            const layers = currentMap.layers.map(layer => {
                return {
                    ...layer,
                    tiles: layer.tiles.map(tile => {
                        if (tile.tileId < 0 || tile.tilesetId < 0) return null;
                        else {
                            return {
                                tileId: tile.tileId,
                                tilesetId: tilesetMapping.get(tile.tilesetId)
                            };
                        }
                    })
                };
            });

            const mapJson = JSON.stringify({
                ...currentMap,
                layers,
                tilesets
            });

            const jsonBlob = new Blob([compress ? pako.gzip(mapJson) : mapJson]);

            saveAs(jsonBlob, `${currentMap.name}.json${compress ? ".gz" : ""}`);
        }
    });

    function isExternalUrl(url) {
        return url.match(/^https?:\/\//);
    }

    async function fetchTilesetAsBytes(url) {
        const imageBlob = await (await fetch(url)).blob();
        const imageBuffer = await DTile.utils.readFileAsArrayBuffer(imageBlob);
        return new Uint8Array(imageBuffer);
    }
})();
