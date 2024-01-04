// src/redux/bookingActions.js

export const SET_BOOKING_SUCCESS = 'SET_BOOKING_SUCCESS';

export const setBookingSuccess = (packageId, success) => ({
    type: SET_BOOKING_SUCCESS,
    payload: { packageId, success },
});
