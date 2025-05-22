const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Service title is required']
    },
    description: {
        type: String,
        required: [true, 'Service description is required']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Maximum participants is required']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
