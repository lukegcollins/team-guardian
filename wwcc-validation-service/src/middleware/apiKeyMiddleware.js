// Import required modules and files
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Middleware to check if the Authorization bearer token is valid.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} next - The next middleware function.
 * @returns {Object} - The response object on an invalid Authorization bearer token.
 * @async
 * @function authMiddleware
 * @example authMiddleware();
 */
module.exports = () => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No Authorization header provided' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No bearer token provided' });
        }

        const validApiKeys = process.env.API_KEYS.split(',');
        validApiKeys.push(process.env.WWCCVS_API_KEY);

        if (!validApiKeys.includes(token)) {
            return next(new Error('Invalid token'));
        }

        next();
    };
};
