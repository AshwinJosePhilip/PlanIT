const Review = require('../models/reviewModel');
const Event = require('../models/eventModel');
const Booking = require('../models/bookingModel');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { eventId, rating, comment, images } = req.body;

        // Check if user has booked and attended this event
        const booking = await Booking.findOne({
            event: eventId,
            user: req.user._id,
            status: 'confirmed'
        });

        if (!booking) {
            return res.status(403).json({ 
                message: 'You can only review events you have attended' 
            });
        }

        // Check if user has already reviewed this event
        const existingReview = await Review.findOne({
            event: eventId,
            user: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({ 
                message: 'You have already reviewed this event' 
            });
        }

        const review = await Review.create({
            event: eventId,
            user: req.user._id,
            rating,
            comment,
            images
        });

        await review.populate('user', 'name');

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get event reviews
// @route   GET /api/reviews/event/:eventId
// @access  Public
const getEventReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ event: req.params.eventId })
            .populate('user', 'name')
            .sort('-createdAt');

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my reviews
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('event')
            .sort('-createdAt');

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const { rating, comment, images } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.images = images || review.images;

        const updatedReview = await review.save();
        await updatedReview.populate('user', 'name');

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getEventReviews,
    getMyReviews,
    updateReview,
    deleteReview
};
