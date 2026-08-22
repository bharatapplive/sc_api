import mongoose from 'mongoose';
import { DatabaseError } from './error';

/**
 * connectDB - Establishes connection to MongoDB database
 * This function reads the MongoDB URI from environment variables and connects to the database
 * @throws {DatabaseError} If connection fails or URI is not found
 */
export const connectDB = async (): Promise<void> => {
  try {
    console.log('[DB Connect] Attempting to connect to MongoDB...');
    
    // Get MongoDB URI from environment variables
    const MONGO_URI = process.env.mongoDB_url;
    console.log('[DB Connect] MongoDB URI:', MONGO_URI ? '***configured***' : 'NOT FOUND');
    
    // Validate that MongoDB URI exists
    if (!MONGO_URI) {
      console.error('[DB Connect] MongoDB URL not found in environment variables');
      throw new DatabaseError('MongoDB URL not found in environment variables');
    }

    // Establish connection to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('[DB Connect] MongoDB connected successfully');
  } catch (error) {
    console.error('[DB Connect] MongoDB connection error:', error);
    throw new DatabaseError('Failed to connect to MongoDB');
  }
};

/**
 * disconnectDB - Closes the MongoDB database connection
 * This function gracefully disconnects from the database
 * @throws {DatabaseError} If disconnection fails
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    console.log('[DB Connect] Attempting to disconnect from MongoDB...');
    
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('[DB Connect] MongoDB disconnected successfully');
  } catch (error) {
    console.error('[DB Connect] MongoDB disconnection error:', error);
    throw new DatabaseError('Failed to disconnect from MongoDB');
  }
};
