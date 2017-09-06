(() => {
    const useEmbeddedTilesets = false;

    /* globals pako saveAs */
    DTile.exporters.push(class DTileTiledExporter {
        static get exporterName() { return "Tiled (TMX)"; }

        static async exportMap(state) {
            const currentMap = state.entities.maps[state.ui.currentMapId].present;
            const currentProject = state.entities.projects[state.ui.currentProjectId];
            let gidCount = 1;

            const tilesets = await Promise.all(currentProject.tilesetIds.map(async id => {
                const tileset = state.entities.tilesets[id];

                const imageBlob = await (await fetch(tileset.url)).blob();
                const img = new Image();
                img.src = URL.createObjectURL(imageBlob);
                await new Promise(resolve => (img.onload = () => resolve()));

                const imageBuffer = await DTile.utils.readFileAsArrayBuffer(imageBlob);
                const imageBytes = new Uint8Array(imageBuffer);
                const imageData = base64EncodeBytes(pako.deflate(imageBytes));

                const tileCount = parseInt(img.width / tileset.tileWidth) * parseInt(img.height / tileset.tileHeight);

                gidCount += tileCount;
                return {
                    id, firstgid: gidCount - tileCount, tileset, tileCount,
                    image: img, imageData
                };
            }));

            const layers = currentMap.layers.map(layer => {
                const tileArray = layer.tiles.map(tile => {
                    // eslint-disable-next-line eqeqeq
                    if (tile.tileId == -1 || tile.tilesetId == -1) return 0;

                    const tileset = tilesets.find(t => t.id === parseInt(tile.tilesetId));
                    return tileset.firstgid + tile.tileId;
                });
                const tileBytes = new Uint8Array(tileArray.map(id => {
                    // little-endian 32-bit integer
                    return [id & 0xff, (id >> 8) & 0xff, (id >> 16) & 0xff, (id >> 24) & 0xff];
                }).reduce((final, byteArray) => final.concat(byteArray), []));
                const tileData = base64EncodeBytes(pako.deflate(tileBytes));

                return { ...layer, tileData };
            });

            const xml = `
                <map version="1.0" orientation="orthogonal" renderorder="right-down"
                    width="${currentMap.width}" height="${currentMap.height}"
                    tilewidth="${currentMap.tileWidth}" tileheight="${currentMap.tileHeight}">

                    ${tilesets.map(tileset => `
                        <tileset name="${tileset.tileset.name}"
                            firstgid="${tileset.firstgid}"
                            tilewidth="${tileset.tileset.tileWidth}"
                            tileheight="${tileset.tileset.tileHeight}"
                            tilecount="${tileset.tileCount}">
                            <image format="png"
                                width="${tileset.image.width}" height="${tileset.image.height}"
                                ${useEmbeddedTilesets ? `>
                                    <data encoding="base64" compression="zlib">
                                        ${tileset.imageData}
                                    </data>
                                ` : `
                                    source="${tileset.tileset.name.toLowerCase()}.png">
                                `}
                            </image>
                        </tileset>
                    `).join("")}

                    ${layers.map(layer => `
                        <layer name="${layer.name}" width="${currentMap.width}" height="${currentMap.height}">
                            <data encoding="base64" compression="zlib">
                                ${layer.tileData}
                            </data>
                        </layer>
                    `).join("")}
                </map>
            `.trim().replace(/^\s+/gm, "").replace(/(\w+=".+?")\n/g, "$1 ");

            const xmlBlob = new Blob([xml], { type: "text/plain" });

            saveAs(xmlBlob, `${currentMap.name}.tmx`);
        }
    });

    function base64EncodeBytes(byteArray) {
        return btoa(byteArray.reduce((acc, b) => acc + String.fromCharCode(b), ""));
    }
})();
