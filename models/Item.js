import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: function () {
      return this.status !== "draft";
    },
  },
  price: {
    type: Number,
    required: function () {
      return this.status !== "draft";
    },
  },
  location: {
    type: String,
    required: function () {
      return this.status !== "draft";
    },
  },
  bedrooms: {
    type: Number,
    required: function () {
      return this.status !== "draft";
    },
  },
  bathrooms: {
    type: Number,
    required: function () {
      return this.status !== "draft";
    },
  },
  squareFootage: {
    type: Number,
    required: function () {
      return this.status !== "draft";
    },
  },
  address: {
    type: String,
    required: function () {
      return this.status !== "draft";
    },
  },
  images: {
    type: [String],
    required: function () {
      return this.status !== "draft";
    },
  }, // Changed from 'image' to 'images' array
  description: { type: String },
  propertyType: {
    type: String,
    required: function () {
      return this.status !== "draft";
    },
  },

  yearBuilt: {
    type: Number,
    required: function () {
      return this.status !== "draft";
    },
  },
  parkingAvailable: {
    type: String,
    required: function () {
      return this.status !== "draft";
    },
  },
  type: { // Changed from listingType to type
    type: String,
    enum: ["sale", "rent", "auction"],
    required: function () {
      return this.status !== "draft";
    },
  },
  availableFrom: { type: Date },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "published",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  createdAt: { type: Date, default: Date.now },
  tag: {
    type: String,
    enum: ["featured", "auction", "sponsored", null],
    default: null,
  },
  slug: { type: String, unique: true },
});

// Add a virtual field for keyInfo (optional, used for frontend presentation)
itemSchema.virtual("keyInfo").get(function () {
  return {
    bedrooms: this.bedrooms,
    bathrooms: this.bathrooms,
    squareFootage: this.squareFootage,
  };
});

export default mongoose.models.Item ||
  mongoose.model("Item", itemSchema);
