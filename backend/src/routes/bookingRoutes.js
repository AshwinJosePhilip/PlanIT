const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getOrganizerBookings,
    updateBookingStatus,
    cancelBooking
} = require('../controllers/bookingController');
const { protect, organizer } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/organizer', protect, organizer, getOrganizerBookings);
router.put('/:id', protect, organizer, updateBookingStatus);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
