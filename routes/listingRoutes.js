import Listing from "../models/Listing.js";
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
  checkDuplicateDraft,
} from "../controllers/listingController.js";

const router = express.Router();

// Routes
router.get("/", getAllListings);
router.get(
  "/status/:status",
  (req, res, next) => {
    req.status = req.params.status;
    next();
  },
  getListingsByStatus
);
router.get("/:id", getListingById);
router.post("/", createListing);
router.patch("/:id", updateListing);
router.delete("/:id", deleteListing);

// Additional routes for managing listing statuses (drafts, approvals)
router.post("/:id/approve", approveListing);
router.post("/:id/reject", rejectListing);

// Route to check for duplicate draft listing by slug and userId
router.post("/check-duplicate-draft", checkDuplicateDraft);

export default router;
