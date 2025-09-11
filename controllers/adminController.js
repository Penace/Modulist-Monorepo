import User from "../models/user.js";
import Item from "../models/Item.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const pendingItems = await Item.countDocuments({ approved: false });
    const totalUsers = await User.countDocuments();
    const activePublishers = await User.countDocuments({
      role: "publisher",
      approved: true,
    });
    const admins = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      totalItems,
      pendingItems,
      totalUsers,
      activePublishers,
      admins,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics", error });
  }
};
