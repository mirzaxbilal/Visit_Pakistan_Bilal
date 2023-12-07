const express = require('express');
const locationRouter = express.Router();
const { auth_access } = require('../middlewares/auth');
const {
    createLocation,
    updateLocation,
    getAllLocations,
    getLocationById,
    addAttraction,
    removeAttraction,
    deleteLocation
} = require('../controllers/locationController');
console.log("here")
locationRouter.post('/createLocation', auth_access, createLocation);
locationRouter.put('/updateLocation/:id', auth_access, updateLocation);
locationRouter.get('/', auth_access, getAllLocations);
locationRouter.get('/:id', getLocationById);
locationRouter.put('/addAttraction/:id', auth_access, addAttraction);
locationRouter.put('/removeAttraction/:id', auth_access, removeAttraction);
locationRouter.delete('/deleteLocation/:id', auth_access, deleteLocation);

module.exports = locationRouter;
