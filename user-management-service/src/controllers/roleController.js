// Import required modules and files
const db = require('../models');
const { user: User, role: Role } = require('../models');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Creates a new role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createRole = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to create a new role.`);
        const { name, description } = req.body;

        const role = await Role.create({ name, description });

        logger.info(`[${fn}]: Role created successfully`);
        res.status(201).json({ role });
    } catch (error) {
        logger.error(`[${fn}]: Error creating role`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error creating role', error });
    }
};

/**
 * Finds or creates the Volunteer role
 * @returns {number} - The id of the Volunteer role
 */
exports.findOrCreateVolunteerRole = async () => {
    try {
        logger.info(`[${fn}]: Attempting to find or create the Volunteer role.`);
        const volunteerRoleName = 'Volunteer';
        const volunteerRoleDescription = 'The team volunteer role.';

        let volunteerRole = await Role.findOne({ where: { name: volunteerRoleName } });

        if (!volunteerRole) {
            // If the volunteer role does not exist, create it
            volunteerRole = await Role.create({ name: volunteerRoleName, description: volunteerRoleDescription });
        }

        logger.info(`[${fn}]: Volunteer role found or created successfully`);
        return volunteerRole.id;
    } catch (error) {
        logger.error(`[${fn}]: Error finding or creating volunteer role`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        throw new Error('Error finding or creating volunteer role', error);
    }
}

/**
 * Fetch all roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllRoles = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all roles.`);
        const roles = await Role.findAll();
        res.status(200).json({ roles });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching roles`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching roles', error });
    }
};

/**
 * Fetch role by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRoleById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch role by ID`);
        const { id } = req.params;
        const role = await Role.findByPk(id);

        if (!role) {
            logger.info(`[${fn}]: Role not found`);
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ role });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching role`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching role', error });
    }
};

/**
 * Update role by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateRole = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to update role by ID`);
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id || !name || !description) {
            logger.info(`Invalid input data: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const role = await Role.findByPk(id);

        if (!role) {
            logger.info(`Role with ID ${id} not found`);
            return res.status(404).json({ message: 'Role not found' });
        }

        await role.update({ name, description });
        logger.info(`Role with ID ${id} updated successfully`);
        res.status(200).json({ message: 'Role updated successfully', role });
    } catch (error) {
        logger.error(`[${fn}]: Error updating role: ${error.message}`);
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error updating role', error });
    }
};

/**
 * Delete role by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteRole = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to delete role by ID`);
        const { id } = req.params;
        const role = await Role.findByPk(id);

        if (!role) {
            logger.info(`Role with ID ${id} not found`);
            return res.status(404).json({ message: 'Role not found' });
        }

        await role.destroy();
        logger.info(`Role with ID ${id} deleted successfully`);
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        logger.error(`[${fn}]: Error deleting role: ${error.message}`);
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error deleting role', error });
    }
};
