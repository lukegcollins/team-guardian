const apiKeyAuthMiddleware = require('./apiKeyMiddleware');
const tokenAuthMiddleware = require('./roleMiddleware');

/**
 * Checks if the users role is allowed to access the route via API key or JWT
 * 
 * @param {Object} allowedRoles - An array of allowed roles.
 * @returns {Object} - The response object on an invalid token.
 * @throws {Object} - The error object on an invalid token.
 * @async
 * @function roleMiddleware 
 * @example combinedAuthMiddleware(['admin', 'manager']);
 */
const combinedAuthMiddleware = (allowedRoles) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    const apiKey = req.header('api-key');

    if (authHeader) {
        // use token authentication
        tokenAuthMiddleware(req, res, (err) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            // check if user's role is allowed
            if (allowedRoles.includes(req.user.role)) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        });
    } else if (apiKey) {
        // use api key authentication
        apiKeyAuthMiddleware(req, res, (err) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid API key' });
            }
            // user is authenticated, check if user's role is allowed
            if (allowedRoles.includes(req.user.role)) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        });
    } else {
        // no authentication method found
        res.status(401).json({ message: 'Unauthorized' });
    }
};
