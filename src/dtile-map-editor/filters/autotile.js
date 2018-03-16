(class AutotileFilter extends DTile.Filter {
    filter(changed, { map, getTileset }) {
        const w = parseInt(map.width);

        const getUpdatedTile = (layer, index) => {
            if (index < 0) return { tilesetId: -1, tileId: -1 };
            if (changed[layer] && changed[layer][index] !== undefined) {
                return changed[layer][index];
            } else {
                return map.layers[layer].tiles[index];
            }
        };

        const groupMap = {};

        const populategroupMap = (layer, index) => {
            layer = parseInt(layer);
            index = parseInt(index);
            groupMap[layer] = groupMap[layer] || {};

            [
                -w * 2 - 2, -w * 2 - 1, -w * 2, -w * 2 + 1, -w * 2 + 2,
                -w - 2, -w - 1, -w, -w + 1, -w + 2,
                -2, -1, 0, 1, 2,
                w - 2, w - 1, w, w + 1, w + 2,
                w * 2 - 2, w * 2 - 1, w * 2, w * 2 + 1, w * 2 + 2
            ].forEach((offset) => {
                if (groupMap[layer][index + offset] !== undefined) return;
                const tile = getUpdatedTile(layer, index + offset);

                if (!tile || tile.tilesetId === undefined || tile.tileId === undefined) return;

                const tilesetId = parseInt(tile.tilesetId);
                const tileId = parseInt(tile.tileId);
                if (tilesetId < 0 || tileId < 0) return;

                const autotileGroups = getTileset(tilesetId).meta["@*autotile-groups"];

                if (!autotileGroups) return;

                const group = autotileGroups.find(({ tiles }) => {
                    return Object.values(tiles).find(id => id === tileId);
                });

                groupMap[layer][index + offset] = group;
            });
        };

        const toUpdate = [];
        Object.entries(changed).forEach(([layer, tiles]) => {
            layer = parseInt(layer);
            Object.entries(tiles).forEach(([id, { tilesetId, tileId }]) => {
                id = parseInt(id);
                tilesetId = parseInt(tilesetId);
                tileId = parseInt(tileId);
                populategroupMap(layer, id);

                [-w - 1, -w, -w + 1, -1, 0, 1, w - 1, w, w + 1].forEach(offset => {
                    toUpdate.push({ layer, id: id + offset });
                });
            });
        });

        const updateTile = (layer, tileId) => {
            const group = groupMap[layer][tileId];
            if (!group) return;

            // Top and bottom not needed because they'll just produce undefined
            // anyway and become false when checking the group.
            const edgeLeft = tileId % w === 0;
            const edgeRight = tileId % w === w - 1;

            const tl = edgeLeft ? false : groupMap[layer][tileId - w - 1] === group;
            const tr = edgeRight ? false : groupMap[layer][tileId - w + 1] === group;
            const bl = edgeLeft ? false : groupMap[layer][tileId + w - 1] === group;
            const br = edgeRight ? false : groupMap[layer][tileId + w + 1] === group;
            const t = groupMap[layer][tileId - w] === group;
            const r = edgeRight ? false : groupMap[layer][tileId + 1] === group;
            const b = groupMap[layer][tileId + w] === group;
            const l = edgeLeft ? false : groupMap[layer][tileId - 1] === group;

            const autoId = DTile.utils.autotiles.getId(tl, tr, bl, br, t, r, b, l) - 1;
            changed[layer][tileId] = {
                tilesetId: getUpdatedTile(layer, tileId).tilesetId,
                tileId: group.tiles[autoId]
            };
        };

        toUpdate.forEach(({ id, layer }) => {
            updateTile(layer, id);
        });

        return changed;
    }
}).register();
