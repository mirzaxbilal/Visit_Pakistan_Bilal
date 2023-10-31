const packageModel = require("../models/tourPackage");
const agentModel = require("../models/agent");


const createPackage = async (req, res) => {
    try {
        const agent = await agentModel.findOne({ _id: req.body.agentId, isDeleted: false });

        if (!agent) {
            console.log(agent);
            return res.status(400).json({ message: "Agent not found!" });
        }
        const package = await packageModel.create({
            title: req.body.title,
            overview: req.body.overview,
            whatsIncluded: req.body.whatsIncluded,
            tourItinerary: req.body.tourItinerary,
            price: req.body.price,
            duration: req.body.duration,
            images: req.body.images,
            locationTags: req.body.locationTags,
            agentName: agent.name,
            agentId: req.body.agentId,
            isDeleted: false,
            isApproved: false,

        });

        res.status(201).json({ message: "Package created. Awaiting approval" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const updatePackage = async (req, res) => {
    try {
        const packageId = req.params.id;
        const existingPackage = await packageModel.findOne({ _id: packageId, isDeleted: false });

        if (!existingPackage) {
            return res.status(404).json({ message: "Package not found." });
        }

        if (req.body.title) {
            existingPackage.title = req.body.title;
        }
        if (req.body.overview) {
            existingPackage.overview = req.body.overview;
        }
        if (req.body.whatsIncluded) {
            existingPackage.whatsIncluded = req.body.whatsIncluded;
        }
        if (req.body.tourItinerary) {
            existingPackage.tourItinerary = req.body.tourItinerary;
        }
        if (req.body.price) {
            existingPackage.price = req.body.price;
        }
        if (req.body.duration) {
            existingPackage.duration = req.body.duration;
        }
        if (req.body.images) {
            existingPackage.images = req.body.images;
        }
        if (req.body.locationTags) {
            existingPackage.locationTags = req.body.locationTags;
        }


        await existingPackage.save();



        res.status(201).json({ message: "Package updated. Awaiting approval" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const deletePackage = async (req, res) => {

    try {
        const existingPackage = await packageModel.findOne({ _id: req.params.id, isDeleted: false })
        if (!existingPackage) {
            return res.status(400).json({ message: "Package not found!" });
        }
        existingPackage.isDeleted = true;
        await existingPackage.save();
        res.status(200).json({
            success: true,
            message: "Successfully Deleted."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const getAllPackages = async (req, res) => {
    try {
        const packages = await packageModel.find({ isDeleted: false });
        res.status(200).json(packages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

const getPackageById = async (req, res) => {
    try {
        const package = await packageModel.find({ _id: req.params.id, isDeleted: false });
        res.status(200).json(package);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

module.exports = { createPackage, updatePackage, deletePackage, getAllPackages, getPackageById }