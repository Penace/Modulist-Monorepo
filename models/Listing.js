import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Listing", listingSchema);
