const packageModel = require("../models/tourPackage");
const agentModel = require("../models/agent");


const createPackage = async (req, res) => {

    try {
        if (req.role == "admin" || (req.role == "agent" && req.id == req.params.id)) {
            const agent = await agentModel.findOne({ _id: req.params.id, isDeleted: false });

            if (!agent) {
                console.log(agent);
                return res.status(400).json({ message: "Agent not found!" });
            }
            const package = new packageModel({
                title: req.body.title,
                overview: req.body.overview,
                whatsIncluded: req.body.whatsIncluded,
                tourItinerary: req.body.tourItinerary,
                price: req.body.price,
                duration: req.body.duration,
                images: req.body.images,
                locationTags: req.body.locationTags,
                agentId: agent,
                isDeleted: false,
                isApproved: false,

            });

            const savedPackage = await package.save();
            agent.packages.push(savedPackage);
            await agent.save();
            res.status(201).json({ savedPackage, message: "Package created. Awaiting approval" });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const updatePackage = async (req, res) => {
    try {
        if (req.role == "admin" || (req.role == "agent")) {
            const packageId = req.params.id;
            const existingPackage = await packageModel.findOne({ _id: packageId, isDeleted: false });

            if (!existingPackage) {
                return res.status(404).json({ message: "Package not found." });
            }
            console.log(req.id);
            console.log(existingPackage.agentId);
            if (req.id != existingPackage.agentId && req.role != "admin") {
                return res.status(400).json({ message: "**Unauthorized Access" });
            }
            if (req.body.title) {
                existingPackage.title = req.body.title;
                existingPackage.isApproved = false;
            }
            if (req.body.overview) {
                existingPackage.overview = req.body.overview;
                existingPackage.isApproved = false;
            }
            if (req.body.whatsIncluded) {
                existingPackage.whatsIncluded = req.body.whatsIncluded;
                existingPackage.isApproved = false;
            }
            if (req.body.tourItinerary) {
                existingPackage.tourItinerary = req.body.tourItinerary;
                existingPackage.isApproved = false;
            }
            if (req.body.price) {
                existingPackage.price = req.body.price;
                existingPackage.isApproved = false;
            }
            if (req.body.duration) {
                existingPackage.duration = req.body.duration;
                existingPackage.isApproved = false;
            }
            if (req.body.images) {
                existingPackage.images = req.body.images;
                existingPackage.isApproved = false;
            }
            if (req.body.locationTags) {
                existingPackage.locationTags = req.body.locationTags;
                existingPackage.isApproved = false;
            }
            if (req.body.isApproved) {
                if (req.role == "admin") {
                    existingPackage.isApproved = req.body.isApproved;
                } else {
                    res.status(401).json({ message: "--Unauthorized Access" });
                }
            }


            await existingPackage.save();



            res.status(201).json({ existingPackage, message: "Package updated" });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const deletePackage = async (req, res) => {

    try {
        if (req.role == "admin" || (req.role == "agent")) {
            const existingPackage = await packageModel.findOne({ _id: req.params.id, isDeleted: false })

            if (!existingPackage) {
                return res.status(400).json({ message: "Package not found!" });
            }
            if (req.id != existingPackage.agentId && req.role != "admin") {
                return res.status(400).json({ message: "Unauthorized Access" });
            }
            const existingAgent = await agentModel.findOne({ _id: existingPackage.agentId, isDeleted: false })
            if (!existingAgent) {
                return res.status(400).json({ message: "Agent not found!" });
            }
            existingPackage.isDeleted = true;
            await existingPackage.save();
            existingAgent.packages.pull(existingPackage);
            await existingAgent.save();
            res.status(200).json({
                success: true,
                message: "Successfully Deleted."
            });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
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
        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }
        res.status(200).json(package);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

module.exports = { createPackage, updatePackage, deletePackage, getAllPackages, getPackageById }