const AgentModel = require('../models/agent');
const BookingModel = require('../models/booking');
const UserModel = require('../models/user');
const PackageModel = require('../models/tourPackage');


const createBooking = async (req, res) => {
    try {
        if (req.role == "admin" || (req.role == "user")) {
            const { package_id, no_of_persons } = req.body;

            const existingUser = await UserModel.findOne({ _id: req.id, isDeleted: false });
            if (!existingUser) {
                return res.status(400).json({ message: "User does not exists" });
            }
            const existingPackage = await PackageModel.findOne({ _id: package_id, isDeleted: false });
            if (!existingPackage) {
                return res.status(400).json({ message: "Package does not exists" });
            }
            const existingAgent = await AgentModel.findOne({ _id: existingPackage.agentId._id, isDeleted: false });
            if (!existingAgent) {
                return res.status(400).json({ message: "Agent does not exists" });
            }
            if (no_of_persons < 1) {
                return res.status(400).json({ message: "Number of persons should be atleast 1" });
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



            res.status(201).json({ message: "Booking created successfully", booking: savedBooking._id });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getBookings = async (req, res) => {
    try {
        if (req.role == "admin") {
            const bookings = await BookingModel.find({ isDeleted: false }).populate({
                path: 'user',
                select: 'name email'
            }).populate({
                path: 'package',
                select: 'title'
            }).populate({
                path: 'agent',
                select: 'name email phone'
            })
            res.status(200).json(bookings);
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getBookingById = async (req, res) => {
    try {

        const bookingId = req.params.id;
        const booking = await BookingModel.findOne({ _id: bookingId, isDeleted: false }).populate({
            path: 'user',
            select: 'name email'
        }).populate({
            path: 'package',
            select: 'title'
        }).populate({
            path: 'agent',
            select: 'name email phone'
        })
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if ((req.role == "user" && req.id == booking.user._id) || (req.role == "agent" && req.id == booking.agent._id) || req.role == 'admin') {
            res.status(200).json(booking);
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }


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
            if (req.role == "admin") {
                const existingUser = await UserModel.findOne({ _id: user_id, isDeleted: false });
                if (!existingUser) {
                    return res.status(400).json({ message: "User does not exists" });
                }
                existingBooking.user_id = req.body.user_id;
            } else {
                return res.status(401).json({ message: "Unauthorized Access" });
            }
        }
        if (req.body.package_id) {
            if (req.role == "admin") {
                const existingPackage = await PackageModel.findOne({ _id: package_id, isDeleted: false });
                if (!existingPackage) {
                    return res.status(400).json({ message: "Package does not exists" });
                }
                existingBooking.package_id = req.body.package_id;
            } else {
                return res.status(401).json({ message: "Unauthorized Access" });
            }
        }
        if (req.body.agent_id) {
            if (req.role == "admin") {
                const existingAgent = await AgentModel.findOne({ _id: agent_id, isDeleted: false });
                if (!existingAgent) {
                    return res.status(400).json({ message: "Agent does not exists" });
                }
                existingBooking.agent_id = req.body.agent_id;
            } else {
                return res.status(401).json({ message: "Unauthorized Access" });
            }
        }
        if (req.body.no_of_persons) {
            if (req.role == "admin") {
                if (req.body.no_of_persons < 1) {
                    return res.status(400).json({ message: "Number of persons should be atleast 1" });
                }
                existingBooking.no_of_persons = req.body.no_of_persons;
                const existingPackage = await PackageModel.findOne({ _id: existingBooking.package, isDeleted: false });
                if (!existingPackage) {
                    return res.status(400).json({ message: "Package does not exists" });
                }
                existingBooking.total_price = req.body.no_of_persons * existingPackage.price;
            } else {
                return res.status(401).json({ message: "Unauthorized Access" });
            }
        }
        if (req.body.status) {
            if ((req.role == "user" && req.id == existingBooking.user) || (req.role == "agent" && req.id == existingBooking.agent) || role == 'admin') {
                existingBooking.status = req.body.status;
            } else {
                return res.status(401).json({ message: "Unauthorized Access" });
            }
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
        if (req.role == "admin") {
            const bookingId = req.params.id;

            const existingBooking = await BookingModel.findOne({ _id: bookingId, isDeleted: false });
            if (!existingBooking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            existingBooking.isDeleted = true;
            await existingBooking.save();

            const existingUser = await UserModel.findOne({ _id: existingBooking.user, isDeleted: false });
            existingUser.bookings.pull(existingBooking)
            await existingUser.save();

            const existingAgent = await AgentModel.findOne({ _id: existingBooking.agent, isDeleted: false });
            existingAgent.bookings.pull(existingBooking);
            await existingAgent.save();

            res.status(200).json({ message: "Booking marked as deleted" });
        } else {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getBookingsByAgent = async (req, res) => {
    try {
        const { id: agentId } = req.params;

        if (req.role === "admin" || (req.role === "agent" && req.id === agentId)) {
            const bookings = await BookingModel.find({ 'agent': agentId, isDeleted: false }).populate({
                path: 'user',
                select: 'username email phone'
            }).populate({
                path: 'package',
                select: 'title'
            }).populate({
                path: 'agent',
                select: 'name email phone'
            });

            res.status(200).json(bookings);
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = { createBooking, getBookings, getBookingById, updateBooking, deleteBooking, getBookingsByAgent };