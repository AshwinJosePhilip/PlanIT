const Service = require('../models/serviceModel');
const fs = require('fs').promises;
const path = require('path');

// @desc    Get all services for a program
// @route   GET /api/programs/:programId/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const services = await Service.find({ program: req.params.programId });
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single service
// @route   GET /api/programs/:programId/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create a service
// @route   POST /api/programs/:programId/services
// @access  Private/Admin
const createService = async (req, res) => {
    try {
        // Log incoming request data for debugging
        console.log('Creating service with data:', {
            body: req.body,
            file: req.file,
            programId: req.params.programId
        });

        // Validate required fields
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        if (!req.body.title || !req.body.description || !req.body.price || !req.body.maxParticipants) {
            return res.status(400).json({ 
                message: 'Please provide all required fields',
                missing: {
                    title: !req.body.title,
                    description: !req.body.description,
                    price: !req.body.price,
                    maxParticipants: !req.body.maxParticipants
                }
            });
        }

        // Validate numeric fields
        if (isNaN(req.body.price) || Number(req.body.price) <= 0) {
            return res.status(400).json({ message: 'Price must be a positive number' });
        }

        if (isNaN(req.body.maxParticipants) || Number(req.body.maxParticipants) <= 0) {
            return res.status(400).json({ message: 'Maximum participants must be a positive number' });
        }

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, '../../../uploads/services');
        await fs.mkdir(uploadsDir, { recursive: true });

        const imageUrl = `/uploads/services/${req.file.filename}`;
        
        const serviceData = {
            ...req.body,
            program: req.params.programId,
            image: imageUrl,
            price: Number(req.body.price),
            maxParticipants: Number(req.body.maxParticipants)
        };

        const service = await Service.create(serviceData);
        console.log('Service created successfully:', service);
        res.status(201).json(service);
    } catch (error) {
        console.error('Error creating service:', error);
        // If there's an error, cleanup the uploaded file
        if (req.file) {
            const filePath = path.join(__dirname, '../../../', req.file.path);
            await fs.unlink(filePath).catch(err => {
                console.error('Error deleting file:', err);
            });
        }
        res.status(500).json({ 
            message: error.message || 'Error creating service',
            error: error.toString()
        });
    }
};

// @desc    Update a service
// @route   PUT /api/programs/:programId/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Validate required fields if they are being updated
        if (req.body.title === '' || req.body.description === '') {
            return res.status(400).json({ message: 'Title and description cannot be empty' });
        }

        if (req.body.price && Number(req.body.price) <= 0) {
            return res.status(400).json({ message: 'Price must be greater than 0' });
        }

        if (req.body.maxParticipants && Number(req.body.maxParticipants) <= 0) {
            return res.status(400).json({ message: 'Maximum participants must be greater than 0' });
        }

        const serviceData = { ...req.body };
        
        if (req.file) {
            // Delete old image if it exists and is not the default image
            if (service.image && !service.image.includes('default')) {
                const oldImagePath = path.join(__dirname, '../../', service.image);
                await fs.unlink(oldImagePath).catch(console.error);
            }
            serviceData.image = `/uploads/services/${req.file.filename}`;
        }

        if (req.body.price) serviceData.price = Number(req.body.price);
        if (req.body.maxParticipants) serviceData.maxParticipants = Number(req.body.maxParticipants);

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            serviceData,
            { new: true, runValidators: true }
        );

        res.json(updatedService);    } catch (error) {
        // Clean up uploaded file if there was an error
        if (req.file) {
            await fs.unlink(req.file.path).catch(err => 
                console.error('Error deleting file:', err)
            );
        }

        // Handle specific MongoDB validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'A service with this name already exists in this program' 
            });
        }

        console.error('Service update error:', error);
        res.status(500).json({ message: 'Error updating service' });
    }
};

// @desc    Delete a service
// @route   DELETE /api/programs/:programId/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Delete the image file if it exists and is not the default image
        if (service.image && !service.image.includes('default')) {
            const imagePath = path.join(__dirname, '../../', service.image);
            await fs.unlink(imagePath).catch(console.error);
        }

        await service.deleteOne();
        res.json({ message: 'Service removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
