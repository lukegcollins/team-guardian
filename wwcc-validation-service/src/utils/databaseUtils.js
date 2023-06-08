// Import required modules and files
const logger = require('../config/logger.js');

// Get the base name of the current file
const fn = require('path').basename(__filename);

/**
 * Synchronizes the Sequelize database.
 * 
 * @param {Object} sequelize - The sequelize instance.
 */
async function syncDatabase(sequelize) {
    try {
        await sequelize.sync({ alter: true });
        logger.info(`[${fn}]: Database successfully synchronized.`);
    } catch (error) {
        logger.error(`[${fn}]: Error synchronizing database.`, { filename: fn, error: error });
    }
}

/**
 * Tests the Sequelize database connection.
 * 
 * @param {Object} sequelize - The sequelize instance.
 */
async function testDatabase(sequelize) {
    try {
        await sequelize.authenticate();
        logger.info(`[${fn}]: Database successfully connected.`, { filename: fn });
    } catch (error) {
        logger.error(`[${fn}]: Error connecting database.`, { filename: fn, error: error });
    }
}

module.exports = {
    syncDatabase,
    testDatabase
};
