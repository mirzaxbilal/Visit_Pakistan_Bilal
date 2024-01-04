const HomePageModel = require("../models/homePage");

const getHomePageContent = async (req, res) => {
    try {
        const homePageContent = await HomePageModel.findOne();

        if (!homePageContent) {
            return res.status(404).json({ message: "Homepage content not found" });
        }

        res.status(200).json(homePageContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateHomePageContent = async (req, res) => {
    try {
        if (req.role === "admin") {
            const {
                WelcomeHeading,
                WelcomeTagline,
                WelcomeVideo,
                LocationsHeading,
                PlanTripHeading,
                PlanTripDescripton,
                PlanTripImage,
                PlanTripButton
            } = req.body;

            const homePageContent = await HomePageModel.findOne();

            if (!homePageContent) {
                return res.status(404).json({ message: "Homepage content not found" });
            }

            homePageContent.WelcomeHeading = WelcomeHeading || homePageContent.WelcomeHeading;
            homePageContent.WelcomeTagline = WelcomeTagline || homePageContent.WelcomeTagline;
            homePageContent.WelcomeVideo = WelcomeVideo || homePageContent.WelcomeVideo;
            homePageContent.LocationsHeading = LocationsHeading || homePageContent.LocationsHeading;
            homePageContent.PlanTripHeading = PlanTripHeading || homePageContent.PlanTripHeading;
            homePageContent.PlanTripDescripton = PlanTripDescripton || homePageContent.PlanTripDescripton;
            homePageContent.PlanTripImage = PlanTripImage || homePageContent.PlanTripImage;
            homePageContent.PlanTripButton = PlanTripButton || homePageContent.PlanTripButton;

            await homePageContent.save();

            res.status(200).json({ homePageContent, message: "Homepage content updated successfully." });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const createHomePageContent = async (req, res) => {
    try {
        if (req.role === "admin") {
            const {
                WelcomeHeading,
                WelcomeTagline,
                WelcomeVideo,
                LocationsHeading,
                PlanTripHeading,
                PlanTripDescripton,
                PlanTripImage,
                PlanTripButton
            } = req.body;

            const homePageContent = new HomePageModel({
                WelcomeHeading,
                WelcomeTagline,
                WelcomeVideo,
                LocationsHeading,
                PlanTripHeading,
                PlanTripDescripton,
                PlanTripImage,
                PlanTripButton
            });

            await homePageContent.save();

            res.status(201).json({ homePageContent, message: "Homepage content created successfully." });
        } else {
            res.status(401).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    getHomePageContent,
    updateHomePageContent,
    createHomePageContent
};
