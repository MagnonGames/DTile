(() => {
    // entities.maps
    DTile.reducers.entities.maps = (state = {}, action) => {
        switch (action.type) {
            case "ADD_MAP":
                return {
                    ...state,
                    [action.payload.mapId]: {
                        name: action.payload.name,
                        width: action.payload.width || 0,
                        height: action.payload.height || 0,
                        tileWidth: action.payload.tileWidth || 0,
                        tileHeight: action.payload.tileHeight || 0,

                        layers: layers(action.payload.layers, action),
                        objects: objects(action.payload.objects, action),

                        meta: action.payload.meta
                    }
                };

            case "REMOVE_MAP":
                // eslint-disable-next-line no-unused-vars
                const { [action.payload.mapId]: _, ...mapRemovedState } = state;
                return mapRemovedState;

            case "CHANGE_MAP_SIZE":
                console.warn("changing size is not implemented");
                return state;

            case "CHANGE_MAP_TILE_SIZE":
                console.warn("changing map tile size is not implemented");
                return state;

            default:
                const isLayer = action.type.endsWith("LAYER");
                const isObject = action.type.endsWith("OBJECT");

                if (!(isLayer || isObject)) return state;
                const type = isLayer ? "layers" : isObject ? "objects" : "";
                const reducer = type === "layers" ? layers
                    : type === "objects" ? objects
                    : null;

                const map = state[action.payload.mapId];

                return {
                    ...state,
                    [action.payload.mapId]: {
                        ...state[action.payload.mapId],
                        [type]: reducer(state[action.payload.mapId][type], action, map)
                    }
                };
        }
    };

    // entities.maps[id].layers
    const layers = (state = [], action, map) => {
        switch (action.type) {
            case "ADD_LAYER":
                const tiles = [];
                for (let i = 0; i < map.width * map.height; i++) {
                    tiles.push({ tileId: -1, tilesetId: -1 });
                }

                return [
                    ...state,
                    {
                        name: action.payload.name,
                        tiles,
                        meta: {}
                    }
                ];

            case "REMOVE_LAYER":
                return state.filter((layer, index) => index !== action.payload.layerIndex);

            default: return state;
        }
    };

    // entities.maps[id].objects
    const objects = (state = [], action) => {
        switch (action.type) {
            case "ADD_OBJECT":
                return [
                    ...state,
                    {
                        name: action.payload.name,
                        x: action.payload.x,
                        y: action.payload.y,
                        width: 1,
                        height: 1,

                        meta: {}
                    }
                ];

            case "REMOVE_OBJECT":
                return state.filter((object, index) => index !== action.payload.objectIndex);

            default: return state;
        }
    };
})();
