DTile.createStore = () => {
    const { createStore, combineReducers } = window.Redux;

    const entities = combineReducers(DTile.reducers.entities);
    const reducers = combineReducers({
        entities
    });

    DTile.store = createStore(reducers);
    DTile.ReduxMixin = window.PolymerRedux(DTile.store);
};

DTile.createStore();
