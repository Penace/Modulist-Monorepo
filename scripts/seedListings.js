import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "../models/Listing.js"; // Adjust the path if necessary

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return recreateListingsWithImages();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

async function recreateListingsWithImages() {
  // Step 1: Drop the existing listings collection
  await Listing.deleteMany({});
  console.log("✅ Dropped existing listings collection");

  // Step 2: Define the new listings with images
  const listingsData = [
    {
      title: "Modern Luxury Villa",
      price: 5220000,
      location: "Beverly Hills, CA",
      description:
        "A stunning modern villa featuring infinity pool and panoramic Beverly Hills views.",
      images: ["modern_luxury_villa.jpg"],
    },
    {
      title: "Tuscan Mansion",
      price: 4800000,
      location: "Florence, Italy",
      description:
        "Historic charm meets modern luxury in this breathtaking Tuscan-style mansion.",
      images: ["tuscan_mansion.jpg"],
    },
    {
      title: "Penthouse Apartment",
      price: 3500000,
      location: "New York City, NY",
      description:
        "Experience luxury city living with a rooftop terrace and skyline views.",
      images: ["penthouse_apartment.jpg"],
    },
    {
      title: "Beachfront Villa",
      price: 7400000,
      location: "Malibu, CA",
      description:
        "Wake up to ocean views in this pristine Malibu beachfront villa.",
      images: ["beachfront_villa.jpg"],
    },
    {
      title: "Urban Sky Loft",
      price: 2900000,
      location: "Tokyo, Japan",
      description:
        "A cutting-edge loft in the heart of Tokyo's vibrant skyline.",
      images: ["urban_sky_loft.jpg"],
    },
    {
      title: "Dubai Marina Tower",
      price: 8200000,
      location: "Dubai, UAE",
      description: "Soar above Dubai Marina in this luxurious tower penthouse.",
      images: ["dubai_marina_tower.jpg", "dubai_marina_tower_2.jpg"],
    },
    {
      title: "Château Royale",
      price: 12000000,
      location: "Loire Valley, France",
      description:
        "Own a piece of history in this majestic French royal château.",
      images: ["french_castle_chateau.jpg"],
    },
    {
      title: "Skyline View Apartment",
      price: 1750000,
      location: "Chicago, IL",
      description:
        "Modern downtown apartment with panoramic Chicago skyline views.",
      images: ["skyline_view_apartment.jpg"],
    },
    {
      title: "Private Island Estate",
      price: 22000000,
      location: "Bahamas",
      description: "Secluded private island estate with white sand beaches.",
      images: ["private_island_estate.jpg", "private_island_estate_2.jpg"],
    },
    {
      title: "Countryside Farmhouse",
      price: 2300000,
      location: "Napa Valley, CA",
      description:
        "Rustic luxury farmhouse nestled in the heart of wine country.",
      images: ["countryside_farmhouse.jpg", "countryside_farmhouse_2.jpg"],
    },
    {
      title: "Desert Oasis Mansion",
      price: 6800000,
      location: "Scottsdale, AZ",
      description:
        "Escape to this desert oasis featuring luxurious indoor-outdoor living.",
      images: ["desert_oasis_mansion.jpg", "desert_oasis_mansion_2.jpg"],
    },
    {
      title: "Lakefront Modern Retreat",
      price: 5600000,
      location: "Lake Tahoe, NV",
      description:
        "Serene lakefront villa offering tranquility and modern design.",
      images: [
        "lakefront_modern_retreat.jpg",
        "lakefront_modern_retreat_2.jpg",
      ],
    },
    {
      title: "ddd",
      price: 322,
      location: "ddd",
      description: "ddddddddddd",
      images: ["d.jpg"],
    },
  ];

  // Step 3: Insert new listings into the collection
  await Listing.insertMany(listingsData);
  console.log("✅ Listings recreated and images added.");
  process.exit();
}
