import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFootage: { type: Number, required: true },
  address: { type: String, required: true },
  images: { type: [String], required: true }, // Changed from 'image' to 'images' array
  description: { type: String },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFootage: { type: Number, required: true },
  propertyType: { type: String, required: true },

  yearBuilt: { type: Number, required: true },
  parkingAvailable: { type: String, required: true },
  listingType: {
    type: String,
    enum: ["sale", "rent", "auction"],
    required: true,
  },
  availableFrom: { type: Date },

  createdAt: { type: Date, default: Date.now },
  tag: {
    type: String,
    enum: ["featured", "auction", "sponsored", null],
    default: null,
  },
  slug: { type: String, unique: true },
});

// Add a virtual field for keyInfo (optional, used for frontend presentation)
listingSchema.virtual("keyInfo").get(function () {
  return {
    bedrooms: this.bedrooms,
    bathrooms: this.bathrooms,
    squareFootage: this.squareFootage,
  };
});

export default mongoose.models.Listing ||
  mongoose.model("Listing", listingSchema);
