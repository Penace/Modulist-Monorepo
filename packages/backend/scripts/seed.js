import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

// Import models
import Item from "../models/Item.js";
import User from "../models/User.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the seed data
const dbPath = path.join(__dirname, "../archive/db.json");
const raw = fs.readFileSync(dbPath, "utf8");
const { listings, pendingListings } = JSON.parse(raw);

// Prepare listings data
// Helper function to generate random data
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Convert listing type to proper enum value
const getListingType = (listing) => {
  if (listing.isAuction) return "auction";
  return "sale"; // Default to sale for now
};

// Get tag based on listing flags
const getTag = (listing) => {
  if (listing.isFeatured) return "featured";
  if (listing.isAuction) return "auction";
  if (listing.isSponsored) return "sponsored";
  return null;
};

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const cleanListings = listings
  .filter(listing => listing.id !== "9398") // Remove test listing
  .map(({ id, ...rest }) => ({
    ...rest,
    price: Number(rest.price),
    bedrooms: getRandomInt(2, 6),
    bathrooms: getRandomInt(2, 5),
    squareFootage: getRandomInt(1500, 8000),
    address: rest.location, // Using location as address for now
    propertyType: rest.type || "Residential",
    yearBuilt: getRandomInt(1990, 2020),
    parkingAvailable: "Yes",
    type: getListingType(rest),
    status: "published",
    tag: getTag(rest),
    slug: generateSlug(rest.title),
    createdAt: new Date(),
    availableFrom: new Date(),
  }));

// Add pending listings with pending status
const cleanPendingListings = pendingListings.map(({ id, ...rest }) => ({
  ...rest,
  price: Number(rest.price),
  bedrooms: getRandomInt(2, 4),
  bathrooms: getRandomInt(1, 3),
  squareFootage: getRandomInt(1000, 3000),
  address: rest.location || "Address pending",
  propertyType: "Residential",
  yearBuilt: getRandomInt(1990, 2020),
  parkingAvailable: "Yes",
  type: "sale",
  status: "draft",
  tag: null,
  slug: generateSlug(rest.title),
  createdAt: new Date(),
  availableFrom: new Date(),
}));

// Prepare users data with proper structure
const users = [
  {
    email: "admin@site.com",
    name: "Admin Alpha",
    passwordHash: await bcrypt.hash("admin123", 10),
    role: "admin",
    currency: "USD",
    approved: true,
    createdAt: new Date()
  },
  {
    email: "agent@site.com",
    name: "Agent Echo",
    passwordHash: await bcrypt.hash("agent123", 10),
    role: "publisher",
    currency: "USD",
    approved: true,
    createdAt: new Date()
  },
  {
    email: "user@site.com",
    name: "User Delta",
    passwordHash: await bcrypt.hash("user123", 10),
    role: "user",
    currency: "USD",
    approved: true,
    createdAt: new Date()
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Item.deleteMany({});
    await User.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Insert all listings
    const allListings = [...cleanListings, ...cleanPendingListings];
    await Item.insertMany(allListings);
    console.log(`✅ Seeded ${allListings.length} listings (${cleanListings.length} active, ${cleanPendingListings.length} pending)`);

    // Insert users
    await User.insertMany(users);
    console.log(`✅ Seeded ${users.length} users`);

    console.log("✨ Database seeded successfully!");

    // Log summary of seeded data
    console.log("\n📊 Seed Summary:");
    console.log("🏠 Listings:");
    console.log(`  • Active: ${cleanListings.length}`);
    console.log(`  • Pending: ${cleanPendingListings.length}`);
    console.log(`  • Featured: ${cleanListings.filter(l => l.isFeatured).length}`);
    console.log(`  • Auction: ${cleanListings.filter(l => l.isAuction).length}`);
    console.log(`  • Sponsored: ${cleanListings.filter(l => l.isSponsored).length}`);
    console.log("\n👥 Users:");
    console.log("  • Admin (admin@site.com)");
    console.log("  • Agent (agent@site.com)");
    console.log("  • User (user@site.com)");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedDatabase();
