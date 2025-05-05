import Settings from "../models/Settings.js";

// GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Initialize defaults
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings", error });
  }
};

// PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    const update = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(update);
    } else {
      Object.assign(settings, update);
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings", error: err });
  }
};
