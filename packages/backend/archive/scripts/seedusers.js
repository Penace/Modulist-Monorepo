import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany({});

const users = [
  {
    email: "admin@site.com",
    name: "Admin Alpha",
    passwordHash: await bcrypt.hash("admin123", 10),
    role: "admin",
    currency: "USD",
    approved: true,
  },
  {
    email: "agent@site.com",
    name: "Agent Echo",
    passwordHash: await bcrypt.hash("agent123", 10),
    role: "agent",
    currency: "USD",
    approved: true,
  },
  {
    email: "user@site.com",
    name: "User Delta",
    passwordHash: await bcrypt.hash("user123", 10),
    role: "user",
    currency: "USD",
    approved: true,
  },
];

await User.insertMany(users);
console.log("✅ Users seeded.");
process.exit();
