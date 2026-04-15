const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    // Set socket timeout to 5 seconds for faster failure
    const conn = await mongoose.connect(process.env.MONGO_URI, { 
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      retryWrites: false
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Running in offline mode. Database features will not work.');
    isConnected = false;
    // Don't throw - allow app to continue in offline mode
  }
};

module.exports = connectDB;
module.exports.isConnected = () => isConnected;
