// Import required modules and files
const db = require('../models');
const { certificate: Certificate, certificateType: CertificateType } = require('../models');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Creates a new certificate type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createCertificateType = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to create a new certificate type.`);
        const { name, description, yearsBeforeRefresher = 3 } = req.body;

        const certificateType = await CertificateType.create({ name, description, yearsBeforeRefresher });

        logger.info(`[${fn}]: Certificate type created successfully`);
        res.status(201).json({ certificateType });
    } catch (error) {
        logger.error(`[${fn}]: Error creating certificate type`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error creating certificate type', error });
    }
};


/**
 * Fetch all certificate types
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllCertificateTypes = async (req, res) => {
    logger.info(`[${fn}]: Attempting to fetch all certificate types.`);
    try {
        logger.info(`[${fn}]: Attempting to fetch all certificate types.`);
        const certificateTypes = await CertificateType.findAll();
        res.status(200).json({ certificateTypes });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching certificate types`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching certificate types', error });
    }
};

/**
 * Fetch certificate type by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCertificateTypeById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch certificate type by ID`);
        const { id } = req.params;
        const certificateType = await CertificateType.findByPk(id);

        if (!certificateType) {
            logger.info(`[${fn}]: Certificate type not found`);
            return res.status(404).json({ message: 'Certificate type not found' });
        }

        res.status(200).json({ certificateType });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching certificate type`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching certificate type', error });
    }
};

/**
 * Update certificate type by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateCertificateType = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to update certificate type by ID`);
        const { id } = req.params;
        const { name, description, yearsBeforeRefresher } = req.body;

        if (!id || !name || !description) {
            logger.info(`Invalid input data: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const certificateType = await CertificateType.findByPk(id);

        if (!certificateType) {
            logger.info(`Certificate type with ID ${id} not found`);
            return res.status(404).json({ message: 'Certificate type not found' });
        }

        await certificateType.update({ name, description, yearsBeforeRefresher });
        logger.info(`Certificate type with ID ${id} updated successfully`);
        res.status(200).json({ message: 'Certificate type updated successfully', certificateType });
    } catch (error) {
        logger.error(`Error updating certificate type: ${error.message}`);
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error updating certificate type', error });
    }
};

/**
 * Delete certificate type by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteCertificateType = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to delete certificate type by ID`);
        const { id } = req.params;
        const certificateType = await CertificateType.findByPk(id);

        if (!certificateType) {
            logger.info(`Certificate type with ID ${id} not found`);
            return res.status(404).json({ message: 'Certificate type not found' });
        }

        await certificateType.destroy();
        logger.info(`Certificate type with ID ${id} deleted successfully`);
        res.status(200).json({ message: 'Certificate type deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting certificate type: ${error.message}`);
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error deleting certificate type', error });
    }
};