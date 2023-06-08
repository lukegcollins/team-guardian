// Import required modules and files
const db = require('../models');
const { membership: Membership, team: Team } = require('../models');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Creates a new team
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createTeam = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to create a new team.`);
        const { name, description } = req.body;

        const team = await Team.create({ name, description });

        logger.info(`[${fn}]: Team created successfully`);
        res.status(201).json({ team });
    } catch (error) {
        logger.error(`[${fn}]: Error creating team`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error creating team', error });
    }
};

/**
 * Fetch all teams
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllTeams = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all teams.`);
        const teams = await Team.findAll();
        res.status(200).json({ teams });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching teams`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching teams', error });
    }
};

/**
 * Fetch team by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTeamById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch team by ID`);
        const { id } = req.params;
        const team = await Team.findByPk(id);

        if (!team) {
            logger.info(`[${fn}]: Team not found`);
            return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json({ team });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching team`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching team', error });
    }
};

/**
 * Update team by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTeam = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to update team by ID`);
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id || !name || !description) {
            logger.info(`Invalid input data: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const team = await Team.findByPk(id);

        if (!team) {
            logger.info(`Team with ID ${id} not found`);
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.update({ name, description });
        logger.info(`Team with ID ${id} updated successfully`);
        res.status(200).json({ message: 'Team updated successfully', team });
    } catch (error) {
        logger.error(`Error updating team: ${error.message}`);
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error updating team', error });
    }
};

/**
 * Delete team by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteTeam = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to delete team by ID`);
        const { id } = req.params;
        const team = await Team.findByPk(id);

        if (!team) {
            logger.info(`Team with ID ${id} not found`);
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.destroy();
        logger.info(`Team with ID ${id} deleted successfully`);
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting team: ${error.message}`);
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error deleting team', error });
    }
};
