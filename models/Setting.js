import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    defaultCurrency: { type: String, default: "USD" },
    requireApproval: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", settingSchema);
