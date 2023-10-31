const express = require('express');
const userRouter = express.Router();
const { auth_access, auth_refresh } = require('../middlewares/auth');
const { signup, signin, getProfile, updateProfile, deleteProfile, refreshtoken, getAllUsers } = require('../controllers/userController');

userRouter.post('/signup', signup);

userRouter.post('/signin', signin);

userRouter.get('/:id', auth_access, getProfile);

userRouter.get('/', auth_access, getAllUsers);

userRouter.put('/updateprofile', auth_access, updateProfile);

userRouter.delete('/deleteprofile', auth_access, deleteProfile);

userRouter.post('/refreshtoken', auth_refresh, refreshtoken);

module.exports = userRouter;