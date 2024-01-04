// src/redux/store.js

import { configureStore, combineReducers } from 'redux';
import bookingReducer from './bookingReducer';

const rootReducer = combineReducers({
    booking: bookingReducer,
    // Add other reducers if needed
});

const store = configureStore(rootReducer);

export default store;
