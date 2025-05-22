const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directories are now handled in server.js

// Configure storage
const storage = multer.diskStorage({    destination: function (req, file, cb) {
        // Check the route to determine the upload directory
        const baseDir = path.join(__dirname, '../..');
        const uploadDir = req.baseUrl.includes('services') ? 'uploads/services' : 'uploads/programs';
        cb(null, path.join(baseDir, uploadDir));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;
