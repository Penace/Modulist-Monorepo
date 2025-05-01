import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  name: {
    type: String,
    trim: true,
    minlength: 2,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "agent", "user"],
    default: "user",
    required: true,
  },
  birthdate: {
    type: Date,
  },
  currency: {
    type: String,
    enum: [
      "USD",
      "EUR",
      "GBP",
      "ILS",
      "AED",
      "CAD",
      "AUD",
      "CHF",
      "JPY",
      "CNY",
    ],
    default: "USD",
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatarUrl: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
