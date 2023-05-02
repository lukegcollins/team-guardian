// Import required modules and files
const dotenv = require("dotenv").config();
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Checks if the users role is allowed to access the route.
 * 
 * @param {Object} allowedRoles - An array of allowed roles.
 * @returns {Object} - The response object on an invalid token.
 * @throws {Object} - The error object on an invalid token.
 * @async
 * @function roleMiddleware 
 * @example roleMiddleware(['admin', 'manager']);
 */
module.exports = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
            if (allowedRoles.includes(decoded.role)) {
                req.user = decoded;
                next();
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token', error });
        }
    };
};
