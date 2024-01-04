import { SET_BOOKING_SUCCESS } from './bookingActions';

const initialState = {};

const bookingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BOOKING_SUCCESS:
            return {
                ...state,
                [action.payload.packageId]: {
                    ...state[action.payload.packageId],
                    bookingSuccessful: action.payload.success,
                },
            };
        default:
            return state;
    }
};

export default bookingReducer;
