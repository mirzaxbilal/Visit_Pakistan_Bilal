const express = require('express');
const agentRouter = express.Router();
const { auth_access } = require('../middlewares/auth');
const { createAgent, getAllAgents, updateAgent, getAgentById, deleteAgent, signin, refreshtoken, getAgentPackages } = require('../controllers/agentController');
const { auth_refresh } = require('../middlewares/auth');
/**
 * @swagger
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - email
 *         - password
 *         - cnic_image
 *         - license_image
 *         - isDeleted
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the agent
 *         phone:
 *           type: string
 *           description: The phone number of the agent
 *         email:
 *           type: string
 *           description: The email address of the agent
 *         password:
 *           type: string
 *           description: The hashed password for the agent's account
 *         cnic_image:
 *           type: string
 *           description: The CNIC image of the agent
 *         license_image:
 *           type: string
 *           description: The license image of the agent
 *         bookings:
 *           type: array
 *           items:
 *             type: string
 *           description: List of booking IDs associated with the agent
 *         isDeleted:
 *           type: boolean
 *           description: Flag to indicate if the agent is deleted
 *       example:
 *         name: "John Doe"
 *         phone: "1234567890"
 *         email: "johndoe@example.com"
 *         password: "hashedpassword123"
 *         cnic_image: "cnic_image_url"
 *         license_image: "license_image_url"
 *         bookings: ["5f8d040a2b0aed38b4a0fcb4", "5f8d040a2b0aed38b4a0fcf5"]
 *         isDeleted: false
 */

/**
 * @swagger
 * /agents/createAgent:
 *   post:
 *     summary: Create a new agent
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agent'
 *     responses:
 *       201:
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Bad request, missing or invalid fields
 *       500:
 *         description: Server error
 */
agentRouter.post('/createAgent', createAgent);

/**
 * @swagger
 * /agents/signin:
 *   post:
 *     summary: Sign in an existing agent
 *     tags: [Agents]
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
 *                 description: The email of the agent to sign in
 *               password:
 *                 type: string
 *                 description: The password of the agent to sign in
 *     responses:
 *       200:
 *         description: Agent signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad request, missing or invalid credentials
 *       500:
 *         description: Server error
 */
agentRouter.post('/signin', signin);

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Get a list of all agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: A list of agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       500:
 *         description: Server error
 */
agentRouter.get('/', auth_access, getAllAgents);

/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     summary: Get an agent by their ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the agent to retrieve
 *     responses:
 *       200:
 *         description: An agent object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Server error
 */
agentRouter.get('/:id', auth_access, getAgentById);

/**
 * @swagger
 * /agents/updateAgent/{id}:
 *   put:
 *     summary: Update an agent by their ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the agent to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agent'
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Server error
 */
agentRouter.put('/updateAgent/:id', auth_access, updateAgent);

/**
 * @swagger
 * /agents/deleteAgent/{id}:
 *   delete:
 *     summary: Delete an agent by their ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the agent to delete
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Server errory
 */
agentRouter.delete('/deleteAgent/:id', auth_access, deleteAgent);
agentRouter.get('/getAgentPackage/:id', auth_access, getAgentPackages);


/**
 * @swagger
 * /agents/refreshtoken:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Agents
 *     summary: Refresh the authentication token
 *     description: Refreshes the authentication token for an agent. Requires a valid refresh token.
 *     responses:
 *       201:
 *         description: Successfully refreshed the token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email of the agent.
 *                 token:
 *                   type: string
 *                   description: New authentication token.
 *       401:
 *         description: Unauthorized User -- Token is invalid or missing.
 *       500:
 *         description: Something went wrong with the server.
 */
agentRouter.post('/refreshtoken', auth_refresh, refreshtoken);

module.exports = agentRouter;
