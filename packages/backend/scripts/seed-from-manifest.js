import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.join(__dirname, '../../../.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/modulist';

// Read manifest produced by scripts/upload-images.js
const manifestPath = path.join(__dirname, '../../../uploads-manifest.json');
let manifest = { images: [] };
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

const user = {
  email: 'admin@example.com',
  name: 'Admin',
  passwordHash: '$2a$10$Xk5FQjYiA1x1LxFZtBk8quyH.2z6d2J95o0A1xTt6M4A1rpx9k4y6', // 'password'
  role: 'admin',
  approved: true,
  currency: 'USD',
  createdAt: new Date(),
};

function pickImages(n) {
  if (!manifest.images || manifest.images.length === 0) return [];
  return manifest.images.slice(0, n);
}

const items = [
  {
    title: 'Cozy Apartment',
    price: 250000,
    location: 'City Center',
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 80,
    address: '123 Main St',
    images: pickImages(1),
    description: 'Great apartment',
    propertyType: 'apartment',
    yearBuilt: 2015,
    parkingAvailable: 'Yes',
    type: 'sale',
    status: 'published',
    createdAt: new Date(),
  },
  {
    title: 'Suburban House',
    price: 450000,
    location: 'Green Suburbs',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 180,
    address: '456 Oak Ave',
    images: pickImages(1),
    description: 'Spacious family home',
    propertyType: 'house',
    yearBuilt: 2008,
    parkingAvailable: 'Garage',
    type: 'sale',
    status: 'published',
    createdAt: new Date(),
  },
];

async function run() {
  const { default: Item } = await import('../models/Item.js');
  const { default: User } = await import('../models/User.js');

  const conn = await mongoose.connect(MONGO_URI);
  console.log('Connected to Mongo, seeding uploaded-image dataset...');

  await User.deleteMany({ email: user.email });
  await Item.deleteMany({ address: { $in: items.map(i => i.address) } });

  await User.insertMany([user]);
  await Item.insertMany(items);

  await conn.disconnect();
  console.log('Seed complete (from manifest).');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

