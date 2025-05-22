const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');
const Event = require('../models/eventModel');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { programId, serviceId, date, time, numberOfPeople, specialRequests } = req.body;

        // Validate inputs
        if (!date || !time || !numberOfPeople) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Get service to calculate total price and validate
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Validate number of participants
        if (numberOfPeople > service.maxParticipants) {
            return res.status(400).json({ 
                message: `Maximum ${service.maxParticipants} participants allowed` 
            });
        }

        // Validate date is not in the past
        const bookingDate = new Date(date);
        if (bookingDate < new Date()) {
            return res.status(400).json({ message: 'Cannot book for past dates' });
        }

        // Calculate total price based on number of people
        const totalPrice = service.price * numberOfPeople;

        // Create new booking
        const booking = await Booking.create({
            program: programId,
            service: serviceId,
            user: req.user._id,
            date,
            time,
            numberOfPeople,
            specialRequests,
            totalPrice,
            status: 'pending'
        });

        // Populate the response with service and program details
        await booking.populate(['service', 'program']);

        res.status(201).json(booking);
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate(['service', 'program'])
            .sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate(['service', 'program', 'user']);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the booking belongs to the user or if user is admin/organizer
        if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin && !req.user.isOrganizer) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get organizer's bookings
// @route   GET /api/bookings/organizer
// @access  Private/Organizer
const getOrganizerBookings = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id });
        const eventIds = events.map(event => event._id);
        
        const bookings = await Booking.find({ event: { $in: eventIds } })
            .populate('event')
            .populate('user', 'name email')
            .sort('-createdAt');
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Organizer
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id)
            .populate('event');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is the organizer of the event
        if (booking.event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only allow user to cancel their own booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    getOrganizerBookings,
    updateBookingStatus,
    cancelBooking
};
