const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://ashwinjosephilip:Yynuq1C2E1HXMgTh@planit.vjcljuf.mongodb.net/?retryWrites=true&w=majority&appName=PlanIT');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;