const restaurantModel = require("../models/restaurant");
const foodModel = require("../models/food");

const addFood = async (req, res) => {
    const { food_id, Name, MB, restaurant_id } = req.body;

    try {

        const food = new foodModel({
            food_id: food_id,
            Name: Name,
            MB: MB,
            restaurant_id: restaurant_id
        });

        await food.save();

        res.status(201).json({ message: "Food added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



const getAll = async (req, res) => {
    try {
        const foods = await foodModel.find()
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



module.exports = { addFood, getAll }
