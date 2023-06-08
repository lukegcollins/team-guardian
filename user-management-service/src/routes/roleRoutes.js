const express = require('express');
const roleController = require('../controllers/roleController');
const router = express.Router();
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

router.post('/', apiKeyMiddleware(), roleController.createRole);
router.get('/', apiKeyMiddleware(), roleController.getAllRoles);
router.get('/:id', apiKeyMiddleware(), roleController.getRoleById);
router.patch('/:id', apiKeyMiddleware(), roleController.updateRole);
router.delete('/:id', apiKeyMiddleware(), roleController.deleteRole);

module.exports = router;