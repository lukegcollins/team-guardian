// Import required modules and files
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const { user: User, role: Role } = require('../models');
const roleController = require('./roleController');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Creates a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUser = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to create a new user.`);
        const { firstName, lastName, email, password, roleId } = req.body;

        // Check if the email is already registered.
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            logger.info(`[${fn}]: Email already registered`);
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Check if the role exists.
        const existingRole = await Role.findOne({ where: { id: roleId } });
        if (!existingRole) {
            logger.info(`[${fn}]: No roles exist with an id of ${roleId}`);
            return res.status(409).json({ message: `No roles exist with id ${roleId}` });
        }

        // Hash the password.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user.
        const user = await User.create({ firstName, lastName, email, password: hashedPassword, roleId });

        logger.info(`[${fn}]: User registered successfully`);

        res.status(201).json({ user: user });
    } catch (error) {
        logger.error(`[${fn}]: Error registering user`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error registering user', error });
    }
};

/**
 * Fetch all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllUsers = async (req, res) => {
    logger.info(`[${fn}]: Attempting to fetch all users.`);
    try {
        const users = await User.findAll({
            include: { model: Role, as: "Role" },
            attributes: { exclude: ["roleId"] },
        });


        res.status(200).json({ users });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching users`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

/**
 * Fetch user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserById = async (req, res) => {
    logger.info(`[${fn}]: Attempting to fetch user by ID`);
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: { model: Role, as: "Role" },
            attributes: { exclude: ["roleId"] },
        });

        if (!user) {
            logger.info(`[${fn}]: User not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching user`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

/**
 * Update user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
    logger.info(`[${fn}]: Attempting to update user by ID`);
    try {
        const { id } = req.params;
        const { firstName, lastName, email, password, roleId } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            logger.info(`[${fn}]: User not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ firstName, lastName, email, password, roleId });

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        logger.error(`[${fn}]: Error updating user`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error updating user', error });
    }
};


/**
 * Update current authenticated user (JWT required)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateCurrentUser = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to update current user`);
        const { id } = req.user; // The 'id' should be provided in the req.user object by the authentication middleware
        const { firstName, lastName, email, password } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            logger.info(`[${fn}]: User not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ firstName, lastName, email, password });

        res.status(200).json({ message: 'User information updated successfully', user });
    } catch (error) {
        logger.error(`[${fn}]: Error updating user information`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error updating user information', error });
    }
};

/**
 * Delete user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            logger.info(`[${fn}]: User not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error(`[${fn}]: Error deleting user`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
