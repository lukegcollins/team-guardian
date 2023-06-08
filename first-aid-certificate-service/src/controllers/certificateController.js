// Import required modules and files
const jwt = require("jsonwebtoken");
const db = require('../models');
const { certificate: Certificate, certificateType: CertificateType } = require('../models');
const fetchUser = require('../utils/userUtils');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Create a certificate entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createCertificate = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to create a certificate.`);
        const { typeId, userId, issuedDate, isValidated = false } = req.body;

        if (!typeId || !userId || !issuedDate) {
            logger.info(`[${fn}]: Missing required fields`);
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const certificateTypeExists = await CertificateType.findOne({ where: { id: typeId } });
        if (!certificateTypeExists) {
            logger.info(`[${fn}]: No certificate type exists with ID ${typeId}`);
            return res.status(409).json({ message: `No certificate type exists with ID ${typeId}.` });
        }

        const userExists = await fetchUser(userId);
        if (!userExists) {
            logger.info(`[${fn}]: No user exists with ID ${userId}`);
            return res.status(409).json({ message: `No user exists with ID ${userId}.` });
        }

        const certificate = await Certificate.create({ typeId, userId, issuedDate, isValidated });

        logger.info(`[${fn}]: Certificate entry created successfully.`);
        res.status(201).json({ certificate });
    } catch (error) {
        logger.error(`[${fn}]: Error registering certificate`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error registering certificate', error });
    }
};


/**
 * Get all certificates
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllCertificates = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all certificates.`);

        const certificates = await Certificate.findAll();

        const certificatesResponse = [];

        for (const certificate of certificates) {
            // Prepare the response object
            const certificateResponse = {
                certificateId: certificate.id,
                typeId: certificate.typeId,
                userId: certificate.userId,
                issuedDate: certificate.issuedDate,
                isValidated: certificate.isValidated,
                createdAt: certificate.createdAt,
                updatedAt: certificate.updatedAt
            };

            certificatesResponse.push(certificateResponse);
        }

        logger.info(`[${fn}]: Fetched all certificates successfully.`);
        res.status(200).json({ certificates: certificatesResponse });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching all certificates`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching all certificates', error });
    }
};


/**
 * Get all certificates with extended details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllCertificatesExtended = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all certificates.`);

        const certificates = await Certificate.findAll({
            include: [
                {
                    model: CertificateType,
                    as: "Certificate Type",
                    attributes: ['id', 'name', 'description', 'yearsBeforeRefresher'],
                },
            ],
        });

        if (!certificates) {
            logger.info(`[${fn}]: No certificates found`);
            return res.status(404).json({ message: `No certificates found` });
        }

        const certificatesResponse = [];

        for (const certificate of certificates) {
            // Fetch user details using fetchUser method
            const userDetails = await fetchUser(certificate.userId);
            if (!userDetails) {
                logger.info(`[${fn}]: No user found with ID ${certificate.userId}`);
                continue;
            }

            // Prepare the response object
            const certificateResponse = {
                certificateId: certificate.dataValues.id,
                userDetails,
                certificateTypeDetails: {
                    id: certificate['Certificate Type'].dataValues.id,
                    name: certificate['Certificate Type'].dataValues.name,
                    description: certificate['Certificate Type'].dataValues.description,
                    yearsBeforeRefresher: certificate['Certificate Type'].dataValues.yearsBeforeRefresher
                },
                issuedDate: certificate.dataValues.issuedDate,
                isValidated: certificate.dataValues.isValidated,
                createdAt: certificate.dataValues.createdAt,
                updatedAt: certificate.dataValues.updatedAt
            };

            certificatesResponse.push(certificateResponse);
        }

        logger.info(`[${fn}]: Fetched all certificates successfully.`);
        res.status(200).json({ certificates: certificatesResponse });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching all certificates`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching all certificates', error });
    }
};


/**
 * Get a certificate by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCertificateById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch certificate by ID.`);
        const certificateId = req.params.id;

        const certificate = await Certificate.findOne({
            where: { id: certificateId },
            include: [
                {
                    model: CertificateType,
                    as: "Certificate Type",
                    attributes: ['id', 'name', 'description', 'yearsBeforeRefresher'],
                },
            ],
        });

        if (!certificate) {
            logger.info(`[${fn}]: No certificate found with ID ${certificateId}`);
            return res.status(404).json({ message: `No certificate found with ID ${certificateId}` });
        }

        // Fetch user details using fetchUser method
        const userDetails = await fetchUser(certificate.userId);
        if (!userDetails) {
            logger.info(`[${fn}]: No user found with ID ${certificate.userId}`);
            return res.status(404).json({ message: `No user found with ID ${Certificate.userId}` });
        }

        // Prepare the response object
        const certificateResponse = {
            certificateId: certificate.dataValues.id,
            userDetails,
            certificateTypeDetails: {
                id: certificate['Certificate Type'].dataValues.id,
                name: certificate['Certificate Type'].dataValues.name,
                description: certificate['Certificate Type'].dataValues.description,
                yearsBeforeRefresher: certificate['Certificate Type'].dataValues.yearsBeforeRefresher
            },
            issuedDate: certificate.dataValues.issuedDate,
            isValidated: certificate.dataValues.isValidated,
            createdAt: certificate.dataValues.createdAt,
            updatedAt: certificate.dataValues.updatedAt
        };

        logger.info(`[${fn}]: Fetched certificate by ID successfully.`);
        res.status(200).json({ certificate: certificateResponse });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching certificate by ID`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching certificate by ID', error });
    }
};


/**
 * Update a certificate by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateCertificateById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to update certificate by ID.`);
        const certificateId = req.params.id;
        const { typeId, userId, issuedDate, isValidated = false } = req.body;

        if (!typeId || !userId || !issuedDate) {
            logger.info(`[${fn}]: Missing required fields`);
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const certificateTypeExists = await CertificateType.findOne({ where: { id: typeId } });
        if (!certificateTypeExists) {
            logger.info(`[${fn}]: No certificate type exists with ID ${typeId}`);
            return res.status(409).json({ message: `No certificate type exists with ID ${typeId}.` });
        }

        const userExists = await fetchUser(userId);
        if (!userExists) {
            logger.info(`[${fn}]: No user exists with ID ${userId}`);
            return res.status(409).json({ message: `No user exists with ID ${userId}.` });
        }

        const [rowsUpdated] = await Certificate.update(
            { typeId, userId, issuedDate, isValidated },
            { where: { id: certificateId } }
        );

        if (rowsUpdated === 0) {
            logger.info(`[${fn}]: No certificate found with ID ${certificateId}`);
            return res.status(404).json({ message: `No certificate found with ID ${certificateId}` });
        }

        logger.info(`[${fn}]: Updated certificate by ID successfully.`);
        res.status(200).json({ message: 'Certificate updated successfully' });
    } catch (error) {
        logger.error(`[${fn}]: Error updating certificate by ID`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error updating certificate by ID', error });
    }
};


/**
 * Delete a certificate by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteCertificateById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to delete certificate by ID.`);
        const certificateId = req.params.id;

        const result = await Certificate.destroy({ where: { id: certificateId } });

        if (!result) {
            logger.info(`[${fn}]: No certificate found with ID ${certificateId}`);
            return res.status(404).json({ message: `No certificate found with ID ${certificateId}` });
        }

        logger.info(`[${fn}]: Deleted certificate by ID successfully.`);
        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        logger.error(`[${fn}]: Error deleting certificate by ID`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error deleting certificate by ID', error });
    }
};
