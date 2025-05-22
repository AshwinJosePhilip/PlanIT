const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Program title is required']
    },    description: {
        type: String,
        required: [true, 'Program description is required']
    },
    image: {
        type: String,
        required: [true, 'Program image is required']
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
