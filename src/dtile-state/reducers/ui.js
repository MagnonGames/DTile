(() => {
    // ui
    DTile.reducers.ui = (state = {}, action) => {
        switch (action.type) {
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

            default: return state;
        }
    };
})();
