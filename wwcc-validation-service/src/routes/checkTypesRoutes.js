// Import required modules and files
const express = require('express');
const checkTypeController = require('../controllers/checkTypeController');
const router = express.Router();

router.post('/', checkTypeController.createCheckType);
router.get('/', checkTypeController.getAllCheckTypes);
router.get('/:id', checkTypeController.getCheckTypeById);
router.patch('/:id', checkTypeController.updateCheckType);
router.delete('/:id', checkTypeController.deleteCheckType);

module.exports = router;