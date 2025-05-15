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

// Public routes
router.get('/', getPrograms);
router.get('/:id', getProgramById);

// Protected admin routes
router.post('/', protect, admin, createProgram);
router.put('/:id', protect, admin, updateProgram);
router.delete('/:id', protect, admin, deleteProgram);

module.exports = router;
