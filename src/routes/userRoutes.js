const express = require('express');
const userRouter = express.Router();
const { auth_access, auth_refresh } = require('../middlewares/auth');
const {
  signup,
  signin,
  getProfile,
  updateProfile,
  deleteProfile,
  refreshtoken,
  getAllUsers
} = require('../controllers/userController');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - phone
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password for the user's account
 *         email:
 *           type: string
 *           description: The email address of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: The role of the user in the system
 *         bookings:
 *           type: array
 *           items:
 *             type: string
 *           description: List of booking IDs associated with the user
 *         favourites:
 *           type: array
 *           items:
 *             type: string
 *           description: List of favourite booking IDs associated with the user
 *         isDeleted:
 *           type: boolean
 *           description: Flag indicating if the user's account is deleted
 *       example:
 *         username: "johndoe"
 *         password: "hashedpassword123"
 *         email: "johndoe@example.com"
 *         phone: "1234567890"
 *         role: "user"
 *         isDeleted: false
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad request, user already exists or invalid fields
 *       500:
 *         description: Server error
 */
userRouter.post('/signup', signup);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Authenticate a user and get tokens
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad request, user not found or invalid credentials
 *       500:
 *         description: Server error
 */
userRouter.post('/signin', signin);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user's profile by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.get('/:id', auth_access, getProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
userRouter.get('/', auth_access, getAllUsers);

/**
 * @swagger
 * /users/updateprofile:
 *   put:
 *     summary: Update a user's profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: User not found or invalid data
 *       500:
 *         description: Server error
 */
userRouter.put('/updateprofile', auth_access, updateProfile);

/**
 * @swagger
 * /users/deleteprofile:
 *   delete:
 *     summary: Delete a user's profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.delete('/deleteprofile', auth_access, deleteProfile);

/**
 * @swagger
 * /users/refreshtoken:
 *   post:
 *     summary: Refresh the authentication token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       500:
 *         description: Server error
 */
userRouter.post('/refreshtoken', auth_refresh, refreshtoken);

module.exports = userRouter;
