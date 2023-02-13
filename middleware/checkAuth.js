require('dotenv').config();
const JWT = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        // console.log(authorization);
        if (!authorization) {
            res.sendStatus(401);
        } else {
            const token = authorization.split(' ')[1];
            console.log(token);
            console.log(1);
            const decode = JWT.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            console.log(2);
            req.user = decode;
            next();
        }
    } catch {
        res.sendStatus(401);
    }
};

module.exports = checkAuth;
