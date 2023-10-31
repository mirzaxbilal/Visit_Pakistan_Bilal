const express = require('express');
const packageRouter = express.Router();
const { createPackage, updatePackage, deletePackage, getAllPackages, getPackageById } = require('../controllers/packageController');

packageRouter.post('/createPackage', createPackage);

packageRouter.get('/', getAllPackages);

packageRouter.get('/:id', getPackageById);

packageRouter.put('/updatePackage/:id', updatePackage);

packageRouter.delete('/deletePackage/:id', deletePackage);

module.exports = packageRouter;
