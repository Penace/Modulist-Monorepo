import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/Listing.js"; // adjust path if needed
import fs from "fs";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const dbJson = JSON.parse(fs.readFileSync("./db.json", "utf8"));

const listings = dbJson.listings.map((l) => {
  const { id, ...rest } = l;
  return rest;
});

await Listing.insertMany(listings);
console.log("✅ Listings seeded.");
process.exit();
