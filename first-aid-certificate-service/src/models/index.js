// Import required modules and files
const dotenv = require("dotenv").config();
const Sequelize = require('sequelize');
const dbConfig = require('../config/database.js');
const logger = require('../config/logger.js');
const { syncDatabase, testDatabase } = require('../utils/databaseUtils');

// Get the base name of the current file
const fn = require('path').basename(__filename);

// Create a new Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.hostname,
    operatorAliases: false,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: false
});

// Add Sequelize, sequelize objects, Membership and Team models to the db object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.certificate = require('./certificate.js')(sequelize, Sequelize);
db.certificateType = require('./certificateType.js')(sequelize, Sequelize);

// Define associations
db.certificate.associate({ CertificateType: db.certificateType });


/**
 * Synchronizes and Test the Sequelize database.
 */
(async () => {
    try {
        await testDatabase(sequelize);
        await syncDatabase(sequelize);
    } catch (error) {
        logger.error(`[${fn}]: Error initializing database.`, { filename: fn, error: error });
    }
})();

module.exports = db;
