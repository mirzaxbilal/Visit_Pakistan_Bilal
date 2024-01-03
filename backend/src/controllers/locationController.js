const locationModel = require("../models/location");

const createLocation = async (req, res) => {
    try {

        if (req.role === "admin") {

            const { name, description, picture, attractions } = req.body;
            if (!name || !description || !picture || !attractions || attractions.length === 0) {
                return res.status(400).json({ message: "Invalid input. Please provide name, description, picture, and attractions." });
            }


            const location = new locationModel({
                name,
                description,
                picture,
                isDeleted: false,
                attractions
            });


            const savedLocation = await location.save();


            res.status(201).json({ locationId: savedLocation._id, message: "Location created successfully." });
        } else {

            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateLocation = async (req, res) => {
    try {

        if (req.role === "admin") {

            const locationId = req.params.id;
            const existingLocation = await locationModel.findOne({ _id: locationId });


            if (!existingLocation) {
                return res.status(404).json({ message: "Location not found." });
            }

            const { name, description, picture, attractions } = req.body;


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

            await existingLocation.save();

            res.status(200).json({ location: existingLocation, message: "Location updated successfully." });
        } else {

            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const addAttraction = async (req, res) => {
    try {

        if (req.role === "admin") {

            const locationId = req.params.id;
            const existingLocation = await locationModel.findOne({ _id: locationId });


            if (!existingLocation) {
                return res.status(404).json({ message: "Location not found." });
            }

            const { name, description, picture } = req.body;

            existingLocation.attractions.push({ name, description, picture });


            await existingLocation.save();


            res.status(200).json({ location: existingLocation, message: "Attraction added successfully." });
        } else {

            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const deleteLocation = async (req, res) => {
    try {

        if (req.role === "admin") {

            const locationId = req.params.id;
            const existingLocation = await locationModel.findOne({ _id: locationId });

            if (!existingLocation) {
                return res.status(404).json({ message: "Location not found." });
            }


            existingLocation.isDeleted = true;
            await existingLocation.save();

            res.status(200).json({ success: true, message: "Location deleted successfully." });
        } else {

            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const removeAttraction = async (req, res) => {
    try {

        if (req.role === "admin") {

            const locationId = req.params.id;
            const existingLocation = await locationModel.findOne({ _id: locationId });


            if (!existingLocation) {
                return res.status(404).json({ message: "Location not found." });
            }

            const { attractionName } = req.body;

            existingLocation.attractions = existingLocation.attractions.filter(attraction => attraction.name !== attractionName);

            await existingLocation.save();

            res.status(200).json({ location: existingLocation, message: "Attraction removed successfully." });
        } else {

            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const getAllLocations = async (req, res) => {
    try {

        const locations = await locationModel.find({ isDeleted: false });


        res.status(200).json(locations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getLocationById = async (req, res) => {
    try {

        const location = await locationModel.findOne({ _id: req.params.id, isDeleted: false });


        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }


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
