(() => {
    // Produces "Uppercamel" from "UPPERCAMEL"
    function toUpperCamel(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    // ui
    DTile.reducers.ui = (state = {}, action) => {
        switch (action.type) {
            case "SET_CURRENT_PAGE":
                let cs = state;

                {
                    const pageIdKeys = Object.keys(action.payload).filter(key => {
                        return key.endsWith("Id");
                    });

                    let state = {
                        ...cs,
                        currentPage: action.payload.page
                    };

                    for (let pageIdKey of pageIdKeys) {
                        const uiIdKey = `current${toUpperCamel(pageIdKey.match(/(\w+?)Id/)[1])}Id`;
                        state = {
                            ...state,
                            [uiIdKey]: action.payload[pageIdKey]
                        };
                    }

                    return state;
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
                    openTabs: [...(state.openTabs || []), {
                        type: action.payload.type,
                        id: action.payload.id
                    }]
                };

            case "CLOSE_TAB":
                return {
                    ...state,
                    openTabs: state.openTabs.filter((_, i) => i !== action.payload)
                };

            case "SET_CURRENT_MAP_ID":
                return {
                    ...state,
                    currentMapId: action.payload,
                    mapSelection: [],
                    currentLayerIndex: 0
                };

            case "SET_CURRENT_PROJECT_ID":
                return {
                    ...state,
                    currentProjectId: action.payload,
                    currentTilesetId: -1,
                    tilesetSelection: []
                };

            case "SET_CURRENT_TILESET_ID":
                return {
                    ...state,
                    currentTilesetId: action.payload,
                    tilesetSelection: []
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
