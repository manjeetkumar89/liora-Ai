const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authUserMiddleware(req,res, next) {
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}

module.exports = {
    authUserMiddleware
}