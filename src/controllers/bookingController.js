const AgentModel = require('../models/agent');
const BookingModel = require('../models/booking');
const UserModel = require('../models/user');
const PackageModel = require('../models/tourPackage');


const createBooking = async (req, res) => {
    try {
        const { user_id, package_id, agent_id, no_of_persons } = req.body;

        const existingUser = await UserModel.findOne({ _id: user_id, isDeleted: false });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exists" });
        }
        const existingPackage = await PackageModel.findOne({ _id: package_id, isDeleted: false });
        if (!existingPackage) {
            return res.status(400).json({ message: "Package does not exists" });
        }
        const existingAgent = await AgentModel.findOne({ _id: agent_id, isDeleted: false });
        if (!existingAgent) {
            return res.status(400).json({ message: "Agent does not exists" });
        }
        const total_price = no_of_persons * existingPackage.price;

        const newBooking = new BookingModel({
            user: existingUser,
            package: existingPackage,
            agent: existingAgent,
            no_of_persons,
            total_price,
            status: "Confirmed",
            isDeleted: false,
        });

        const savedBooking = await newBooking.save();
        existingUser.bookings.push(savedBooking);
        await existingUser.save();

        existingAgent.bookings.push(savedBooking);
        await existingAgent.save();



        res.status(201).json({ message: "Booking created successfully", booking: savedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await BookingModel.find({ isDeleted: false });
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        console.log(bookingId);
        const booking = await BookingModel.findOne({ _id: bookingId, isDeleted: false });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const existingBooking = await BookingModel.findOne({ _id: bookingId, isDeleted: false });
        if (!existingBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (req.body.user_id) {
            const existingUser = await UserModel.findOne({ _id: user_id, isDeleted: false });
            if (!existingUser) {
                return res.status(400).json({ message: "User does not exists" });
            }
            existingBooking.user_id = req.body.user_id;
        }
        if (req.body.package_id) {
            const existingPackage = await PackageModel.findOne({ _id: package_id, isDeleted: false });
            if (!existingPackage) {
                return res.status(400).json({ message: "Package does not exists" });
            }
            existingBooking.package_id = req.body.package_id;
        }
        if (req.body.agent_id) {
            const existingAgent = await AgentModel.findOne({ _id: agent_id, isDeleted: false });
            if (!existingAgent) {
                return res.status(400).json({ message: "Agent does not exists" });
            }
            existingBooking.agent_id = req.body.agent_id;
        }
        if (req.body.no_of_persons) {
            existingBooking.no_of_persons = req.body.no_of_persons;
            const existingPackage = await PackageModel.findOne({ _id: existingBooking.package_id, isDeleted: false });
            if (!existingPackage) {
                return res.status(400).json({ message: "Package does not exists" });
            }
            existingBooking.total_price = req.body.no_of_persons * existingPackage.price;
        }
        if (req.body.status) {
            existingBooking.status = req.body.status;
        }
        await existingBooking.save();

        const updatedBooking = await BookingModel.findOne({ _id: bookingId, isDeleted: false });
        res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const existingBooking = await BookingModel.findOne({ _id: bookingId, isDeleted: false });
        if (!existingBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        existingBooking.isDeleted = true;
        await existingBooking.save();

        res.status(200).json({ message: "Booking marked as deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { createBooking, getBookings, getBookingById, updateBooking, deleteBooking };


module.exports = { createBooking, getBookings, getBookingById, updateBooking, deleteBooking };