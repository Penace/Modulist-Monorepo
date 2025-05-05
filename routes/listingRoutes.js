import express from "express";
import {
  getAllListings,
  getListingById,
  getListingsByStatus,
  createListing,
  updateListing,
  deleteListing,
  approveListing,
  rejectListing,
} from "../controllers/listingController.js";
import Listing from "../models/Listing.js";

const router = express.Router();

// Routes
router.get("/", getAllListings);
router.get("/status/:status", getListingsByStatus);
router.get("/:id", getListingById);
router.post("/", createListing);
router.patch("/:id", updateListing);
router.delete("/:id", deleteListing);

// Additional routes for managing listing statuses (drafts, approvals)
router.post("/:id/approve", approveListing);
router.post("/:id/reject", rejectListing);

export default router;
