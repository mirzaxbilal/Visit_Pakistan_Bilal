const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    whatsIncluded: {
        type: String,
        required: true
    },
    tourItinerary: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    images: [{ type: String }],
    locations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location'
    }],
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'agent'
    },
    isDeleted: {
        type: Boolean,
        required: true
    },
    isApproved: {
        type: Boolean,
        required: true
    },
});

module.exports = mongoose.model('tourPackage', tourPackageSchema);
