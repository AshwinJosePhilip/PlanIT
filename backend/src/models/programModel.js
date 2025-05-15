const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Program title is required']
    },
    description: {
        type: String,
        required: [true, 'Program description is required']
    },
    image: {
        type: String,
        required: [true, 'Program image is required']
    },
    category: {
        type: String,
        required: [true, 'Program category is required'],
        enum: ['Wedding', 'Birthday', 'Gender Reveal', 'Bridal Shower', 'Baptism', 
               'Bachelorette', 'Anniversary', 'Corporate Meetings', 'Naming Ceremony', 
               'Pet Parties', 'Graduation', 'Others']
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
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
