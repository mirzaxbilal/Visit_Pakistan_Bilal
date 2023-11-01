const express = require('express');
const bookingRouter = express.Router();
const { auth_access } = require('../middlewares/auth');
const { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } = require('../controllers/bookingController');

bookingRouter.post('/createBooking', createBooking);

bookingRouter.get('/', getBookings);

bookingRouter.get('/:id', getBookingById);

bookingRouter.put('/updateBooking/:id', updateBooking);

bookingRouter.delete('/deleteBooking/:id', deleteBooking);

module.exports = bookingRouter;