const locationModel = require("../models/location");

const createLocation = async (req, res) => {
    try {
        // Check if the user has the required permissions (role checking)
        if (req.role === "admin") {
            // Validate the request body
            const { name, description, picture, attractions } = req.body;
            if (!name || !description || !picture || !attractions || attractions.length === 0) {
                return res.status(400).json({ message: "Invalid input. Please provide name, description, picture, and attractions." });
            }

            // Create a new location
            const location = new locationModel({
                name,
                description,
                picture,
                isDeleted: false,
                attractions
            });

            // Save the location to the database
            const savedLocation = await location.save();

            // Respond with the created location
            res.status(201).json({ locationId: savedLocation._id, message: "Location created successfully." });
        } else {
            // Unauthorized access
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateLocation = async (req, res) => {
    try {
        // Check if the user has the required permissions (role checking)
        if (req.role === "admin") {
            // Find the existing location by ID
            const locationId = req.params.id;
            const existingLocation = await locationModel.findOne({ _id: locationId });

            // If the location does not exist, return an error
            if (!existingLocation) {
                return res.status(404).json({ message: "Location not found." });
            }

            // Allow dynamic updating based on the fields provided in the request body
            const { name, description, picture, attractions } = req.body;

            // Update only the fields that are provided in the request body
            if (name) {
                existingLocation.name = name;
            }
            if (description) {
                existingLocation.description = description;
            }
            if (picture) {
                existingLocation.picture = picture;
            }
            if (attractions) {
                existingLocation.attractions = attractions;
            }

            // Save the updated location to the database
            await existingLocation.save();

            // Respond with the updated location
            res.status(200).json({ location: existingLocation, message: "Location updated successfully." });
        } else {
            // Unauthorized access
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const addAttraction = async (req, res) => {
    try {
        // Check if the user has the required permissions (role checking)
        if (req.role === "admin") {
            // Find the existing location by ID
            const locationId = req.params.id;
            const existingLocation = await locationModel.findOne({ _id: locationId });

            // If the location does not exist, return an error
            if (!existingLocation) {
                return res.status(404).json({ message: "Location not found." });
            }

            // Get the new attraction details from the request body
            const { name, description, picture } = req.body;

            // Add the new attraction to the attractions array
            existingLocation.attractions.push({ name, description, picture });

            // Save the updated location to the database
            await existingLocation.save();

            // Respond with the updated location
            res.status(200).json({ location: existingLocation, message: "Attraction added successfully." });
        } else {
            // Unauthorized access
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const deleteLocation = async (req, res) => {
    try {
        // Check if the user has the required permissions (role checking)
        if (req.role === "admin") {
            // Find the existing location by ID
            const locationId = req.params.id;
            const existingLocation = await locationModel.findOne({ _id: locationId });

            // If the location does not exist, return an error
            if (!existingLocation) {
                return res.status(404).json({ message: "Location not found." });
            }

            // Soft delete the location (mark as deleted)
            existingLocation.isDeleted = true;
            await existingLocation.save();

            // Respond with a success message
            res.status(200).json({ success: true, message: "Location deleted successfully." });
        } else {
            // Unauthorized access
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const removeAttraction = async (req, res) => {
    try {
        // Check if the user has the required permissions (role checking)
        if (req.role === "admin") {
            // Find the existing location by ID
            const locationId = req.params.id;
            const existingLocation = await locationModel.findOne({ _id: locationId });

            // If the location does not exist, return an error
            if (!existingLocation) {
                return res.status(404).json({ message: "Location not found." });
            }

            // Get the attraction name to be removed from the request body
            const { attractionName } = req.body;

            // Remove the attraction from the attractions array
            existingLocation.attractions = existingLocation.attractions.filter(attraction => attraction.name !== attractionName);

            // Save the updated location to the database
            await existingLocation.save();

            // Respond with the updated location
            res.status(200).json({ location: existingLocation, message: "Attraction removed successfully." });
        } else {
            // Unauthorized access
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const getAllLocations = async (req, res) => {
    try {
        // Check if the user has the required permissions (role checking)
        if (req.role === "admin") {
            // Retrieve all locations from the database
            const locations = await locationModel.find({ isDeleted: false });

            // Respond with the list of locations
            res.status(200).json(locations);
        } else {
            // Unauthorized access
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getLocationById = async (req, res) => {
    try {
        // Retrieve a location by ID from the database
        const location = await locationModel.findOne({ _id: req.params.id, isDeleted: false });

        // If the location does not exist, return an error
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        // Respond with the location
        res.status(200).json(location);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    createLocation,
    updateLocation,
    addAttraction,
    removeAttraction,
    getAllLocations,
    getLocationById,
    deleteLocation
};
