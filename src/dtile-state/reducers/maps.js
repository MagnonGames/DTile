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
                    obj[key] = map({
                        past: [],
                        present: state[key],
                        future: [],
                        index: 0
                    }, action);
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

            case "MODIFY_MAP_META":
                return {
                    ...state,
                    meta: action.payload.meta
                };

            default:
                const isLayer = action.type.match(/LAYER(?:_META)?$/);
                const isObject = action.type.match(/OBJECT(?:_META)?$/);

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

            case "MODIFY_LAYER_META":
                return state.map((layer, i) => {
                    if (action.payload.layerIndex !== i) return layer;
                    return {
                        ...layer,
                        meta: action.payload.meta
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

            case "SET_BOUNDS_FOR_OBJECT":
                return state.map((object, i) => {
                    if (action.payload.objectIndex !== i) return object;
                    const x = "x" in action.payload ? action.payload.x : object.x;
                    const y = "y" in action.payload ? action.payload.y : object.y;
                    const width = "width" in action.payload ? action.payload.width : object.width;
                    const height = "height" in action.payload ? action.payload.height : object.height;
                    return {
                        ...object,
                        x, y, width, height
                    };
                });

            case "MODIFY_OBJECT_META":
                return state.map((object, i) => {
                    if (action.payload.objectIndex !== i) return object;
                    return {
                        ...object,
                        meta: action.payload.meta
                    };
                });

            default: return state;
        }
    };
})();
