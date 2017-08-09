DTile.createStore = () => {
    const { createStore, combineReducers } = window.Redux;

    const entities = combineReducers(DTile.reducers.entities);
    const reducers = combineReducers({
        entities,
        ui: DTile.reducers.ui
    });

    DTile.store = createStore(reducers);
    DTile.ReduxMixin = window.PolymerRedux(DTile.store);
};

DTile.createStore();
