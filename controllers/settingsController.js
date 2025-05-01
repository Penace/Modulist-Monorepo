import Setting from "../models/Setting.js";

// GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings", error });
  }
};

// PATCH /api/settings
export const updateSettings = async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings", error });
  }
};
