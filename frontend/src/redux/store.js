// src/redux/store.js

import { createStore, combineReducers } from 'redux';
import bookingReducer from './bookingReducer';

const rootReducer = combineReducers({
    booking: bookingReducer,
    // Add other reducers if needed
});

const store = createStore(rootReducer);

export default store;
