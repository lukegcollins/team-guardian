// Import required modules and files
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { user: User } = require('../models');
const roleController = require('./roleController');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Registers a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const roleId = await roleController.findOrCreateVolunteerRole(); // Call the function and await the returned value

        // Check if the email is already registered.
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            logger.info(`[${fn}]: Email already registered`);
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash the password.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user.
        const user = await User.create({ firstName, lastName, email, password: hashedPassword, roleId });

        logger.info(`[${fn}]: User registered successfully`);

        res.status(201).json({ user: user });
    } catch (error) {
        logger.error(`[${fn}]: Error registering user`, { error });
        res.status(500).json({ message: 'Error registering user', error });
    }
};

/**
 * Logs in a user
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email.
        logger.debug(`[${fn}]: Querying database for user by email: ${email}`);

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            logger.debug(`[${fn}]: User with email ${email} not found.`);
            return res.status(404).json({ message: 'User not found' });
        }
        logger.debug(`[${fn}]: Found user with email ${email} and an ID of ${user.id.toString()}.`);

        // Compare the provided password with the stored hashed password.
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.info(`[${fn}]: Invalid password`);
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Update the user's activeAt variable to the current date and time.
        user.activeAt = new Date();
        await user.save();

        // Generate a JSON Web Token.
        const token = jwt.sign({ id: user.id, email: user.email, role: user.roleId }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });

        logger.info(`[${fn}]: User logged in successfully`, { UserId: user.id.toString() });

        res.status(200).json({ message: `${user.firstName} ${user.lastName} logged in successfully.`, token: token });
    } catch (error) {
        logger.error(`[${fn}]: Error logging in`, { error });
        console.log(error)
        res.status(500).json({ message: 'Error logging in', error });
    }
};