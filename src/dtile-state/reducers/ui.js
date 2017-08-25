(() => {
    // ui
    DTile.reducers.ui = (state = {}, action) => {
        switch (action.type) {
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

            default: return state;
        }
    };
})();
