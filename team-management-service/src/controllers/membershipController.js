// Import required modules and files
const jwt = require("jsonwebtoken");
const db = require('../models');
const { membership: Membership, team: Team } = require('../models');
const fetchUser = require('../utils/userUtils');
const dotenv = require("dotenv").config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Create a team membership
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createMembership = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to create a team membership.`);
        const { teamId, userId, isManager = false } = req.body;

        if (!teamId || !userId) {
            logger.info(`[${fn}]: Missing required fields`);
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const teamExists = await Team.findOne({ where: { id: teamId } });
        if (!teamExists) {
            logger.info(`[${fn}]: No team exists with ID ${teamId}`);
            return res.status(409).json({ message: `No team exists with ID ${teamId}.` });
        }

        const userExists = await fetchUser(userId);
        if (!userExists) {
            logger.info(`[${fn}]: No user exists with ID ${userId}`);
            return res.status(409).json({ message: `No user exists with ID ${userId}.` });
        }

        const membership = await Membership.create({ teamId, userId, isManager });

        logger.info(`[${fn}]: Membership registered successfully.`);
        res.status(201).json({ membership });
    } catch (error) {
        logger.error(`[${fn}]: Error registering membership`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error registering membership', error });
    }
};


// Get all memberships
exports.getAllMemberships = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all memberships.`);

        const memberships = await Membership.findAll({
            // include: [
            //     {
            //         model: Team,
            //         attributes: ['id', 'name'],
            //     },
            // ],
        });

        const membershipsResponse = [];

        for (const membership of memberships) {

            // Prepare the response object
            const membershipResponse = {
                membershipId: membership.id,
                isManager: membership.isManager,
                userId: membership.userId,
                teamId: membership.teamId,
                createdAt: membership.createdAt,
                updatedAt: membership.updatedAt,
            };

            membershipsResponse.push(membershipResponse);
        }

        logger.info(`[${fn}]: Fetched all memberships successfully.`);
        res.status(200).json({ memberships: membershipsResponse });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching all memberships`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching all memberships', error });
    }
};

// Get all memberships
exports.getAllMembershipsExtended = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch all memberships.`);

        const memberships = await Membership.findAll({
            include: [
                {
                    model: Team, as: "Team",
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!memberships) {
            logger.info(`[${fn}]: No memberships found`);
            return res.status(404).json({ message: `No memberships found` });
        }

        const membershipsResponse = [];

        for (const membership of memberships) {
            // Fetch user details using fetchUser method
            const userDetails = await fetchUser(membership.userId);
            if (!userDetails) {
                logger.info(`[${fn}]: No user found with ID ${membership.userId}`);
                continue;
            }

            // Prepare the response object
            const membershipResponse = {
                membershipId: membership.id,
                isManager: membership.isManager,
                userDetails,
                teamDetails: membership.Team
            };

            membershipsResponse.push(membershipResponse);
        }

        logger.info(`[${fn}]: Fetched all memberships successfully.`);
        res.status(200).json({ memberships: membershipsResponse });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching all memberships`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching all memberships', error });
    }
};

// Get a membership by ID
exports.getMembershipById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to fetch membership by ID.`);
        const membershipId = req.params.id;

        const membership = await Membership.findOne({
            where: { id: membershipId },
            include: [
                {
                    model: Team, as: "Team",
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!membership) {
            logger.info(`[${fn}]: No membership found with ID ${membershipId}`);
            return res.status(404).json({ message: `No membership found with ID ${membershipId}` });
        }

        // Fetch user details using fetchUser method
        const userDetails = await fetchUser(membership.userId);
        if (!userDetails) {
            logger.info(`[${fn}]: No user found with ID ${membership.userId}`);
            return res.status(404).json({ message: `No user found with ID ${membership.userId}` });
        }

        // Prepare the response object
        const membershipResponse = {
            membershipId: membership.id,
            isManager: membership.isManager,
            userDetails,
            teamDetails: membership.Team
        };

        logger.info(`[${fn}]: Fetched membership by ID successfully.`);
        res.status(200).json({ membership: membershipResponse });
    } catch (error) {
        logger.error(`[${fn}]: Error fetching membership by ID`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error fetching membership by ID', error });
    }
};



exports.updateMembershipById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to update membership by ID.`);
        const membershipId = req.params.id;
        const { teamId, userId, isManager = false } = req.body;

        if (!teamId || !userId) {
            logger.info(`[${fn}]: Missing required fields`);
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const teamExists = await Team.findOne({ where: { id: teamId } });
        if (!teamExists) {
            logger.info(`[${fn}]: No team exists with ID ${teamId}`);
            return res.status(409).json({ message: `No team exists with ID ${teamId}.` });
        }

        const userExists = await fetchUser(userId);
        if (!userExists) {
            logger.info(`[${fn}]: No user exists with ID ${userId}`);
            return res.status(409).json({ message: `No user exists with ID ${userId}.` });
        }

        const [rowsUpdated] = await Membership.update(
            { teamId, userId, isManager },
            { where: { id: membershipId } }
        );

        if (rowsUpdated === 0) {
            logger.info(`[${fn}]: No membership found with ID ${membershipId}`);
            return res.status(404).json({ message: `No membership found with ID ${membershipId}` });
        }

        logger.info(`[${fn}]: Updated membership by ID successfully.`);
        res.status(200).json({ message: 'Membership updated successfully' });
    } catch (error) {
        logger.error(`[${fn}]: Error updating membership by ID`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error updating membership by ID', error });
    }
};

// Delete a membership by ID
exports.deleteMembershipById = async (req, res) => {
    try {
        logger.info(`[${fn}]: Attempting to delete membership by ID.`);
        const membershipId = req.params.id;

        const result = await Membership.destroy({ where: { id: membershipId } });

        if (!result) {
            logger.info(`[${fn}]: No membership found with ID ${membershipId}`);
            return res.status(404).json({ message: `No membership found with ID ${membershipId}` });
        }

        logger.info(`[${fn}]: Deleted membership by ID successfully.`);
        res.status(200).json({ message: 'Membership deleted successfully' });
    } catch (error) {
        logger.error(`[${fn}]: Error deleting membership by ID`, { error });
        logger.debug(`[${fn}]: ${error}`, { error });
        res.status(500).json({ message: 'Error deleting membership by ID', error });
    }
};