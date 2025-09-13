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

// Read manifest produced by scripts/upload-images.js or upload-images-by-slug.js
const manifestPath = path.join(__dirname, '../../../uploads-manifest.json');
let manifest = { images: [], bySlug: {} };
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

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function basenameNoExtFromUrl(u) {
  try {
    const p = new URL(u).pathname;
    const last = p.split('/').pop() || '';
    return last.replace(/\.[a-z0-9]+$/i, '');
  } catch (_) {
    return '';
  }
}

// Realistic property data matching our uploaded images
const propertyData = {
  'modern-luxury-villa': {
    title: 'Modern Luxury Villa',
    location: 'Beverly Hills, CA',
    price: 5220000,
    propertyType: 'villa',
    bedrooms: 5,
    bathrooms: 6,
    squareFootage: 4800,
    address: '1255 Beverly Hills Dr, Beverly Hills, CA 90210',
    description: 'A stunning modern villa featuring infinity pool and panoramic Beverly Hills views.',
    yearBuilt: 2018,
    parkingAvailable: 'Private garage',
    features: ['Infinity pool', 'Home theater', 'Wine cellar', 'Smart home system'],
    amenities: ['Concierge service', 'Private gym', 'Landscaped gardens'],
    tag: 'featured'
  },
  'tuscan-villa': {
    title: 'Tuscan Villa',
    location: 'Tuscany, Italy',
    price: 4200000,
    propertyType: 'villa',
    bedrooms: 6,
    bathrooms: 4,
    squareFootage: 5200,
    address: 'Via delle Vigne 12, 50022 Greve in Chianti, Italy',
    description: 'Historic charm meets modern luxury in this breathtaking Tuscan villa.',
    yearBuilt: 1850,
    parkingAvailable: 'Yes',
    features: ['Wine cellar', 'Olive grove', 'Original frescoes', 'Heated pool'],
    amenities: ['Vineyard', 'Guest house', 'Professional kitchen'],
    tag: 'sponsored'
  },
  'tuscan-mansion': {
    title: 'Tuscan Mansion',
    location: 'Florence, Italy', 
    price: 4800000,
    propertyType: 'mansion',
    bedrooms: 8,
    bathrooms: 6,
    squareFootage: 6500,
    address: 'Via del Poggio Imperiale 15, Florence, Italy',
    description: 'Majestic Tuscan mansion with panoramic views of Florence.',
    yearBuilt: 1720,
    parkingAvailable: 'Yes',
    features: ['Historic chapel', 'Original artwork', 'Formal gardens', 'Library'],
    amenities: ['Staff quarters', 'Wine production', 'Helicopter pad'],
    tag: null
  },
  'penthouse-apartment': {
    title: 'Penthouse Apartment',
    location: 'New York City, NY',
    price: 3500000,
    propertyType: 'penthouse',
    bedrooms: 3,
    bathrooms: 3,
    squareFootage: 2800,
    address: '432 Park Avenue, New York, NY 10016',
    description: 'Experience luxury city living with a rooftop terrace and skyline views.',
    yearBuilt: 2015,
    parkingAvailable: 'Valet parking',
    features: ['Private elevator', 'Rooftop terrace', 'Floor-to-ceiling windows', 'Smart home'],
    amenities: ['24/7 concierge', 'Fitness center', 'Spa services'],
    tag: 'auction'
  },
  'beachfront-villa': {
    title: 'Beachfront Villa',
    location: 'Malibu, CA',
    price: 7400000,
    propertyType: 'villa',
    bedrooms: 4,
    bathrooms: 5,
    squareFootage: 3600,
    address: '23456 Pacific Coast Hwy, Malibu, CA 90265',
    description: 'Wake up to ocean views in this pristine Malibu beachfront villa.',
    yearBuilt: 2020,
    parkingAvailable: 'Garage',
    features: ['Private beach access', 'Infinity pool', 'Ocean-view deck', 'Guest suite'],
    amenities: ['Beach service', 'Outdoor kitchen', 'Fire pit'],
    tag: 'featured'
  },
  'urban-sky-loft': {
    title: 'Urban Sky Loft',
    location: 'Tokyo, Japan',
    price: 2900000,
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1800,
    address: 'Shibuya Sky Tower, Tokyo 150-0002, Japan',
    description: 'A cutting-edge loft in the heart of Tokyo\'s vibrant skyline.',
    yearBuilt: 2019,
    parkingAvailable: 'Underground parking',
    features: ['City views', 'Modern appliances', 'High ceilings', 'Private balcony'],
    amenities: ['Building gym', 'Rooftop garden', '24/7 security'],
    tag: 'sponsored'
  },
  'dubai-marina-tower': {
    title: 'Dubai Marina Tower',
    location: 'Dubai, UAE',
    price: 8200000,
    propertyType: 'penthouse',
    bedrooms: 4,
    bathrooms: 5,
    squareFootage: 4200,
    address: 'Marina Tower, Dubai Marina, UAE',
    description: 'Soar above Dubai Marina in this luxurious tower penthouse.',
    yearBuilt: 2017,
    parkingAvailable: 'Valet parking',
    features: ['Panoramic views', 'Private pool', 'Smart home system', 'Butler service'],
    amenities: ['Spa', 'Private marina', 'Helicopter service'],
    tag: null
  },
  'french-castle-chateau': {
    title: 'Château Royale',
    location: 'Loire Valley, France',
    price: 12000000,
    propertyType: 'mansion',
    bedrooms: 12,
    bathrooms: 8,
    squareFootage: 15000,
    address: 'Château de Chambord, Loire Valley, France',
    description: 'Own a piece of history in this majestic French royal château.',
    yearBuilt: 1650,
    parkingAvailable: 'Yes',
    features: ['Historic architecture', 'Formal gardens', 'Wine cellars', 'Chapel'],
    amenities: ['Staff quarters', 'Equestrian facilities', 'Guest cottages'],
    tag: null
  },
  'skyline-view-apartment': {
    title: 'Skyline View Apartment',
    location: 'Chicago, IL',
    price: 1750000,
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 2200,
    address: '875 N Michigan Ave, Chicago, IL 60611',
    description: 'Modern downtown apartment with panoramic Chicago skyline views.',
    yearBuilt: 2014,
    parkingAvailable: 'Deeded parking',
    features: ['Floor-to-ceiling windows', 'Hardwood floors', 'Modern kitchen', 'City views'],
    amenities: ['Doorman', 'Fitness center', 'Rooftop deck'],
    tag: null
  },
  'private-island-estate': {
    title: 'Private Island Estate',
    location: 'Bahamas',
    price: 22000000,
    propertyType: 'estate',
    bedrooms: 8,
    bathrooms: 10,
    squareFootage: 8500,
    address: 'Private Island, Exuma Cays, Bahamas',
    description: 'Secluded private island estate with white sand beaches.',
    yearBuilt: 2016,
    parkingAvailable: 'Marina',
    features: ['Private beaches', 'Deep water marina', 'Guest villas', 'Helicopter pad'],
    amenities: ['Full staff', 'Water sports equipment', 'Private chef'],
    tag: null
  },
  'countryside-farmhouse': {
    title: 'Countryside Farmhouse',
    location: 'Napa Valley, CA',
    price: 2300000,
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 4,
    squareFootage: 4000,
    address: '1847 Silverado Trail, Napa, CA 94558',
    description: 'Rustic luxury farmhouse nestled in the heart of wine country.',
    yearBuilt: 1920,
    parkingAvailable: 'Yes',
    features: ['Wine cellar', 'Original beams', 'Gourmet kitchen', 'Guest cottage'],
    amenities: ['Vineyard', 'Tasting room', 'Equestrian facilities'],
    tag: 'auction'
  },
  'desert-oasis-mansion': {
    title: 'Desert Oasis Mansion',
    location: 'Scottsdale, AZ',
    price: 6800000,
    propertyType: 'mansion',
    bedrooms: 6,
    bathrooms: 7,
    squareFootage: 7200,
    address: '10040 E Happy Valley Rd, Scottsdale, AZ 85262',
    description: 'Escape to this desert oasis featuring luxurious indoor-outdoor living.',
    yearBuilt: 2019,
    parkingAvailable: 'Yes',
    features: ['Resort-style pool', 'Outdoor kitchen', 'Home theater', 'Wine room'],
    amenities: ['Tennis court', 'Guest casita', 'Putting green'],
    tag: 'sponsored'
  },
  'lakefront-modern-retreat': {
    title: 'Lakefront Modern Retreat',
    location: 'Lake Tahoe, NV',
    price: 5600000,
    propertyType: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    squareFootage: 4500,
    address: '1288 Lakeshore Blvd, Incline Village, NV 89451',
    description: 'Serene lakefront villa offering tranquility and modern design.',
    yearBuilt: 2021,
    parkingAvailable: 'Yes',
    features: ['Lake frontage', 'Private dock', 'Mountain views', 'Great room'],
    amenities: ['Beach access', 'Boat lift', 'Fire pit'],
    tag: null
  },
  'japanese-jungle-house': {
    title: 'Japanese Jungle House',
    location: 'Kyoto, Japan',
    price: 1800000,
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 2800,
    address: '123 Bamboo Grove, Arashiyama, Kyoto, Japan',
    description: 'Unique architectural masterpiece blending with natural bamboo forest.',
    yearBuilt: 2018,
    parkingAvailable: 'Yes',
    features: ['Bamboo integration', 'Zen garden', 'Traditional elements', 'Natural materials'],
    amenities: ['Tea house', 'Meditation space', 'Hot spring'],
    tag: null
  },
  'house': {
    title: 'Modern Family House',
    location: 'Austin, TX',
    price: 950000,
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 2800,
    address: '4567 Oak Hill Dr, Austin, TX 78735',
    description: 'Contemporary family home in desirable Austin neighborhood.',
    yearBuilt: 2016,
    parkingAvailable: 'Yes',
    features: ['Open floor plan', 'Large backyard', 'Modern kitchen', 'Master suite'],
    amenities: ['Community pool', 'Walking trails', 'Top-rated schools'],
    tag: null
  },
  'hero': {
    title: 'Hero Mansion',
    location: 'Los Angeles, CA',
    price: 8500000,
    propertyType: 'mansion',
    bedrooms: 7,
    bathrooms: 8,
    squareFootage: 9200,
    address: '1001 Beverly Hills Way, Los Angeles, CA 90210',
    description: 'Spectacular mansion featured in luxury lifestyle magazines.',
    yearBuilt: 2020,
    parkingAvailable: 'Yes',
    features: ['Grand entrance', 'Home theater', 'Wine cellar', 'Guest wings'],
    amenities: ['Pool complex', 'Tennis court', 'Staff quarters'],
    tag: null
  },
  'fallback': {
    title: 'Classic Estate',
    location: 'Connecticut',
    price: 1200000,
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 4,
    squareFootage: 3500,
    address: '789 Country Lane, Greenwich, CT 06830',
    description: 'Elegant estate home with classic architectural details.',
    yearBuilt: 1995,
    parkingAvailable: 'Yes',
    features: ['Formal dining', 'Library', 'Fireplace', 'Hardwood floors'],
    amenities: ['Private grounds', 'Garden', 'Circular driveway'],
    tag: null
  }
};

