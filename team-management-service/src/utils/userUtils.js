// Import required modules and files
const axios = require('axios');
const dotenv = require('dotenv').config();
const logger = require('../config/logger');

// Get the base name of the current file
const fn = require('path').basename(__filename);

// Load configuration from environment variables
const serviceHost = process.env.UMS_API_URL;
const serivcePort = process.env.UMS_API_PORT;
const serviceKey = process.env.UMS_API_KEY;

// Build the URL for the UMS API
const connString = `http://${serviceHost}:${serivcePort}/users/`;


/**
 * Checks if a user exists on the UMS.
 * 
 * @param {Integer} userId - The ID of the user to check.
 */
const fetchUser = async (userId) => {
    try {
        // Log a message indicating that we are checking if the user exists
        logger.info(`[${fn}]: Checking if user id ${userId} exists on UMS.`);

        console.log(connString);
        console.log(serviceKey)
        // Make a GET request to the UMS API to check if the user exists
        const response = await axios.get(`${connString}${userId}`, {
            headers: {
                Authorization: `Bearer ${serviceKey}`
            }
        });

        // If the response is successful, extract the necessary fields from the response data
        const { id, firstName, lastName, email, activeAt, role } = response.data.user;

        // Prepare the response object
        const user = {
            id,
            firstName,
            lastName,
            email,
            activeAt,
            role: {
                id: role.id,
                name: role.name,
                description: role.description
            }
        };

        return user;
    } catch (error) {
        console.log(error)
        // If the response is not successful, check if the user does not exist (404 error)
        if (error.response && error.response.status === 404) {
            return false;
        } else {
            // If the response is not successful and the error is not a 404 error,
            // log an error message and throw an error
            logger.error(`[${fn}]: Error checking if user ${userId} exists on the user-managment-service.`, { error: error })
            logger.debug(`[${fn}]: ${error}`, { error: error })
            throw new Error('Error checking if user exists');
        }
    }
};

module.exports = fetchUser;
