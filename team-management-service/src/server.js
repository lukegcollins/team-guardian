// Import required modules
const dotenv = require("dotenv").config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const logger = require('./config/logger.js');
const teamRoutes = require('./routes/teamRoutes');
const membershipRoutes = require('./routes/membershipRoutes');

// Get the base name of the current file
const fn = require('path').basename(__filename);

// Create the Express Application
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/teams', teamRoutes);
app.use('/memberships', membershipRoutes);

// Start the server
var server = app.listen(process.env.TMS_APP_PORT || 1002, function () {
    logger.info(`[${fn}]: The team-management-service has started on port ${server.address().port} in ${process.env.TMS_NODE_ENV} mode.`, { filename: fn, port: server.address().port, mode: process.env.TMS_NODE_ENV });

    if (process.env.TMS_NODE_ENV !== 'production') {
        logger.info(`[${fn}]: INFO level console logging enabled.`, { filename: fn });
        logger.debug(`[${fn}]: DEBUG level console logging enabled.`, { filename: fn });
        logger.error(`[${fn}]: ERROR level console logging enabled.`, { filename: fn });
    }
});
