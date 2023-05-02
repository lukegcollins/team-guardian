const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const roleMiddleware = require('../middleware/roleMiddleware');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

router.post('/', apiKeyMiddleware(), userController.createUser);
router.get('/', apiKeyMiddleware(), userController.getAllUsers);
router.get('/:id', apiKeyMiddleware(), userController.getUserById);
router.patch('/:id', apiKeyMiddleware(), userController.updateUser);
router.put('/current', passport.authenticate('jwt', { session: false }), userController.updateCurrentUser); // Make sure to use authentication middleware for this route
router.delete('/:id', apiKeyMiddleware(), userController.deleteUser);

module.exports = router;
