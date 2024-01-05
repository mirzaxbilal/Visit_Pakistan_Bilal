const express = require('express');
const AboutRouter = express.Router();
const { auth_access } = require('../middlewares/auth');
const { getAboutPageContent, updateAboutPageContent, createAboutPageContent } = require('../controllers/AboutPageController');

AboutRouter.get('/', getAboutPageContent);
AboutRouter.put('/update', auth_access, updateAboutPageContent);
AboutRouter.post('/post', auth_access, createAboutPageContent);

module.exports = AboutRouter;
