import mongoose from "mongoose";

const pendingListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  submittedBy: { type: String }, // could be user ID or email
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PendingListing", pendingListingSchema);
