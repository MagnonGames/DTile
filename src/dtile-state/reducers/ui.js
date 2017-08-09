(() => {
    // ui
    DTile.reducers.ui = (state = {}, action) => {
        switch (action.type) {
            case "SET_CURRENT_MAP_ID":
                return {
                    ...state,
                    currentMapId: action.payload
                };

            default: return state;
        }
    };
})();
