const Program = require('../models/programModel');

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
const getPrograms = async (req, res) => {
    try {
        const programs = await Program.find({});
        res.json(programs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get program by ID
// @route   GET /api/programs/:id
// @access  Public
const getProgramById = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        if (program) {
            res.json(program);
        } else {
            res.status(404).json({ message: 'Program not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create a program
// @route   POST /api/programs
// @access  Private/Admin
const createProgram = async (req, res) => {
    try {        const programData = {
            title: req.body.title,
            description: req.body.description,
            image: req.file ? `/uploads/programs/${req.file.filename}` : null
        };
        
        const program = await Program.create(programData);
        res.status(201).json(program);
    } catch (error) {
        console.error('Program creation error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private/Admin
const updateProgram = async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            description: req.body.description,
        };

        if (req.file) {
            updateData.image = `/uploads/programs/${req.file.filename}`;
        }

        const program = await Program.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (program) {
            res.json(program);
        } else {
            res.status(404).json({ message: 'Program not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
const deleteProgram = async (req, res) => {
    try {
        const program = await Program.findByIdAndDelete(req.params.id);
        if (program) {
            res.json({ message: 'Program removed' });
        } else {
            res.status(404).json({ message: 'Program not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram
};
