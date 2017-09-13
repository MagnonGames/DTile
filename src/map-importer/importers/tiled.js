(() => {
    /* globals pako */
    DTile.importers.push(class TiledMapImporter {
        static match(file) { return file.name.match(/\.tmx$/); }

        static async parseData(data, file) {
            const xml = data.reduce((acc, b) => acc + String.fromCharCode(b), "");
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, "text/xml");

            const mapElement = doc.getElementsByTagName("map")[0];
            const tilesetElements = mapElement.getElementsByTagName("tileset");
            const layerElements = mapElement.getElementsByTagName("layer");
            const objectElements = mapElement.getElementsByTagName("object");

            const name = file.name.match(/(.+?)\.tmx/)[1];

            const tileWidth = parseInt(mapElement.getAttribute("tilewidth"));
            const tileHeight = parseInt(mapElement.getAttribute("tileheight"));

            let mapType = mapElement.getAttribute("orientation");
            switch (mapType) {
                case "orthogonal": mapType = "ortho"; break;
            }

            const tilesets = [...tilesetElements].map(tilesetElement => {
                const propertiesElement = tilesetElement.getElementsByTagName("properties")[0];
                return {
                    name: tilesetElement.getAttribute("name"),
                    firstGid: parseInt(tilesetElement.getAttribute("firstgid")),
                    tileWidth: parseInt(tilesetElement.getAttribute("tilewidth")),
                    tileHeight: parseInt(tilesetElement.getAttribute("tileheight")),
                    path: tilesetElement.getElementsByTagName("image")[0].getAttribute("source"),
                    tilesetType: mapType,
                    meta: parseMeta(propertiesElement)
                };
            });

            const layers = [...layerElements].map(layerElement => {
                const dataElement = layerElement.getElementsByTagName("data")[0];
                let data = dataElement.innerHTML;
                if (dataElement.getAttribute("encoding") === "base64") {
                    data = atob(data);
                }
                let tiles = new Uint8Array([...data].map(c => c.charCodeAt(0)));
                if (dataElement.getAttribute("compression")) tiles = pako.inflate(tiles);
                tiles = parseI32Array(tiles);

                tiles = tiles.map(tileGid => {
                    const tileset = tilesets.reduce((maxTileset, tileset) => {
                        if (tileset.firstGid <= tileGid && tileset.firstGid > maxTileset) {
                            return tileset;
                        } else {
                            return maxTileset;
                        }
                    });
                    const tilesetId = tilesets.findIndex(t => tileset === t);
                    const tileId = tileGid - tileset.firstGid;

                    return { tileId, tilesetId };
                });

                const propertiesElement = layerElement.getElementsByTagName("properties")[0];

                return {
                    name: layerElement.getAttribute("name"),
                    tiles,
                    meta: parseMeta(propertiesElement)
                };
            });

            const objects = [...objectElements].map(objectElement => {
                const propertiesElement = objectElement.getElementsByTagName("properties")[0];
                return {
                    name: objectElement.getAttribute("name"),
                    x: parseInt(objectElement.getAttribute("x")) / tileWidth,
                    y: parseInt(objectElement.getAttribute("y")) / tileHeight,
                    width: parseInt(objectElement.getAttribute("width")) / tileWidth,
                    height: parseInt(objectElement.getAttribute("height")) / tileHeight,
                    meta: parseMeta(propertiesElement)
                };
            });

            const meta = parseMeta(mapElement.getElementsByTagName("properties")[0]);

            return {
                name,
                width: parseInt(mapElement.getAttribute("width")),
                height: parseInt(mapElement.getAttribute("height")),
                tileWidth,
                tileHeight,
                layers,
                objects,
                tilesets,
                meta
            };
        }

        static async getNeededTilesets(map) {
            if (!map.tilesets) return;
            return map.tilesets
                .map((tileset, id) => ({ tileset, id }))
                .filter(({ tileset }) => !tileset.url && tileset.path);
        }

        static async importTilesets(map, importedTilesetUrls) {
            return await Promise.all(map.tilesets.map(async (tileset, id) => {
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

    // Parses an array of bytes making up a i32 array
    // (Side note: I'm sorry if this isn't the proper way to do it.
    // I'm not really good with bytes and stuff. >_< / @magnonellie)
    function parseI32Array(bytes) {
        const array = [];
        for (let i = 0; i < bytes.length / 4; i++) {
            const byteIndex = i * 4;
            array[i] =
                bytes[byteIndex] +
                bytes[byteIndex + 1] * 255 +
                bytes[byteIndex + 2] * 65025 +
                bytes[byteIndex + 3] * 16581375;
        }
        return array;
    }

    function parseMeta(propertiesElement) {
        const meta = {};

        if (!propertiesElement) return meta;

        const propertyElements = [...propertiesElement.getElementsByTagName("property")];

        propertyElements.forEach(propertyElement => {
            const key = propertyElement.getAttribute("name");
            const value = propertyElement.getAttribute("value") ||
                propertyElement.innerHTML;

            meta[key] = value;
        });

        return meta;
    }
})();
