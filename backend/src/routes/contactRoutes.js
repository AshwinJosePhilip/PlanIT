const express = require('express');
const router = express.Router();
const {
    createContact,
    getContacts,
    updateContactStatus
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createContact);

// Protected admin routes
router.get('/', protect, admin, getContacts);
router.put('/:id', protect, admin, updateContactStatus);

module.exports = router;
