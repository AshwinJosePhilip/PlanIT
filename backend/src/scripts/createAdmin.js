require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const connectDB = require('../config/db');

const createAdminUser = async () => {
    try {
        await connectDB();        const adminData = {
            name: 'Admin User',
            email: 'admin@planit.com',
            password: 'admin123',
            role: 'admin'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Create admin user
        const admin = await User.create(adminData);
        console.log('Admin user created successfully:', admin);
        
    } catch (error) {
        console.error('Error:', error);
    }
    process.exit();
};

createAdminUser();
