// src/redux/store.js

import { createStore, combineReducers } from 'redux';
import bookingReducer from './bookingReducer';

const rootReducer = combineReducers({
    booking: bookingReducer,
});

const store = configureStore(rootReducer);

export default store;
