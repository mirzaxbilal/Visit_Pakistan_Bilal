const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'tourPackage'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'agent'
    },
    departure_date: {
        type: Date,
        required: true
    },
    no_of_persons: {
        type: Number,
        required: true
    },
    no_of_infants: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    status: {
        type: 'String',
        required: true,
        enum: ['Confirmed', 'Cancelled', 'Payment Pending']
    },
    isDeleted: {
        type: 'Boolean',
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("booking", BookingSchema);