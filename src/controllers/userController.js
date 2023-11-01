const userModel = require("../models/user");
const packageModel = require("../models/tourPackage");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();
const SECRET_KEY_access = process.env.SECRET_KEY_ACCESS;
const SECRET_KEY_refresh = process.env.SECRET_KEY_REFRESH;

const signup = async (req, res) => {

    const { username, password, email, phone } = req.body;
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
            phone: phone,
            role: "user",
            isDeleted: false
        });


        const token = jwt.sign({ id: result._id, role: result.role }, SECRET_KEY_access, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: result._id, role: result.role }, SECRET_KEY_refresh, { expiresIn: '2h' });
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

        const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, SECRET_KEY_access, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: existingUser._id, role: existingUser.role }, SECRET_KEY_refresh, { expiresIn: '2h' });




        res.status(201).json({ email: existingUser, token: token, refreshToken: refreshToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

const getProfile = async (req, res) => {
    if (req.role == "admin" || (req.role == "user" && req.id == req.params.id)) {
        const existingUser = await userModel.findOne({ _id: req.params.id, isDeleted: false })
        if (!existingUser) {
            return res.status(400).json({ message: "User not found!" });
        }
        res.status(200).json(existingUser);
    } else {
        return res.status(400).json({ message: "Unauthorised for this action" });
    }
}

const getAllUsers = async (req, res) => {
    if (req.role == "admin") {
        const existingUsers = await userModel.find({ isDeleted: false })
        res.status(200).json(existingUsers);
    } else {
        return res.status(400).json({ message: "Unauthorised for this action" });
    }

}


const updateProfile = async (req, res) => {
    try {

        if (req.role == "admin" || (req.role == "user" && req.id == req.params.id)) {
            const { username, email, password, phone, favourite, remove_favourite, role } = req.body;

            const existingUser = await userModel.findOne({ _id: req.params.id, isDeleted: false })
            if (!existingUser) {
                return res.status(400).json({ message: "User not found!" });
            }
            if (username) existingUser.username = username;
            if (email) existingUser.email = email;
            if (password) {
                const hashedPassword = await bcryptjs.hashSync(password);
                existingUser.password = hashedPassword;
            }
            if (phone) {
                existingUser.phone = phone;
            }
            if (favourite) {
                const existingPackage = await packageModel.findOne({ _id: favourite, isDeleted: false })
                if (!existingPackage) {
                    return res.status(400).json({ message: "Package not found!" });
                }
                existingUser.favourites.push(existingPackage);
            }
            if (remove_favourite) {
                const existingPackage = await packageModel.findOne({ _id: remove_favourite, isDeleted: false })
                if (!existingPackage) {
                    return res.status(400).json({ message: "Package not found!" });
                }
                try {
                    existingUser.favourites.pull(existingPackage);
                } catch (err) {
                    console.log(error);
                    return res.status(500).json({ message: "Package provided is not a favorite" });
                };
            }
            if (role) {
                if (req.role == "admin") {
                    existingUser.role = req.body.role;
                } else {
                    return res.status(500).json({ message: "Unauthorized for this action" });
                }
            }

            await existingUser.save();
            res.status(200).json({
                success: true,
                message: "Profile updated successfully.",
                existingUser
            });
        } else {
            return res.status(400).json({ message: "Unauthorised for this action" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const deleteProfile = async (req, res) => {

    try {
        if (req.role == 'admin' || (req.role == "user" && req.id == req.params.id)) {
            const existingUser = await userModel.findOne({ _id: req.params.id, isDeleted: false })
            if (!existingUser) {
                return res.status(400).json({ message: "User not found!" });
            }
            existingUser.isDeleted = true;
            await existingUser.save();
            res.status(200).json({
                success: true,
                message: "Successfully Deleted."
            });
        } else {
            return res.status(400).json({ message: "Unauthorised for this action" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }


}

const refreshtoken = async (req, res) => {

    try {

        const existingUser = await userModel.findById(req.id);
        const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, SECRET_KEY_access, { expiresIn: '10m' });
        res.status(201).json({ email: existingUser.email, token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }


}


module.exports = { signup, signin, getProfile, updateProfile, deleteProfile, refreshtoken, getAllUsers };
