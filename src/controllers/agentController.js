const Agent = require('../models/agent');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();
const SECRET_KEY_access = process.env.SECRET_KEY_ACCESS;
const SECRET_KEY_refresh = process.env.SECRET_KEY_REFRESH;

const createAgent = async (req, res) => {
    try {
        const { name, phone, email, password, cnic_image, license_image } = req.body;

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

        res.status(201).json({ email: existingAgent.email, token: token, refreshToken: refreshToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

const updateAgent = async (req, res) => {
    try {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getAllAgents = async (req, res) => {
    try {
        const agents = await Agent.find({ isDeleted: false });
        res.status(200).json(agents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getAgentById = async (req, res) => {
    try {
        const agent = await Agent.find({ _id: req.params.id, isDeleted: false });
        res.status(200).json(agent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const deleteAgent = async (req, res) => {
    try {
        const agentId = req.params.id;

        const existingAgent = await Agent.findOne({ _id: agentId, isDeleted: false });
        if (!existingAgent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        existingAgent.isDeleted = true;
        await existingAgent.save();

        res.status(200).json({ message: "Agent marked as deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = { createAgent, getAllAgents, updateAgent, getAgentById, deleteAgent, signin };