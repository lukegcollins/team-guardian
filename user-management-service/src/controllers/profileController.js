const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { user: User, role: Role } = require('../models');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

const fn = require('path').basename(__filename);

/**
 * Fetches the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCurrentUser = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findByPk(id, {
            include: { model: Role, as: "Role" },
            attributes: { exclude: ["roleId"] },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            activeAt: user.activeAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: {
                id: user.Role.id,
                name: user.Role.name,
                description: user.Role.description,
                createdAt: user.Role.createdAt,
                updatedAt: user.Role.updatedAt
            }
        };

        res.status(200).json({ user: userResponse });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching user`, { error });
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

/**
 * Updates the current user's information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateCurrentUser = async (req, res) => {
    const fn = "updateCurrentUser";
    try {
        const { id } = req.user;
        const { firstName, lastName, email, password } = req.body;

        // Find the user by email.
        logger.debug(`[${fn}]: Querying database for user by ID: ${id}`);

        let currentUser = await User.findByPk(id);
        if (!currentUser) {
            logger.error(`[${fn}]: User not found with ID: ${id}`, { status: 404 });
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the email is already registered or belongs to the current user
        logger.debug(`[${fn}]: Querying database for user by email: ${email}`);
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser && existingUser.email !== currentUser.email) {
            logger.error(`[${fn}]: User with email ${email} already exists.`, { status: 409 });
            return res.status(409).json({ message: 'This email is already registered' });
        }

        // Compare the provided password with the stored hashed password.
        const isPasswordValid = await bcrypt.compare(password, currentUser.password);
        if (!isPasswordValid) {
            logger.error(`[${fn}]: The Password is invalid for user ID: ${id}`, { status: 401 });
            return res.status(401).json({ message: 'The password provided is incorrect.' });
        }

        currentUser = await currentUser.update({ firstName, lastName, email });

        logger.info(`[${fn}]: User profile updated successfully for user ID: ${id}`, { status: 200 });

        const token = jwt.sign({ id: currentUser.id, email: currentUser.email, role: currentUser.roleId }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });

        res.status(200).json({ message: 'User profile updated successfully', currentUser, token });
    } catch (error) {
        logger.error(`[${fn}]: Error updating user information for user ID: ${id}`, { status: 500, error });
        res.status(500).json({ message: 'Error updating user information', error: error.message });
    }
};
