(() => {
    DTile.reducers.entities.tilesets = (state = {}, action) => {
        switch (action.type) {
            case "IMPORT_TILESET":
                return {
                    ...state,
                    [action.payload.tilesetId]: {
                        name: action.payload.name,
                        tilesetType: action.payload.tilesetType,
                        tileWidth: action.payload.tileWidth,
                        tileHeight: action.payload.tileHeight,
                        url: action.payload.url,
                        meta: action.payload.meta
                    }
                };
            case "REMOVE_TILESET":
                const {
                    [action.payload.tilesetId]: _,
                    ...restState
                } = state;

                return {
                    restState
                };
            case "MODIFY_TILESET_META":
                return {
                    ...state,
                    [action.payload.tilesetId]: {
                        ...state[action.payload.tilesetId],
                        meta: action.payload.meta
                    }
                };
            default: return state;
        }
    };
})();
