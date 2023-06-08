const express = require('express');
const router = express.Router();
const passport = require('passport');
const profileController = require('../controllers/profileController');

router.get('/current', passport.authenticate('jwt', { session: false }), profileController.getCurrentUser);
router.put('/current', passport.authenticate('jwt', { session: false }), profileController.updateCurrentUser);

module.exports = router;
