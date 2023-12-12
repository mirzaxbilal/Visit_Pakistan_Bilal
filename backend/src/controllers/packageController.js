const packageModel = require("../models/tourPackage");
const agentModel = require("../models/agent");
const { CreatePackageValidation, UpdatePackageValidation } = require('../validator/packageValidator');

const createPackage = async (req, res) => {

    try {
        console.log(req.role);
        if (req.role == "agent") {
            try {
                const validate = await CreatePackageValidation.validateAsync(req.body);
            } catch (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const agent = await agentModel.findOne({ _id: req.id, isDeleted: false });

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
                locations: req.body.locations,
                agentId: agent,
                isDeleted: false,
                isApproved: false,

            });

            const savedPackage = await package.save();
            agent.packages.push(savedPackage);
            await agent.save();
            return res.status(201).json({ packageId: savedPackage._id, message: "Package created. Awaiting approval" });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const updatePackage = async (req, res) => {
    try {
        if (req.role == "admin" || (req.role == "agent")) {
            try {
                const validate = await UpdatePackageValidation.validateAsync(req.body);
            } catch (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const packageId = req.params.id;
            const existingPackage = await packageModel.findOne({ _id: packageId, isDeleted: false });

            if (!existingPackage) {
                return res.status(404).json({ message: "Package not found." });
            }
            console.log(req.id);
            console.log(existingPackage.agentId);
            if (req.id != existingPackage.agentId && req.role != "admin") {
                return res.status(400).json({ message: "Unauthorized Access" });
            }
            console.log(req.body)
            console.log(1);
            if (req.body.title) {
                existingPackage.title = req.body.title;
                if (req.role != "admin") {
                    existingPackage.isApproved = false;
                }
            }
            console.log(2);
            if (req.body.overview) {
                existingPackage.overview = req.body.overview;
                if (req.role != "admin") {
                    existingPackage.isApproved = false;
                }
            }
            console.log(3);
            if (req.body.whatsIncluded) {
                existingPackage.whatsIncluded = req.body.whatsIncluded;
                if (req.role != "admin") {
                    existingPackage.isApproved = false;
                }
            }
            console.log(4);
            if (req.body.tourItinerary) {
                existingPackage.tourItinerary = req.body.tourItinerary;
                if (req.role != "admin") {
                    existingPackage.isApproved = false;
                }
            }
            console.log(5);
            if (req.body.price) {
                existingPackage.price = req.body.price;
                if (req.role != "admin") {
                    existingPackage.isApproved = false;
                }
            }
            console.log(6);
            if (req.body.duration) {
                existingPackage.duration = req.body.duration;
                if (req.role != "admin") {
                    existingPackage.isApproved = false;
                }
            }
            console.log(7);
            if (req.body.images) {
                existingPackage.images = req.body.images;
                if (req.role != "admin") {
                    existingPackage.isApproved = false;
                }
            }
            console.log(8);
            if (req.body.locations) {
                existingPackage.locations = req.body.locations;
                if (req.role != "admin") {
                    existingPackage.isApproved = false;
                }
            }
            console.log(9);
            if ('isApproved' in req.body) {
                if (req.role == "admin") {
                    existingPackage.isApproved = req.body.isApproved;
                } else {
                    res.status(401).json({ message: "Unauthorized Access" });
                }
            }
            console.log(10);
            if ('isDeleted' in req.body) {
                if (req.role == "admin") {
                    existingPackage.isDeleted = req.body.isDeleted;
                } else {
                    res.status(401).json({ message: "Unauthorized Access" });
                }
            }

            await existingPackage.save();



            return res.status(201).json({ existingPackage, message: "Package updated" });
        } else {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
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
            return res.status(200).json({
                success: true,
                message: "Successfully Deleted."
            });
        } else {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getAllPackages = async (req, res) => {
    try {
        if (req.role === "admin") {
            const packages = await packageModel.find({ isDeleted: false }).populate({
                path: 'agentId',
                select: 'email phone'
            });
            return res.status(200).json(packages);

        } else {
            return res.status(401).json({ message: "Unauthorized Access--" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}


const getApporovedPackageById = async (req, res) => {
    try {

        const package = await packageModel.findOne({ _id: req.params.id, isDeleted: false }).populate({
            path: 'agentId',
            select: 'email phone'
        }).populate({
            path: 'locations',
            select: 'name'
        });

        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }
        if (package.isApproved) {
            res.status(200).json(package);
        } else {
            return res.status(404).json({ message: "Package not yet approved" });
        }

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }

}

const getPackageById = async (req, res) => {
    try {
        if (req.role == "admin" || (req.role == "agent")) {
            const package = await packageModel.findOne({ _id: req.params.id, isDeleted: false }).populate({
                path: 'agentId',
                select: 'email phone'
            }).populate({
                path: 'locations',
                select: 'name'
            });
            console.log(package);

            if (!package) {
                return res.status(404).json({ message: "Package not found" });
            } else if (req.id != package.agentId._id && req.role != "admin") {
                return res.status(400).json({ message: "Unauthorized Access" });
            } else {
                return res.status(200).json(package);

            }
        } else {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }

}

const getUnapprovedPackages = async (req, res) => {
    try {
        if (req.role === "admin") {
            const package = await packageModel.find({ isApproved: false, isDeleted: false }).populate({
                path: 'agentId',
                select: 'email phone'
            }).populate({
                path: 'locations', // Assuming 'locations' is the field that references the Location model
                select: 'name'
            });

            if (!package) {
                return res.status(404).json({ message: "Package not found" });
            }
            res.status(200).json(package);
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }

}

const getAprrovedPackages = async (req, res) => {
    try {

        const packages = await packageModel.find({ isApproved: true, isDeleted: false }).populate({
            path: 'agentId',
            select: 'email phone'
        }).populate({
            path: 'locations', // Assuming 'locations' is the field that references the Location model
            select: 'name'
        });
        return res.status(200).json(packages);



    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { createPackage, updatePackage, deletePackage, getAllPackages, getApporovedPackageById, getUnapprovedPackages, getAprrovedPackages, getPackageById }