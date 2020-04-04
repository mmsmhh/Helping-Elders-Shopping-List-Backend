const jwt = require('jsonwebtoken');
const config = require('../configurations');
const User = require('../models/user');

const isAuthenticated = async (req, res, next) => {
    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                error: null,
                msg: 'Please login first to access our services.',
                data: null,
            });
        }

        const decodedToken = await jwt.verify(token, config.SECRET);

        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({
                error: null,
                msg: 'Your token is not valid.',
                data: null,
            });
        }

        req.user = user;

        next();

    } catch {
        return res.status(401).json({
            error: null,
            msg: 'Your token is not valid.',
            data: null,
        });
    }

};

module.exports = isAuthenticated;
