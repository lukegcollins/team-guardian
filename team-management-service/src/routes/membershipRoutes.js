// Import required modules and files
const express = require('express');
const membershipController = require('../controllers/membershipController');
const router = express.Router();

router.post('/', membershipController.createMembership);
router.get('/', membershipController.getAllMemberships);
router.get('/extended', membershipController.getAllMembershipsExtended);
router.get('/:id', membershipController.getMembershipById);
router.patch('/:id', membershipController.updateMembershipById);
router.delete('/:id', membershipController.deleteMembershipById);

module.exports = router;