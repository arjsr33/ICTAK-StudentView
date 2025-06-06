// Fixed Backend_ICT/db/dbConnect.js
const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
    // If already connected, don't reconnect
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('✅ Using existing database connection');
        return;
    }

    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('FATAL ERROR: MONGODB_URL is not defined in environment variables');
        }

        console.log('🔄 Connecting to MongoDB...');
        
        // Use minimal connection options for latest Mongoose version
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });

        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ Database connection error:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Database disconnected');
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ Database reconnected');
            isConnected = true;
        });

        return conn;

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        isConnected = false;
        
        // Don't exit process in production (Vercel), just log the error
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        
        throw error;
    }
};

// Export the connection function
module.exports = connectDB;

// Call the connection
connectDB().catch(err => {
    console.error('Database connection initialization failed:', err.message);
});