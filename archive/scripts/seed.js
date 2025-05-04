import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Listing from "../models/Listing.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "db.json");
const raw = fs.readFileSync(dbPath, "utf8");
const { listings } = JSON.parse(raw);

const cleanListings = listings.map(({ id, ...rest }) => rest);

await mongoose.connect(process.env.MONGO_URI);
await Listing.deleteMany(); // Optional: clear existing
await Listing.insertMany(cleanListings);

console.log("✅ Listings seeded.");
process.exit();
