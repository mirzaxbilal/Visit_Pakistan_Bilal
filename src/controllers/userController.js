const userModel = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();
const SECRET_KEY_access = process.env.SECRET_KEY_ACCESS;
const SECRET_KEY_refresh = process.env.SECRET_KEY_REFRESH;

const signup = async (req, res) => {

    const { username, email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email: email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const result = await userModel.create({
            username: username,
            email: email,
            password: hashedPassword,
            isDeleted: false

        });


        const token = jwt.sign({ id: result._id }, SECRET_KEY_access, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: result._id }, SECRET_KEY_refresh, { expiresIn: '2h' });
        res.status(201).json({ user: result, token: token, refreshToken: refreshToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const signin = async (req, res) => {

    const { email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email: email, isDeleted: false });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        const matchPassword = await bcryptjs.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: existingUser._id }, SECRET_KEY_access, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: existingUser._id }, SECRET_KEY_refresh, { expiresIn: '2h' });

        res.status(201).json({ email: existingUser.email, token: token, refreshToken: refreshToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

const getProfile = async (req, res) => {
    const existingUser = await userModel.findOne({ _id: req.userId, isDeleted: false })
    if (!existingUser) {
        return res.status(400).json({ message: "User not found!" });
    }
    res.status(200).json({ user_name: existingUser.username, email: existingUser.email, password: existingUser.password });

}

const updateProfile = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ _id: req.userId, isDeleted: false })
    if (!existingUser) {
        return res.status(400).json({ message: "User not found!" });
    }
    if (username) existingUser.username = username;
    if (email) existingUser.email = email;
    if (password) {
        const hashedPassword = await bcryptjs.hashSync(password);
        existingUser.password = hashedPassword;
    }
    await existingUser.save();
    res.status(200).json({
        success: true,
        message: "Profile updated successfully."
    });
}

const deleteProfile = async (req, res) => {

    try {
        const existingUser = await userModel.findOne({ _id: req.userId, isDeleted: false })
        if (!existingUser) {
            return res.status(400).json({ message: "User not found!" });
        }
        existingUser.isDeleted = true;
        await existingUser.save();
        res.status(200).json({
            success: true,
            message: "Successfully Deleted."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }


}

const refreshtoken = async (req, res) => {

    try {

        const existingUser = await userModel.findById(req.userId);
        const token = jwt.sign({ id: existingUser._id }, SECRET_KEY_access, { expiresIn: '10m' });
        res.status(201).json({ email: existingUser.email, token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }


}


module.exports = { signup, signin, getProfile, updateProfile, deleteProfile, refreshtoken };
