import mongoose from "mongoose";
import Listing from "../models/Listing.js";

// GET all listings
export const getAllListings = async (req, res) => {
  try {
    const query = {};
    if (req.query.tag) {
      query.tag = req.query.tag;
    }
    const listings = await Listing.find(query);
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error });
  }
};

// GET listing by ID
export const getListingById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID format" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listing", error });
  }
};

// POST new listing
export const createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(400).json({ message: "Error creating listing", error });
  }
};

// PATCH update listing
export const updateListing = async (req, res) => {
  console.log("Updating listing ID:", req.params.id);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID format" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: "Error updating listing", error });
  }
};

// DELETE listing
export const deleteListing = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID format" });
    }

    const deletedListing = await Listing.findByIdAndDelete(req.params.id);

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting listing", error });
  }
};
