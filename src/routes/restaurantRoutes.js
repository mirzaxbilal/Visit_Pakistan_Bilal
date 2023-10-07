const express = require('express');
const Router = express.Router();
const { auth_access, auth_refresh } = require('../middlewares/auth');
const { addRestaurant, createCalorieCategory, addMealToCategories, getAll } = require('../controllers/restaurantController');

Router.post('/addRestaurant', auth_access, addRestaurant);
Router.post('/createCalorieCategory', auth_access, createCalorieCategory);
Router.post('/addMealToCategories', auth_access, addMealToCategories);
Router.get('/', getAll);

module.exports = Router;