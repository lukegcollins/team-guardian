// Import required modules
const dotenv = require("dotenv").config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const logger = require('./config/logger.js');
const passport = require('passport');
const passportJWT = require('./config/passport')(passport);
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');

// Get the base name of the current file
const fn = require('path').basename(__filename);

// Create the Express Application
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Passport Authentication
app.use(passport.initialize());

app.use((req, res, next) => {
    // console.log(req.session);
    // console.log(req.user);
    next();
});

// Routes
app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);
app.use('/roles', roleRoutes);
app.use('/users', userRoutes);

// Start the server
var server = app.listen(process.env.UMS_APP_PORT || 1001, function () {
    logger.info(`[${fn}]: The user-management-service has started on port ${server.address().port} in ${process.env.UMS_NODE_ENV} mode.`, { filename: fn, port: server.address().port, mode: process.env.UMS_NODE_ENV });

    if (process.env.UMS_NODE_ENV !== 'production') {
        logger.info(`[${fn}]: INFO level console logging enabled.`, { filename: fn });
        logger.debug(`[${fn}]: DEBUG level console logging enabled.`, { filename: fn });
        logger.error(`[${fn}]: ERROR level console logging enabled.`, { filename: fn });
    }
});
