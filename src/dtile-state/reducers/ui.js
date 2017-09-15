(() => {
    // ui
    DTile.reducers.ui = (state = {}, action) => {
        switch (action.type) {
            case "SET_CURRENT_PAGE":
                return {
                    ...state,
                    currentPage: action.payload
                };

            case "SET_CURRENT_PROJECT_ID":
                return {
                    ...state,
                    currentProjectId: action.payload
                };

            case "SET_CURRENT_MAP_ID":
                return {
                    ...state,
                    currentMapId: action.payload
                };

            case "SET_CURRENT_LAYER_INDEX":
                return {
                    ...state,
                    currentLayerIndex: action.payload
                };

            case "SET_CURRENT_TILESET_ID":
                return {
                    ...state,
                    currentTilesetId: action.payload
                };

            case "SET_MAP_SELECTION":
                return {
                    ...state,
                    mapSelection: action.payload
                };

            case "SET_TILESET_SELECTION":
                return {
                    ...state,
                    tilesetSelection: action.payload
                };

            case "SET_CURRENT_TILE_AREA":
                return {
                    ...state,
                    currentTileArea: action.payload
                };

            case "OPEN_TAB":
                return {
                    ...state,
                    openTabs: (state.openTabs || []).concat([{
                        type: action.payload.type,
                        id: action.payload.id
                    }])
                };

            case "CLOSE_TAB":
                return {
                    ...state,
                    openTabs: state.openTabs.filter((_, i) => i !== action.payload)
                };

            default: return state;
        }
    };
})();
