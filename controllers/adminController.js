import User from "../models/user.js";
import Listing from "../models/listing.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments();
    const pendingListings = await Listing.countDocuments({ approved: false });
    const totalUsers = await User.countDocuments();
    const activeAgents = await User.countDocuments({
      role: "agent",
      approved: true,
    });
    const admins = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      totalListings,
      pendingListings,
      totalUsers,
      activeAgents,
      admins,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics", error });
  }
};
