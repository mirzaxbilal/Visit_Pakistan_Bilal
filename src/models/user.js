const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    username: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    phone: {
        type: 'String',
        required: true
    },
    role: {
        type: 'String',
        required: true,
        enum: ["user", "admin"]
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    }],
    isDeleted: {
        type: 'Boolean',
        required: true
    }


}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);