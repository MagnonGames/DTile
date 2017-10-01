(() => {
    // entities.projects
    DTile.reducers.entities.projects = (state = {}, action) => {
        switch (action.type) {
            case "ADD_PROJECT":
                return {
                    ...state,
                    [action.payload.projectId]: {
                        name: action.payload.name,
                        description: undefined,
                        mapIds: [],
                        tilesetIds: [],

                        meta: {}
                    }
                };

            case "REMOVE_PROJECT":
                // eslint-disable-next-line no-unused-vars
                const { [action.payload.projectId]: _, ...projectRemovedState } = state;
                return projectRemovedState;

            case "RENAME_PROJECT":
                return {
                    ...state,
                    [action.payload.projectId]: {
                        ...state[action.payload.projectId],
                        name: action.payload.name
                    }
                };

            case "ADD_MAP":
                if (typeof action.payload.projectId === "undefined") return state;
                const addMapProject = state[action.payload.projectId];
                return {
                    ...state,
                    [action.payload.projectId]: {
                        ...addMapProject,
                        mapIds: [...addMapProject.mapIds, action.payload.mapId]
                    }
                };

            case "REMOVE_MAP":
                const projectId = Object.keys(state).find(
                    id => state[id].mapIds.includes(parseInt(action.payload.mapId))
                );
                return {
                    ...state,
                    [projectId]: {
                        ...state[projectId],
                        mapIds: state[projectId].mapIds.filter(id => id !== action.payload.mapId)
                    }
                };

            case "ADD_TILESET_TO_PROJECT":
                const addTilesetProject = state[action.payload.projectId];
                return {
                    ...state,
                    [action.payload.projectId]: {
                        ...addTilesetProject,
                        tilesetIds: [...addTilesetProject.tilesetIds, action.payload.tilesetId]
                    }
                };

            case "REMOVE_TILESET_FROM_PROJECT":
                const removeTilesetProject = state[action.payload.projectId];
                return {
                    ...state,
                    [action.payload.projectId]: {
                        ...removeTilesetProject,
                        tilesetIds: removeTilesetProject.tilesetIds.filter(id => id !== action.payload.tilesetId)
                    }
                };

            default: return state;
        }
    };
})();
