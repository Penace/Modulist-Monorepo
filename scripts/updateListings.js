import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "../models/Listing.js"; // Adjust the path if necessary

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return updateListingsWithImages();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

async function updateListingsWithImages() {
  const listingsData = [
    {
      _id: "681335cb643252b3d656ddba", // Modern Luxury Villa
      title: "Modern Luxury Villa",
      price: 5220000,
      location: "Beverly Hills, CA",
      description:
        "A stunning modern villa featuring infinity pool and panoramic Beverly Hills views.",
      images: ["modern_luxury_villa.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddbb", // Tuscan Mansion
      title: "Tuscan Mansion",
      price: 4800000,
      location: "Florence, Italy",
      description:
        "Historic charm meets modern luxury in this breathtaking Tuscan-style mansion.",
      images: ["tuscan_mansion.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddbc", // Penthouse Apartment
      title: "Penthouse Apartment",
      price: 3500000,
      location: "New York City, NY",
      description:
        "Experience luxury city living with a rooftop terrace and skyline views.",
      images: ["penthouse_apartment.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddbd", // Beachfront Villa
      title: "Beachfront Villa",
      price: 7400000,
      location: "Malibu, CA",
      description:
        "Wake up to ocean views in this pristine Malibu beachfront villa.",
      images: ["beachfront_villa.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddbe", // Urban Sky Loft
      title: "Urban Sky Loft",
      price: 2900000,
      location: "Tokyo, Japan",
      description:
        "A cutting-edge loft in the heart of Tokyo's vibrant skyline.",
      images: ["urban_sky_loft.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddbf", // Dubai Marina Tower
      title: "Dubai Marina Tower",
      price: 8200000,
      location: "Dubai, UAE",
      description: "Soar above Dubai Marina in this luxurious tower penthouse.",
      images: ["dubai_marina_tower.jpg", "dubai_marina_tower_2.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddc0", // Château Royale
      title: "Château Royale",
      price: 12000000,
      location: "Loire Valley, France",
      description:
        "Own a piece of history in this majestic French royal château.",
      images: ["french_castle_chateau.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddc1", // Skyline View Apartment
      title: "Skyline View Apartment",
      price: 1750000,
      location: "Chicago, IL",
      description:
        "Modern downtown apartment with panoramic Chicago skyline views.",
      images: ["skyline_view_apartment.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddc2", // Private Island Estate
      title: "Private Island Estate",
      price: 22000000,
      location: "Bahamas",
      description: "Secluded private island estate with white sand beaches.",
      images: ["private_island_estate.jpg", "private_island_estate_2.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddc3", // Countryside Farmhouse
      title: "Countryside Farmhouse",
      price: 2300000,
      location: "Napa Valley, CA",
      description:
        "Rustic luxury farmhouse nestled in the heart of wine country.",
      images: ["countryside_farmhouse.jpg", "countryside_farmhouse_2.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddc4", // Desert Oasis Mansion
      title: "Desert Oasis Mansion",
      price: 6800000,
      location: "Scottsdale, AZ",
      description:
        "Escape to this desert oasis featuring luxurious indoor-outdoor living.",
      images: ["desert_oasis_mansion.jpg", "desert_oasis_mansion_2.jpg"], // Ensure images are listed here
    },
    {
      _id: "681335cb643252b3d656ddc5", // Lakefront Modern Retreat
      title: "Lakefront Modern Retreat",
      price: 5600000,
      location: "Lake Tahoe, NV",
      description:
        "Serene lakefront villa offering tranquility and modern design.",
      images: [
        "lakefront_modern_retreat.jpg",
        "lakefront_modern_retreat_2.jpg",
      ], // Ensure images are listed here
    },
  ];

  // Step 1: Drop the existing listings collection
  await Listing.deleteMany({});
  console.log("✅ Dropped existing listings collection");

  // Step 2: Insert new listings with images
  for (let listing of listingsData) {
    const objectId = new mongoose.Types.ObjectId(listing._id);
    console.log("Inserting Listing ID:", objectId);

    const result = await Listing.create(listing);
    console.log(`✅ Inserted listing ${listing._id}`);
  }

  console.log("✅ All listings inserted with images.");
  process.exit();
}
