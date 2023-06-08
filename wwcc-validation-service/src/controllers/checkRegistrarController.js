// Import required modules and files
const jwt = require("jsonwebtoken");
const db = require('../models');
const { workingWithChildrenCheck: WWCC, checkType: CheckType } = require('../models');
const fetchUser = require('../utils/userUtils');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Register a new working with children's check
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createRegistrarEntry = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to register a new working with children's check.`);
        const { typeId, userId, registrationNumber, expiryDate, isValidated = false } = req.body;

        if (!typeId || !userId || !registrationNumber || !expiryDate) {
            logger.info(`[${fn}]: Missing required fields`);
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const checkTypeExists = await CheckType.findOne({ where: { id: typeId } });
        if (!checkTypeExists) {
            logger.info(`[${fn}]: No WWCC type exists with an ID of ${typeId}`);
            return res.status(409).json({ message: `No WWCC type exists with an ID of ${typeId}.` });
        }

        const userExists = await fetchUser(userId);
        if (!userExists) {
            logger.info(`[${fn}]: No user exists with an ID of ${userId}`);
            return res.status(409).json({ message: `No user exists with an ID of ${userId}.` });
        }

        const workingWithChildrenCheck = await WWCC.create({ typeId, userId, registrationNumber, expiryDate, isValidated });

        logger.info(`[${fn}]: Working with children's check registered successfully`);
        res.status(201).json({ workingWithChildrenCheck });
    } catch (error) {
        logger.error(`[${fn}]: Error registering working with children's check`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: "Error registering working with children's check", error });
    }
};

