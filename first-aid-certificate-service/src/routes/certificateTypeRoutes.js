// Import required modules and files
const express = require('express');
const certificateTypeController = require('../controllers/certificateTypeController');
const router = express.Router();

router.post('/', certificateTypeController.createCertificateType);
router.get('/', certificateTypeController.getAllCertificateTypes);
router.get('/:id', certificateTypeController.getCertificateTypeById);
router.patch('/:id', certificateTypeController.updateCertificateType);
router.delete('/:id', certificateTypeController.deleteCertificateType);

module.exports = router;