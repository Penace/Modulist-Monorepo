import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    defaultCurrency: { type: String, default: "USD" },
    requireApproval: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);
