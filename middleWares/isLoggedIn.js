const jwt = require('jsonwebtoken')
const catchAsyncError = require('./catchAsyncError');
const User = require('../models/users');

const isLoggedIn = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.token;
    console.log(req.cookies)
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = isLoggedIn