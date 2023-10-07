const express = require('express');
const Router = express.Router();
const { auth_access, auth_refresh } = require('../middlewares/auth');
const { addFood, getAll } = require('../controllers/foodController');

Router.post('/addFood', auth_access, addFood);
Router.get('/', auth_access, getAll);

module.exports = Router;