const mongoose = require('mongoose');

/**
 * Connects the Express backend to MongoDB using Mongoose.
 * The connection string is read from the MONGO_URI environment variable,
 * so database credentials are not hardcoded in the source code.
 *
 * @returns {Promise<void>} Resolves when the database connection succeeds, or exits the process on failure.
 */
const connectDB = async () => {
  try {
    console.log('Trying to connect to MongoDB...');

    await mongoose.connect(process.env.MONGO_URI, {
      // Limits how long Mongoose waits while trying to find a MongoDB server.
      serverSelectionTimeoutMS: 5000
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    // Stop the server startup if the database connection fails.
    process.exit(1);
  }
};

module.exports = connectDB;
