const User = require('../models/userModel');
const Event = require('../models/eventModel');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.role && user.role !== 'admin') {
                user.role = req.body.role;
            }
            
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeEvents = await Event.countDocuments({ status: 'active' });
        const newBookings = await Event.countDocuments({ 
            createdAt: { 
                $gte: new Date(Date.now() - 30*24*60*60*1000) 
            } 
        });

        // Calculate revenue (sum of event budgets for the last 30 days)
        const revenueStats = await Event.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: new Date(Date.now() - 30*24*60*60*1000) 
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$budget" }
                }
            }
        ]);

        const revenue = revenueStats[0]?.total || 0;

        // Calculate trends (percentage change from previous period)
        const previousPeriodUsers = await User.countDocuments({
            createdAt: {
                $gte: new Date(Date.now() - 60*24*60*60*1000),
                $lt: new Date(Date.now() - 30*24*60*60*1000)
            }
        });

        const previousPeriodEvents = await Event.countDocuments({
            status: 'active',
            createdAt: {
                $gte: new Date(Date.now() - 60*24*60*60*1000),
                $lt: new Date(Date.now() - 30*24*60*60*1000)
            }
        });

        const previousPeriodBookings = await Event.countDocuments({
            createdAt: {
                $gte: new Date(Date.now() - 60*24*60*60*1000),
                $lt: new Date(Date.now() - 30*24*60*60*1000)
            }
        });

        const previousPeriodRevenue = await Event.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.now() - 60*24*60*60*1000),
                        $lt: new Date(Date.now() - 30*24*60*60*1000)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$budget" }
                }
            }
        ]);

        const calculateTrend = (current, previous) => {
            if (previous === 0) return 100;
            return ((current - previous) / previous) * 100;
        };

        res.json({
            stats: {
                totalUsers: {
                    value: totalUsers,
                    trend: calculateTrend(totalUsers, previousPeriodUsers)
                },
                activeEvents: {
                    value: activeEvents,
                    trend: calculateTrend(activeEvents, previousPeriodEvents)
                },
                newBookings: {
                    value: newBookings,
                    trend: calculateTrend(newBookings, previousPeriodBookings)
                },
                revenue: {
                    value: revenue,
                    trend: calculateTrend(revenue, previousPeriodRevenue[0]?.total || 0)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recent events
// @route   GET /api/admin/events/recent
// @access  Private/Admin
const getRecentEvents = async (req, res) => {
    try {
        const events = await Event.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name');
            
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    deleteUser,
    updateUser,
    getDashboardStats,
    getRecentEvents
};
