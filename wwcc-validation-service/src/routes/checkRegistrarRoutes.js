// Import required modules and files
const express = require('express');
const checkRegistrarRoutes = require('../controllers/checkRegistrarController');
const router = express.Router();

router.post('/', checkRegistrarRoutes.createRegistrarEntry);
router.get('/', checkRegistrarRoutes.getAllRegistrarEntries);
router.get('/extended', checkRegistrarRoutes.getAllRegistrarEntriesExtended);
router.get('/:id', checkRegistrarRoutes.getRegistrarEntryById);
router.patch('/:id', checkRegistrarRoutes.updateRegistrarEntryById);
router.delete('/:id', checkRegistrarRoutes.deleteRegistrarEntryById);

module.exports = router;