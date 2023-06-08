// Import required modules and files
const express = require('express');
const certificateController = require('../controllers/certificateController');
const router = express.Router();

router.post('/', certificateController.createCertificate);
router.get('/', certificateController.getAllCertificates);
router.get('/extended', certificateController.getAllCertificatesExtended);
router.get('/:id', certificateController.getCertificateById);
router.patch('/:id', certificateController.updateCertificateById);
router.delete('/:id', certificateController.deleteCertificateById);

module.exports = router;