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
                        url: action.payload.url
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
            default: return state;
        }
    };
})();
