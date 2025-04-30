import express from "express";
import PendingListing from "../models/PendingListing.js";
import Listing from "../models/Listing.js";

const router = express.Router();

// GET all pending listings
router.get("/", async (req, res) => {
  try {
    const listings = await PendingListing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending listings", error });
  }
});

// POST a new pending listing
router.post("/", async (req, res) => {
  try {
    const newListing = new PendingListing(req.body);
    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error creating pending listing", error });
  }
});

// GET a single pending listing by ID
router.get("/:id", async (req, res) => {
  try {
    const listing = await PendingListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listing", error });
  }
});

// DELETE a pending listing (optional)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PendingListing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json({ message: "Deleted", listing: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting listing", error });
  }
});

// APPROVE a pending listing
router.post("/:id/approve", async (req, res) => {
  try {
    const pending = await PendingListing.findById(req.params.id);
    if (!pending)
      return res.status(404).json({ message: "Pending listing not found" });

    const approved = new Listing({
      title: pending.title,
      price: pending.price,
      location: pending.location,
      image: pending.image,
      description: pending.description,
    });

    const savedListing = await approved.save();
    await pending.deleteOne();

    res.status(201).json({
      message: "Approved and moved to listings",
      listing: savedListing,
    });
  } catch (error) {
    res.status(500).json({ message: "Error approving listing", error });
  }
});

export default router;