const items = (() => {
  // Group images by base slug (removing -2, -3, etc.)
  const entries = Object.entries(manifest.bySlug || {});
  if (entries.length > 0) {
    const groupedByBase = {};
    
    // Group images by base name
    entries.forEach(([slug, url]) => {
      // Remove trailing -2, -3, etc. to get base slug
      const baseSlug = slug.replace(/-\d+$/, '');
      if (!groupedByBase[baseSlug]) {
        groupedByBase[baseSlug] = [];
      }
      groupedByBase[baseSlug].push(url);
    });
    
    // Create one item per base slug using realistic data
    return Object.entries(groupedByBase).map(([baseSlug, images]) => {
      const data = propertyData[baseSlug] || {
        title: baseSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        location: 'Location TBD',
        price: 500000,
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 2000,
        address: 'Address TBD',
        description: `Beautiful ${baseSlug.replace(/-/g, ' ')}`,
        yearBuilt: 2015,
        parkingAvailable: 'Yes',
        features: ['Modern design'],
        amenities: ['Premium finishes'],
        tag: null
      };
      
      return {
        ...data,
        images: images,
        type: 'sale',
        status: 'published',
        createdAt: new Date(),
        slug: baseSlug,
      };
    });
  }
  // Fallback to first two images logic
  const all = (manifest.images || []).filter(Boolean);
  const urlA = all[0] || '';
  const urlB = all[1] || all[0] || '';
  const img1 = urlA ? [urlA] : [];
  const img2 = urlB ? [urlB] : [];
  const baseA = basenameNoExtFromUrl(urlA) || 'item-a';
  let baseB = basenameNoExtFromUrl(urlB) || 'item-b';
  if (baseB === baseA) baseB = `${baseB}-b`;
  return [
    {
      title: baseA,
      price: 250000,
      location: 'City Center',
      bedrooms: 2,
      bathrooms: 1,
      squareFootage: 80,
      address: '123 Main St',
      images: img1,
      description: 'Great apartment',
      propertyType: 'apartment',
      yearBuilt: 2015,
      parkingAvailable: 'Yes',
      type: 'sale',
      status: 'published',
      createdAt: new Date(),
      slug: baseA,
    },
    {
      title: baseB,
      price: 450000,
      location: 'Green Suburbs',
      bedrooms: 4,
      bathrooms: 3,
      squareFootage: 180,
      address: '456 Oak Ave',
      images: img2,
      description: 'Spacious family home',
      propertyType: 'house',
      yearBuilt: 2008,
      parkingAvailable: 'Garage',
      type: 'sale',
      status: 'published',
      createdAt: new Date(),
      slug: baseB,
    },
  ];
})();

