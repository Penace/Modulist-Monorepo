import express from "express";
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import Listing from "../models/Listing.js";

const router = express.Router();

// Routes
router.get("/", getAllListings);
router.get("/:id", getListingById);
router.get("/status/:status", async (req, res) => {
  try {
    const listings = await Listing.find({ status: req.params.status });
    res.status(200).json(listings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching listings by status", error });
  }
});
router.post("/", createListing);
router.patch("/:id", updateListing);
router.delete("/:id", deleteListing);

// Additional routes for managing listing statuses (drafts, approvals)
router.post("/:id/approve", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "approved";
    const saved = await listing.save();
    res.status(200).json({ message: "Listing approved", listing: saved });
  } catch (error) {
    res.status(500).json({ message: "Error approving listing", error });
  }
});

router.post("/:id/reject", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "rejected";
    const saved = await listing.save();
    res.status(200).json({ message: "Listing rejected", listing: saved });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting listing", error });
  }
});

export default router;
