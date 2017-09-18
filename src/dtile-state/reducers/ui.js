(() => {
    // Produces "Uppercamel" from "UPPERCAMEL"
    function toUpperCamel(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    // ui
    DTile.reducers.ui = (state = {}, action) => {
        switch (action.type) {
            case "SET_CURRENT_PAGE":
                const pageIdKey = Object.keys(action.payload).find(key => {
                    return key.endsWith("Id");
                });
                if (pageIdKey) {
                    const uiIdKey = `current${toUpperCamel(pageIdKey.match(/(\w+?)Id/)[1])}Id`;
                    return {
                        ...state,
                        currentPage: action.payload.page,
                        [uiIdKey]: action.payload[pageIdKey]
                    };
                } else {
                    return {
                        ...state,
                        currentPage: action.payload.page
                    };
                }

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

            case "SET_CURRENT_TILE_AREA":
                return {
                    ...state,
                    currentTileArea: action.payload
                };

            case "OPEN_TAB":
                return {
                    ...state,
                    openTabs: [...state.openTabs, {
                        type: action.payload.type,
                        id: action.payload.id
                    }]
                };

            case "CLOSE_TAB":
                return {
                    ...state,
                    openTabs: state.openTabs.filter((_, i) => i !== action.payload)
                };

            default:
                const idMatch = action.type.match(/SET_CURRENT_([A-Z]+?)_ID/);
                if (idMatch) {
                    const keyUpperCamel = toUpperCamel(idMatch[1]);
                    return {
                        ...state,
                        [`current${keyUpperCamel}Id`]: action.payload
                    };
                } else {
                    return state;
                }
        }
    };
})();
