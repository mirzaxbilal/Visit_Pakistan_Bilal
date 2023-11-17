const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();
const SECRET_KEY_access = process.env.SECRET_KEY_ACCESS;
const SECRET_KEY_refresh = process.env.SECRET_KEY_REFRESH;

const auth_access = (req, res, next) => {
    try {
        console.log(req.headers.authorization);
        //const token = req.cookies.accessToken; //new line1
        let token = req.headers.authorization; //old line1

        if (token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token, SECRET_KEY_access);
            req.id = user.id;
            req.role = user.role;

            // jwt.verify(token, SECRET_KEY_access, (err, user) => {
            //     if (err) {
            //         return res.status(401).json({ success: false, message: "token is invalid" })
            //     }
            // })
            // req.user = user;

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



module.exports = { auth_access, auth_refresh };