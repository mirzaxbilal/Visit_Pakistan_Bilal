const express = require('express');
const bookingRouter = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - user
 *         - package
 *         - agent
 *         - no_of_persons
 *         - total_price
 *         - status
 *         - isDeleted
 *       properties:
 *         user:
 *           type: string
 *           description: The user ID associated with the booking
 *         package:
 *           type: string
 *           description: The tour package ID associated with the booking
 *         agent:
 *           type: string
 *           description: The agent ID associated with the booking
 *         no_of_persons:
 *           type: number
 *           description: The number of persons included in the booking
 *         total_price:
 *           type: number
 *           description: The total price of the booking
 *         status:
 *           type: string
 *           enum: [Confirmed, Cancelled]
 *           description: The status of the booking
 *         isDeleted:
 *           type: boolean
 *           description: Flag indicating if the booking is deleted
 */

/**
 * @swagger
 * /bookings/createBooking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *       500:
 *         description: Server error
 */
bookingRouter.post('/createBooking', createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: An array of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Server error
 */
bookingRouter.get('/', getBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to retrieve
 *     responses:
 *       200:
 *         description: A single booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
bookingRouter.get('/:id', getBookingById);

/**
 * @swagger
 * /bookings/updateBooking/{id}:
 *   put:
 *     summary: Update a booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
bookingRouter.put('/updateBooking/:id', updateBooking);

/**
 * @swagger
 * /bookings/deleteBooking/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to delete
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
bookingRouter.delete('/deleteBooking/:id', deleteBooking);

module.exports = bookingRouter;
