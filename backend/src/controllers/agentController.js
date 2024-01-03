const Agent = require('../models/agent');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserSignupValidation, UserLoginValidation, UserUpdateProfileValidation, AgentSignupValidation, AgentLoginValidation, AgentUpdateValidation } = require('../validator/schemaValidator')
const dotenv = require('dotenv').config();
const SECRET_KEY_access = process.env.SECRET_KEY_ACCESS;
const SECRET_KEY_refresh = process.env.SECRET_KEY_REFRESH;

const createAgent = async (req, res) => {
    try {
        const { name, phone, email, password, cnic_image, license_image } = req.body;

        try {
            const validate = await AgentSignupValidation.validateAsync(req.body);
        } catch (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const phoneCheck = await Agent.findOne({ phone: phone, isDeleted: false });
        if (phoneCheck) {
            return res.status(404).json({ message: "Phone number already exists." });
        }

        const emailCheck = await Agent.findOne({ email: email, isDeleted: false });
        if (emailCheck) {
            return res.status(404).json({ message: "Email already exists." });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newAgent = new Agent({
            name,
            phone,
            email,
            password: hashedPassword,
            cnic_image,
            license_image,
            isDeleted: false,
        });

        const savedAgent = await newAgent.save();

        const token = jwt.sign({ id: savedAgent._id, role: "agent" }, SECRET_KEY_access, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: savedAgent._id, role: "agent" }, SECRET_KEY_refresh, { expiresIn: '2h' });

        res.status(201).json({ message: "Agent created successfully", agent: savedAgent, token: token, refreshToken: refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const signin = async (req, res) => {

    const { email, password } = req.body;
    try {
        try {
            const validate = await AgentLoginValidation.validateAsync(req.body);
        } catch (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const existingAgent = await Agent.findOne({ email: email, isDeleted: false });
        if (!existingAgent) {
            return res.status(400).json({ message: "Agent not found!" });
        }

        const matchPassword = await bcryptjs.compare(password, existingAgent.password);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: existingAgent._id, role: "agent" }, SECRET_KEY_access, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: existingAgent._id, role: "agent" }, SECRET_KEY_refresh, { expiresIn: '2h' });

        res.status(201).json({ existingAgent, token: token, refreshToken: refreshToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

const updateAgent = async (req, res) => {
    try {
        if (req.role == "admin" || (req.role == "agent" && req.id == req.params.id)) {
            try {
                const validate = await AgentUpdateValidation.validateAsync(req.body);
            } catch (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const agentId = req.params.id;
            const existingAgent = await Agent.findOne({ _id: agentId, isDeleted: false });
            if (!existingAgent) {
                return res.status(404).json({ message: "Agent not found." });
            }

            if (req.body.name) {
                existingAgent.name = req.body.name;
            }
            if (req.body.phone) {
                existingAgent.phone = req.body.phone;
            }
            if (req.body.email) {
                existingAgent.email = req.body.email;
            }
            if (req.body.password) {
                const password = req.body.password;
                const salt = await bcryptjs.genSalt(10);
                const hashedPassword = await bcryptjs.hash(password, salt);
                existingAgent.password = hashedPassword;
            }
            if (req.body.cnic_image) {
                existingAgent.cnic_image = req.body.cnic_image;
            }
            if (req.body.license_image) {
                existingAgent.cnic_image = req.body.license_image;
            }
            await existingAgent.save();

            res.status(201).json({ message: "Agent updated successfully", agent: existingAgent });
        } else {
            res.status(401).json({ message: "Unauthorized action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getAllAgents = async (req, res) => {
    try {
        if (req.role == "admin") {
            const agents = await Agent.find({ isDeleted: false });
            res.status(200).json(agents);
        } else {
            res.status(401).json({ message: "Unauthorized action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getAgentById = async (req, res) => {
    try {
        console.log(req.role);
        console.log(req.id);
        if (req.role == "admin" || (req.role == "agent" && req.id == req.params.id)) {
            const agent = await Agent.findOne({ _id: req.params.id, isDeleted: false });
            res.status(200).json(agent);
        } else {
            console.log("1")
            res.status(401).json({ message: "Unauthorized action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const deleteAgent = async (req, res) => {
    try {
        if (req.role == "admin" || (req.role == "agent" && req.id == req.params.id)) {
            const agentId = req.params.id;

            const existingAgent = await Agent.findOne({ _id: agentId, isDeleted: false });
            if (!existingAgent) {
                return res.status(404).json({ message: "Agent not found" });
            }

            existingAgent.isDeleted = true;
            await existingAgent.save();

            res.status(200).json({ message: "Agent marked as deleted" });
        } else {
            res.status(401).json({ message: "Unauthorized action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getAgentPackages = async (req, res) => {
    try {
        if (req.role == "admin" || (req.role == "agent" && req.id == req.params.id)) {
            const agentId = req.params.id;

            // Check if the agent exists and is not deleted
            const existingAgent = await Agent.findOne({ _id: agentId, isDeleted: false })
            // .populate({
            //     path: 'locations',
            //     select: 'name'
            // });
            if (!existingAgent) {
                return res.status(404).json({ message: "Agent not found or deleted." });
            }

            const agent = await existingAgent.populate({
                path: 'packages',
                populate: {
                    path: 'locations',
                    select: 'name'
                }
            });



            const agentPackages = agent.packages;

            res.status(200).json(agentPackages);
        } else {
            res.status(401).json({ message: "Unauthorized action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};




const refreshtoken = async (req, res) => {

    try {

        const existingAgent = await Agent.findById(req.id);
        const token = jwt.sign({ id: existingAgent._id, role: "agent" }, SECRET_KEY_access, { expiresIn: '10m' });
        res.status(201).json({ email: existingAgent.email, token: token });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }


}

module.exports = { createAgent, getAllAgents, updateAgent, getAgentById, deleteAgent, signin, refreshtoken, getAgentPackages };
