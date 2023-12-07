const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    }, isDeleted: {
        type: Boolean,
        required: true
    },
    attractions: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        picture: {
            type: String,
            required: true
        }
    }]

}, { timestamps: true });

module.exports = mongoose.model("location", LocationSchema);
