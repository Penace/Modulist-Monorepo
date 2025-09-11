import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file in the backend directory
const envPath = path.resolve(__dirname, '..', '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

// Debug logging (masked for security)
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI environment variable is not set!');
  console.log('Environment file path tried:', envPath);
  process.exit(1);
} else {
  // Log a masked version of the connection string for debugging
  const maskedUri = mongoUri.replace(/(mongodb(\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/, '$1*****$4');
  console.log('Using MongoDB URI:', maskedUri);
}

async function migrateCollection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the database instance
    const db = mongoose.connection.db;
    
    // Check if the listings collection exists
    const collections = await db.listCollections().toArray();
    const hasListings = collections.some(col => col.name === 'listings');
    
    if (hasListings) {
      // Rename the collection
      await db.collection('listings').rename('items');
      console.log('Successfully renamed collection from "listings" to "items"');
    } else {
      console.log('No "listings" collection found, migration not needed');
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateCollection();

