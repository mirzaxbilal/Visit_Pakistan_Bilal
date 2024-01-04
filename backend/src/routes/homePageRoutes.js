const express = require('express');
const HomeRouter = express.Router();
const { auth_access } = require('../middlewares/auth');
const { getHomePageContent,
    updateHomePageContent, createHomePageContent } = require('../controllers/HomePageController');


HomeRouter.get('/', getHomePageContent);

HomeRouter.put('/update', auth_access, updateHomePageContent);


module.exports = HomeRouter;