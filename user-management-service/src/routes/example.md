
Protect your routes with Passport.js, Role Based Authentication or API Keys:

```
const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const roleMiddleware = require('../middleware/roleMiddleware');


// This route will be protected with JWT authentication
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'You have accessed a protected route!' });
});

// Protect this route to only allow users with the 'Admin' and 'Manager' roles
router.put('/:id', roleMiddleware(['Admin', 'Manager']), userController.updateUser);

// If you want to apply the API key middleware globally, use this line:
app.use(apiKeyMiddleware);

// Otherwise use the following to protect and route with API key niddleware.
app.get('/secure', apiKeyMiddleware, (req, res) => {
  res.send('This route is protected by the API key middleware.');
});


// A protected route that requires either a valid token or API key and a role of "admin"
app.get('/protected', combinedAuthMiddleware(['admin']), (req, res) => {
    // If the request makes it this far, it means the user is authenticated
    // with either a valid token or API key and has an "admin" role
    res.send('You are an admin!');
});

module.exports = router;

```