const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    food_id: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    MB: {
        type: Boolean,
        required: true
    },
    restaurant_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Food", foodSchema);
