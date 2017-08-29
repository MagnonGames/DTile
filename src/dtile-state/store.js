DTile.createStore = () => {
    const { createStore, combineReducers } = window.Redux;

    const entities = combineReducers(DTile.reducers.entities);
    const reducers = combineReducers({
        entities,
        ui: DTile.reducers.ui
    });

    DTile.store = createStore(
        reducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    DTile.ReduxMixin = superclass =>
        window.PolymerRedux(DTile.store)(class extends superclass {
            static get actions() {
                return {
                    setCurrentPage: page => ({ type: "SET_CURRENT_PAGE", payload: page }),
                    setCurrentProjectId: id => ({ type: "SET_CURRENT_PROJECT_ID", payload: id }),
                    setCurrentMapId: id => ({ type: "SET_CURRENT_MAP_ID", payload: id })
                };
            }
        });
};

DTile.createStore();
