const mongoose = require('mongoose');

const AgentSchema = mongoose.Schema({

    name: {
        type: 'String',
        required: true
    },
    phone: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    },
    cnic_image: {
        type: 'String',
        required: true
    },
    license_image: {
        type: 'String',
        required: true
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    }],
    isDeleted: {
        type: 'Boolean',
        required: true
    }


}, { timestamps: true });

module.exports = mongoose.model("Agent", AgentSchema);