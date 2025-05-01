import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: { type: [String], required: true }, // Changed from 'image' to 'images' array
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  tag: {
    type: String,
    enum: ["featured", "auction", "sponsored", null],
    default: null,
  },
});

export default mongoose.models.Listing ||
  mongoose.model("Listing", listingSchema);
