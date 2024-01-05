const AboutPageModel = require("../models/aboutPage"); // Make sure the path is correct

const getAboutPageContent = async (req, res) => {
    try {
        const aboutPageContent = await AboutPageModel.findOne();

        if (!aboutPageContent) {
            return res.status(404).json({ message: "About page content not found" });
        }

        res.status(200).json(aboutPageContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateAboutPageContent = async (req, res) => {
    try {
        if (req.role === "admin") {
            const {
                AboutTagline,
                AboutImage,
                AboutDescription,
                Reviews
            } = req.body;

            const aboutPageContent = await AboutPageModel.findOne();

            if (!aboutPageContent) {
                return res.status(404).json({ message: "About page content not found" });
            }

            aboutPageContent.AboutTagline = AboutTagline || aboutPageContent.AboutTagline;
            aboutPageContent.AboutImage = AboutImage || aboutPageContent.AboutImage;
            aboutPageContent.AboutDescription = AboutDescription || aboutPageContent.AboutDescription;
            aboutPageContent.Reviews = Reviews || aboutPageContent.Reviews;

            await aboutPageContent.save();

            res.status(200).json({ aboutPageContent, message: "About page content updated successfully." });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const createAboutPageContent = async (req, res) => {
    try {
        if (req.role === "admin") {
            const {
                AboutTagline,
                AboutImage,
                AboutDescription,
                Reviews
            } = req.body;

            const aboutPageContent = new AboutPageModel({
                AboutTagline,
                AboutImage,
                AboutDescription,
                Reviews
            });

            await aboutPageContent.save();

            res.status(201).json({ aboutPageContent, message: "About page content created successfully." });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    getAboutPageContent,
    updateAboutPageContent,
    createAboutPageContent
};
