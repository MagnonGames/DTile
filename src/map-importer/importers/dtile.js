(() => {
    /* globals pako */
    DTile.importers.push(class DTileMapImporter {
        static match(file) { return file.name.match(/\.json(?:\.gz)?$/); }

        static async parseData(data) {
            let bytes = new Uint8Array(data);
            try {
                bytes = pako.ungzip(data);
            } catch (e) {}
            const string = bytes.reduce((acc, b) => acc + String.fromCharCode(b), "");
            return JSON.parse(string);
        }

        static async getNeededTilesets(map) {
            if (!map.tilesets) return;
            return map.tilesets
                .map((tileset, id) => ({ tileset, id }))
                .filter(({ tileset }) => !tileset.url && tileset.path);
        }

        static async importTilesets(map, importedTilesetUrls) {
            return await Promise.all(map.tilesets.map(async(tileset, id) => {
                if (importedTilesetUrls[id]) tileset.url = importedTilesetUrls[id];
                const imageBlob = await (await fetch(tileset.url)).blob();

                return { tileset, imageBlob };
            }));
        }

        static async importMap(map, tilesetMapping) {
            const layers = map.layers.map(layer => {
                return {
                    ...layer,
                    tiles: layer.tiles.map(tile => {
                        if (tile === null) return { tileId: -1, tilesetId: -1 };
                        return {
                            ...tile,
                            tilesetId: tilesetMapping.get(parseInt(tile.tilesetId))
                        };
                    })
                };
            });

            return {
                ...map,
                layers
            };
        }
    });
})();
