const restaurantModel = require("../models/restaurant");
const foodModel = require("../models/food");

const addRestaurant = async (req, res) => {
    const { restaurant_id, Name, Description, website, location, contact, icon } = req.body;
    try {
        const existingRestaurant = await restaurantModel.findOne({ restaurant_id: restaurant_id });

        if (existingRestaurant) {
            return res.status(400).json({ message: "Restaurant already exists" });
        }
        const restaurant = new restaurantModel({
            restaurant_id: restaurant_id,
            Name: Name,
            Description: Description,
            website: website,
            location: location,
            contact: contact,
            icon: icon
        });

        await restaurant.save();

        res.status(201).json({ message: "Restaurant added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const createCalorieCategory = async (req, res) => {
    const { restaurant_id, calorieCategory } = req.body;
    try {
        const restaurant = await restaurantModel.findOne({ restaurant_id: restaurant_id });

        if (!restaurant) {
            return res.status(400).json({ message: "Restaurant not found" });
        }

        const newCategory = {
            category_name: calorieCategory,
            Meals: []
        };

        // Push the new category to the Category array
        restaurant.Menu.push(newCategory);

        await restaurant.save();

        res.status(201).json({ message: "Category added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const addMealToCategories = async (req, res) => {
    try {
        console.log("1");
        const restaurant = await restaurantModel.findOne({ restaurant_id: req.body.restaurantId });
        console.log(restaurant);
        console.log("2");
        if (!restaurant) {
            return res.status(400).json({ message: "Restaurant not found" });
        }
        console.log("3");
        const category = restaurant.Menu.find(menuItem => menuItem.category_name === req.body.category);
        console.log("4");
        if (!category) {
            return res.status(400).json({ message: "Category not found" });
        }
        const meal = await foodModel.findOne({ food_id: req.body.food_id }); // Use findOne instead of find
        if (!meal) {
            return res.status(400).json({ message: "Meal not found" });
        }
        category.Meals.push(meal._id);
        await restaurant.save();

        res.status(201).json({ message: "Meal added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const getAll = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find().populate({
            path: 'Menu.Meals',
            model: 'Food'
        });

        res.json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "something went wrong" });
    }
};




module.exports = { addRestaurant, createCalorieCategory, addMealToCategories, getAll }
