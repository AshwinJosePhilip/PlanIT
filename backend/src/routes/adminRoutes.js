const express = require('express');
const router = express.Router();
const { 
    getUsers, 
    deleteUser, 
    updateUser, 
    getDashboardStats,
    getRecentEvents
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and require admin access
router.use(protect, admin);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.get('/stats', getDashboardStats);
router.get('/events/recent', getRecentEvents);

module.exports = router;
