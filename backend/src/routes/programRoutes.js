const express = require('express');
const router = express.Router();
const {
    getPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram
} = require('../controllers/programController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Import service routes
const serviceRoutes = require('./serviceRoutes');

// Public routes
router.get('/', getPrograms);
router.get('/:id', getProgramById);

// Protected admin routes
router.post('/', protect, admin, upload.single('image'), createProgram);
router.put('/:id', protect, admin, upload.single('image'), updateProgram);
router.delete('/:id', protect, admin, deleteProgram);

// Use service routes
router.use('/:programId/services', serviceRoutes);

module.exports = router;
