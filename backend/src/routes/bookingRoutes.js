const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { organizer } = require('../middleware/organizerMiddleware');

// Create new booking
router.post('/', protect, createBooking);

// Get all bookings for logged in user
router.get('/my', protect, getMyBookings);

// Get specific booking by ID
router.get('/:id', protect, getBookingById);

// Update booking status (admin/organizer only)
router.put('/:id', protect, organizer, updateBookingStatus);

// Cancel booking
router.delete('/:id', protect, cancelBooking);

module.exports = router;
