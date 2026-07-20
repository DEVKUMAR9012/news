const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let isConnected = false;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    if (mongoUri === 'memory') {
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`✅ MongoDB Memory Server Started`);
    }

    // Set socket timeout to 5 seconds for faster failure
    const conn = await mongoose.connect(mongoUri, { 
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
