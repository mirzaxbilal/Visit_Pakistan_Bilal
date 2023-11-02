const express = require('express');
const packageRouter = express.Router();
const { auth_access } = require('../middlewares/auth');
const { createPackage, updatePackage, deletePackage, getAllPackages, getPackageById, getUnapprovedPackages, getAprrovedPackages } = require('../controllers/packageController');

packageRouter.post('/createPackage/:id', auth_access, createPackage);

packageRouter.get('/', getAprrovedPackages);

packageRouter.get('/getAllPackages', getAllPackages);

packageRouter.get('/getUnapprovedPackages', auth_access, getUnapprovedPackages);

packageRouter.get('/:id', getPackageById);

packageRouter.put('/updatePackage/:id', auth_access, updatePackage);

packageRouter.delete('/deletePackage/:id', auth_access, deletePackage);

module.exports = packageRouter;
