const express = require('express');
const agentRouter = express.Router();
const { createAgent, getAllAgents, updateAgent, getAgentById, deleteAgent, signin } = require('../controllers/agentController');

agentRouter.post('/createAgent', createAgent);
agentRouter.post('/signin', signin);

agentRouter.get('/', getAllAgents);
agentRouter.get('/:id', getAgentById);

agentRouter.put('/updateAgent/:id', updateAgent);
agentRouter.delete('/deleteAgent/:id', deleteAgent);

module.exports = agentRouter;