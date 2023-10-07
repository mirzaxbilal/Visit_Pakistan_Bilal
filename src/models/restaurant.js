const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
    restaurant_id: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    Menu: [{
        category_name: {
            type: String,
            required: true,
            enum: ["400 Calorie Meal", "500 Calorie Meal", "600 Calorie Meal", "700 Calorie Meal", "800 Calorie Meal"]
        },
        Meals: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }]
    }]

})

module.exports = mongoose.model("Restaurant", restaurantSchema);
