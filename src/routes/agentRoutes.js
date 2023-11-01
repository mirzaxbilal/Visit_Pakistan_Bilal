const express = require('express');
const agentRouter = express.Router();
const { auth_access, auth_refresh } = require('../middlewares/auth');
const { createAgent, getAllAgents, updateAgent, getAgentById, deleteAgent, signin, refreshtoken } = require('../controllers/agentController');

agentRouter.post('/createAgent', createAgent);
agentRouter.post('/signin', signin);

agentRouter.get('/', auth_access, getAllAgents);
agentRouter.get('/:id', auth_access, getAgentById);

agentRouter.put('/updateAgent/:id', auth_access, updateAgent);
agentRouter.delete('/deleteAgent/:id', auth_access, deleteAgent);
agentRouter.post('/refreshtoken', auth_refresh, refreshtoken);


module.exports = agentRouter;