// Get all base slugs for cleanup
const slugsForCleanup = (() => {
  if (manifest.bySlug && Object.keys(manifest.bySlug).length > 0) {
    // Get unique base slugs by removing -2, -3, etc.
    const baseSlugs = Object.keys(manifest.bySlug)
      .map(slug => slug.replace(/-\d+$/, ''))
      .filter((slug, idx, arr) => arr.indexOf(slug) === idx);
    return baseSlugs;
  }
  // Fallback logic
  const all = (manifest.images || []).filter(Boolean);
  const urlA = all[0] || '';
  const urlB = all[1] || all[0] || '';
  const baseA = basenameNoExtFromUrl(urlA) || 'item-a';
  let baseB = basenameNoExtFromUrl(urlB) || 'item-b';
  if (baseB === baseA) baseB = `${baseB}-b`;
  return [baseA, baseB];
})();

async function run() {
  const { default: Item } = await import('../models/Item.js');
  const { default: User } = await import('../models/User.js');

  const conn = await mongoose.connect(MONGO_URI);
  console.log('Connected to Mongo, seeding uploaded-image dataset...');

  // Clean existing docs by email/address/slug to avoid uniqueness errors
  await User.deleteMany({ email: user.email });
  await Item.deleteMany({
    $or: [
      { address: { $in: items.map(i => i.address) } },
      { slug: { $in: slugsForCleanup } },
    ],
  });

  await User.insertMany([user]);
  // Upsert items by slug
  for (const it of items) {
    await Item.findOneAndUpdate({ slug: it.slug }, it, { upsert: true, new: true });
  }

  await conn.disconnect();
  console.log('Seed complete (from manifest).');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

