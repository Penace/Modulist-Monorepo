const Settings = require("../models/Settings");
module.exports = async function (req, res, next) {
  const settings = await Settings.findOne();
  if (settings.maintenanceMode && !req.user?.role === "admin") {
    return res.status(503).json({ message: "Site is under maintenance." });
  }
  next();
};
