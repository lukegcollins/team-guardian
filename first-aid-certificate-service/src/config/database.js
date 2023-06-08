// Import required modules and files
const dotenv = require("dotenv").config();
const logger = require('./logger')

// Get the base name of the current file
const fn = require('path').basename(__filename);

module.exports = {
    hostname: process.env.FACS_DB_HOST,
    username: process.env.FACS_DB_USER,
    password: process.env.FACS_DB_PASS,
    database: process.env.FACS_DB_NAME,
    port: process.env.FACS_DB_PORT,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

