const express = require('express');
const bookingRouter = express.Router();
const { auth_access } = require('../middlewares/auth');
const { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } = require('../controllers/bookingController');

bookingRouter.post('/createBooking', auth_access, createBooking);

bookingRouter.get('/', auth_access, getBookings);

bookingRouter.get('/:id', auth_access, getBookingById);

bookingRouter.put('/updateBooking/:id', auth_access, updateBooking);

bookingRouter.delete('/deleteBooking/:id', auth_access, deleteBooking);

module.exports = bookingRouter;