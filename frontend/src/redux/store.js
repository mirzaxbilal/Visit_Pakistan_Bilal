import { configureStore, combineReducers } from '@reduxjs/toolkit';
import bookingReducer from './bookingReducer';

const rootReducer = combineReducers({
    booking: bookingReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;
