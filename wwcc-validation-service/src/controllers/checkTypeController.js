// Import required modules and files
const db = require('../models');
const { workingWithChildrenCheck: WWCC, checkType: CheckType } = require('../models');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Creates a new working with children's check type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createCheckType = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to create a new WWCC type.`);
        const { name, description } = req.body;

        if (!name || !description) {
            logger.info(`[${fn}]: Missing required fields`);
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const checkType = await CheckType.create({ name, description });

        logger.info(`[${fn}]: WWCC type created successfully`);
        res.status(201).json({ checkType });
    } catch (error) {
        logger.error(`[${fn}]: Error creating WWCC type`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error creating WWCC type', error });
    }
};

/**
 * Fetch all WWCC types
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllCheckTypes = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all WWCC types.`);
        const checkTypes = await CheckType.findAll();
        res.status(200).json({ checkTypes });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching WWCC types`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching WWCC types', error });
    }
};

/**
 * Fetch WWCC type by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCheckTypeById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch WWCC type by ID`);
        const { id = 0 } = req.params;
        const checkType = await CheckType.findByPk(id);

        if (!checkType) {
            logger.info(`[${fn}]: A WWCC type with ID ${id} was not found.`);
            return res.status(404).json({ message: `A WWCC type with ID ${id} was not found.` });
        }

        res.status(200).json({ checkType });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching WWCC type`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching WWCC type', error });
    }
};

/**
 * Update WWCC type by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateCheckType = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to update WWCC type by ID`);
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id || !name || !description) {
            logger.info(`Invalid input data: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const checkType = await CheckType.findByPk(id);

        if (!checkType) {
            logger.info(`WWCC type with ID ${id} not found`);
            return res.status(404).json({ message: `A WWCC type with ID ${id} was not found.` });
        }

        await checkType.update({ name, description });
        logger.info(`WWCC type with ID ${id} updated successfully`);
        res.status(200).json({ message: 'WWCC type updated successfully', checkType });
    } catch (error) {
        logger.error(`Error updating WWCC type: ${error.message}`);
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error updating WWCC type', error });
    }
};

/**
 * Delete WWCC type by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteCheckType = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to delete WWCC type by ID`);
        const { id } = req.params;
        const checkType = await CheckType.findByPk(id);

        if (!checkType) {
            logger.info(`[${fn}]: A WWCC type with ID ${id} was not found.`);
            return res.status(404).json({ message: `A WWCC type with ID ${id} was not found.` });
        }

        await checkType.destroy();
        logger.info(`[${fn}]: WWCC type with ID ${id} deleted successfully`);
        res.status(204).json({ message: 'WWCC type deleted successfully', typeName: checkType.name });
    } catch (error) {
        logger.error(`[${fn}]: Error deleting WWCC type: ${error.message}`);
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error deleting WWCC type', error });
    }
};
