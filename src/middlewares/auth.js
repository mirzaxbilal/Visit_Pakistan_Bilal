const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();
const SECRET_KEY_access = process.env.SECRET_KEY_ACCESS;
const SECRET_KEY_refresh = process.env.SECRET_KEY_REFRESH;

const auth_access = (req, res, next) => {
    try {

        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token, SECRET_KEY_access);
            console.log("1", user);
            req.id = user.id;
            req.role = user.role;

        }
        else {
            res.status(401).json({ message: "Unauthorized User" });
        }
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized User" });
    }
}

const auth_refresh = (req, res, next) => {
    try {

        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token, SECRET_KEY_refresh);
            req.id = user.id;

        }
        else {
            res.status(401).json({ message: "Unauthorized User" });
        }
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized User" });
    }
}



module.exports = { auth_access, auth_refresh };