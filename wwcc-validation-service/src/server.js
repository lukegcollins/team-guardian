// Import required modules
const dotenv = require("dotenv").config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const logger = require('./config/logger.js');
const checkRegistrarRoutes = require('./routes/checkRegistrarRoutes');
const checkTypesRoutes = require('./routes/checkTypesRoutes');

// Get the base name of the current file
const fn = require('path').basename(__filename);

// Create the Express Application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/wwcc/types/', checkTypesRoutes);
app.use('/wwcc/', checkRegistrarRoutes);

// Start the server
const server = app.listen(process.env.WWCCVS_APP_PORT || 1003, () => {
    logger.info(`[${fn}]: The wwcc-validation-service has started on port ${server.address().port} in ${process.env.WWCCVS_NODE_ENV} mode.`, { filename: fn, port: server.address().port, mode: process.env.WWCCVS_NODE_ENV });

    if (process.env.TMS_NODE_ENV !== 'production') {
        logger.info(`[${fn}]: INFO level console logging enabled.`, { filename: fn });
        logger.debug(`[${fn}]: DEBUG level console logging enabled.`, { filename: fn });
        logger.error(`[${fn}]: ERROR level console logging enabled.`, { filename: fn });
    }
});