/**
 * Get all working with children check registrar entries
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllRegistrarEntries = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all working with children check registrar entries.`);

        const registrarEntries = await WWCC.findAll();

        if (!registrarEntries) {
            logger.info(`[${fn}]: There are no working with children check registrar entries recorded in the database.`);
            return res.status(404).json({ message: `There are no working with children check registrar entries recorded in the database.` });
        }

        const registrarEntryResponses = [];

        for (const entry of registrarEntries) {
            // Prepare the response object
            const registrarEntryResponse = {
                referenceId: entry.id,
                typeId: entry.typeId,
                userId: entry.userId,
                registrationNumber: entry.registrationNumber,
                expiryDate: entry.expiryDate,
                isValidated: entry.isValidated,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
            };

            registrarEntryResponses.push(registrarEntryResponse);
        }

        logger.info(`[${fn}]: Fetched all working with children check registrar entries successfully.`);
        res.status(200).json({ workingWithChildrenChecks: registrarEntryResponses });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching all working with children check registrar entries.`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching all working with children check registrar entries.', error });
    }
};

/**
 * Get all working with children check registrar entries (Extended)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllRegistrarEntriesExtended = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all working with children check registrar entries.`);

        const registrarEntries = await WWCC.findAll({
            include: [
                {
                    model: CheckType,
                    as: "CheckType",
                    attributes: ['id', 'name', 'description'],
                },
            ],
        });

        if (!registrarEntries) {
            logger.info(`[${fn}]: There are no working with children check registrar entries recorded in the database.`);
            return res.status(404).json({ message: `There are no working with children check registrar entries recorded in the database.` });
        }

        const registrarEntryResponses = [];

        for (const entry of registrarEntries) {

            // Fetch user details using fetchUser method
            const userDetails = await fetchUser(entry.userId);
            if (!userDetails) {
                logger.info(`[${fn}]: No user found with ID ${entry.userId}`);
                continue;
            }

            // Prepare the response object
            const registrarEntryResponse = {
                referenceId: entry.id,
                checkType: entry.CheckType,
                userDetails,
                registrationNumber: entry.registrationNumber,
                expiryDate: entry.expiryDate,
                isValidated: entry.isValidated,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
            };

            registrarEntryResponses.push(registrarEntryResponse);
        }

        logger.info(`[${fn}]: Fetched all working with children check registrar entries successfully.`);
        res.status(200).json({ workingWithChildrenChecks: registrarEntryResponses });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching all working with children check registrar entries.`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching all working with children check registrar entries.', error });
    }
};

/**
 * Get a working with children check registrar entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRegistrarEntryById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch working with children check registrar entry by ID.`);
        const referenceId = req.params.id;

        const registrarEntry = await WWCC.findOne({
            where: { id: referenceId },
            include: [
                {
                    model: CheckType,
                    as: "CheckType",
                    attributes: ['id', 'name', 'description'],
                },
            ],
        });

        if (!registrarEntry) {
            logger.info(`[${fn}]: We were unable to locate a working with children check registrar entry with ID ${referenceId}.`);
            return res.status(404).json({ message: `We were unable to locate a working with children check registrar entry with ID ${referenceId}.` });
        }

        // Fetch user details using fetchUser method
        const userDetails = await fetchUser(registrarEntry.userId);
        if (!userDetails) {
            logger.info(`[${fn}]: No user found with an ID of ${registrarEntry.userId}.`);
            return res.status(404).json({ message: `No user found with an ID of ${WWCC.userId}.` });
        }

        // Prepare the response object
        const registrarEntryResponse = {
            referenceId: registrarEntry.id,
            checkType: registrarEntry.CheckType,
            userDetails: userDetails,
            registrationNumber: registrarEntry.registrationNumber,
            expiryDate: registrarEntry.expiryDate,
            isValidated: registrarEntry.isValidated,
            createdAt: registrarEntry.createdAt,
            updatedAt: registrarEntry.updatedAt
        };

        logger.info(`[${fn}]: Fetched working with children check registrar entry by ID successfully.`);
        res.status(200).json({ workingWithChildrenChecks: registrarEntryResponses });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching working with children check registrar entry by ID.`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching working with children check registrar entry by ID.', error });
    }
};

/**
 * Update a working with children check registrar entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateRegistrarEntryById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to update working with children check registrar entry by ID.`);
        const referenceId = req.params.id;

        const { typeId, userId, registrationNumber, expiryDate, isValidated = false } = req.body;

        if (!typeId || !userId || !registrationNumber || !expiryDate) {
            logger.info(`[${fn}]: Missing required fields`);
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const checkTypeExists = await CheckType.findOne({ where: { id: typeId } });
        if (!checkTypeExists) {
            logger.info(`[${fn}]: No WWCC type exists with an ID of ${typeId}`);
            return res.status(409).json({ message: `No WWCC type exists with an ID of ${typeId}.` });
        }

        const userExists = await fetchUser(userId);
        if (!userExists) {
            logger.info(`[${fn}]: No user exists with an ID of ${userId}`);
            return res.status(409).json({ message: `No user exists with an ID of ${userId}.` });
        }

        const [rowsUpdated] = await WWCC.update(
            { typeId, userId, registrationNumber, expiryDate, isValidated },
            { where: { id: referenceId } }
        );

        if (rowsUpdated === 0) {
            logger.info(`[${fn}]: No working with children's check found with an ID of ${referenceId}`);
            return res.status(404).json({ message: `No working with children's check found with an ID of ${referenceId}` });
        }

        logger.info(`[${fn}]: Updated working with children's check by ID successfully.`);
        res.status(200).json({ message: "Working with children's check updated successfully" });
    } catch (error) {
        logger.error(`[${fn}]: Error updating working with children's check by ID`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: "Error updating working with children's check by ID", error });
    }
};

/**
 * Delete a working with children check registrar entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteRegistrarEntryById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to delete working with children's check by ID.`);
        const referenceId = req.params.id;

        const result = await WWCC.destroy({ where: { id: referenceId } });

        if (!result) {
            logger.info(`[${fn}]: No working with children's check found with an ID of ${referenceId}.`);
            return res.status(404).json({ message: `No working with children's check found with an ID of ${referenceId}.` });
        }

        logger.info(`[${fn}]: Deleted the working with children's check entry by ID successfully.`);
        res.status(204).json();
    } catch (error) {
        logger.error(`[${fn}]: Error deleting the working with children's check entry by ID.`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: "Error deleting the working with children's check entry by ID", error });
    }
};
