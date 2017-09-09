(() => {
    const { default: undoable } = window.ReduxUndo;

    // entities.maps
    DTile.reducers.entities.maps = (state = {}, action) => {
        switch (action.type) {
            case "ADD_MAP":
                return {
                    ...state,
                    [action.payload.mapId]: map(undefined, action)
                };

            case "REMOVE_MAP":
                const { [action.payload.mapId]: _, ...mapRemovedState } = state;
                return mapRemovedState;

            case "REPLACE":
                return Object.keys(state).reduce((obj = {}, key) => {
                    obj[key] = map(state[key], action);
                    return obj;
                }, {});

            default:
                if (!action.payload || typeof action.payload.mapId === "undefined") return state;
                else {
                    return {
                        ...state,
                        [action.payload.mapId]: map(state[action.payload.mapId], action)
                    };
                }
        }
    };

    // entities.maps[id]
    // is undoable by sending UNDO / REDO (from ReduxUndo.ActionTypes) with mapId
    const map = undoable((state = {}, action) => {
        switch (action.type) {
            case "ADD_MAP":
                return {
                    name: action.payload.name,
                    width: action.payload.width || 0,
                    height: action.payload.height || 0,
                    tileWidth: action.payload.tileWidth || 0,
                    tileHeight: action.payload.tileHeight || 0,

                    layers: layers(action.payload.layers, action),
                    objects: objects(action.payload.objects, action),

                    meta: action.payload.meta
                };

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

                return {
                    ...state,
                    [type]: reducer(state[type], action, state)
                };
        }
    }, {
        ignoreInitialState: true
    });

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

            case "MODIFY_TILES_IN_LAYER":
                return state.map((layer, index) => {
                    if (index !== action.payload.layerIndex) return layer;

                    return {
                        ...layer,
                        tiles: action.payload.tiles
                    };
                });

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
                        x: action.payload.x || 0,
                        y: action.payload.y || 0,
                        width: 1,
                        height: 1,

                        meta: {}
                    }
                ];

            case "REMOVE_OBJECT":
                return state.filter((object, index) => index !== action.payload.objectIndex);

            case "MOVE_OBJECT":
                return state.map((object, i) => {
                    if (action.payload.objectIndex !== i) return object;
                    return {
                        ...object,
                        x: action.payload.x || object.x,
                        y: action.payload.y || object.y
                    };
                });

            case "RESIZE_OBJECT":
                return state.map((object, i) => {
                    if (action.payload.objectIndex !== i) return object;
                    return {
                        ...object,
                        width: action.payload.width || object.width,
                        height: action.payload.height || object.height
                    };
                });

            default: return state;
        }
    };
})();
