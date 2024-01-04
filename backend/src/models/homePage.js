const mongoose = require('mongoose');

const HomePageSchema = new mongoose.Schema({
    WelcomeHeading: {
        type: 'String',
        required: true,

    },
    WelcomeTagline: {
        type: 'String',
        required: true,

    },
    WelcomeVideo: {
        type: 'String',
        required: true,

    },
    LocationsHeading: {
        type: 'String',
        required: true,

    },
    PlanTripHeading: {
        type: 'String',
        required: true,

    },
    PlanTripDescripton: {
        type: 'String',
        required: true,

    },
    PlanTripImage: {
        type: 'String',
        required: true,

    },
    PlanTripButton: {
        type: 'String',
        required: true,

    }

});

module.exports = mongoose.model("home", HomePageSchema);