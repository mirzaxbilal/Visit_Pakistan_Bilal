const mongoose = require('mongoose');

const AboutPageSchema = new mongoose.Schema({
    AboutTagline: {
        type: 'String',
        required: true,
    },
    AboutImage: {
        type: 'String',
        required: true,
    },
    AboutDescription: {
        type: 'String',
        required: true,
    },
    Reviews: [{
        Username: {
            type: 'String',
            required: true
        },
        Comment: {
            type: 'String',
            required: true
        }
    }]
});

module.exports = mongoose.model("about", AboutPageSchema);
