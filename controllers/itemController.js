import mongoose from "mongoose";
import Item from "../models/Item.js";

// GET all items
export const getAllItems = async (req, res) => {
  try {
    const query = {};
    if (req.query.tag) {
      query.tag = req.query.tag;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    const items = await Item.find(query);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// GET item by ID
export const getItemById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

// POST new item
export const createItem = async (req, res) => {
  console.log("Creating item with data:", req.body);
  try {
    const data = { ...req.body };
    if (!data.status) data.status = "draft";
    if (req.user && req.user._id) {
      data.createdBy = req.user._id;
    }
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.map((img) =>
        typeof img === "string" ? img.replace(/([^:]\/)\/+/g, "$1") : img
      );
    }
    // Clean draft fields if status is draft
    if (data.status === "draft") {
      const cleanDraftFields = [
        "location",
        "price",
        "description",
        "images",
        "address",
        "bedrooms",
        "bathrooms",
        "squareFootage",
        "propertyType",
        "yearBuilt",
        "parkingAvailable",
        "type",
        "availableFrom",
        "features",
        "amenities",
        "facilities",
        "slug",
      ];

      cleanDraftFields.forEach((field) => {
        if (
          data[field] === "" ||
          data[field] === undefined ||
          data[field] === null ||
          (Array.isArray(data[field]) && data[field].length === 0)
        ) {
          delete data[field];
        }
      });
    }
    console.log("Final item data before save:", data);
    const newItem = new Item(data);
    const validationError = newItem.validateSync();
    if (data.status !== "draft" && validationError) {
      return res
        .status(400)
        .json({ message: "Validation failed", error: validationError });
    }
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: "Error creating item", error });
  }
};

// PATCH update item
export const updateItem = async (req, res) => {
  console.log("Updating item ID:", req.params.id);
  if (req.body.images && Array.isArray(req.body.images)) {
    req.body.images = req.body.images.map((img) =>
      typeof img === "string" ? img.replace(/([^:]\/)\/+/g, "$1") : img
    );
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

// DELETE item
export const deleteItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

// GET items by status (optional) and userId (required)
export const getItemsByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const userId = req.query.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing userId query parameter" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const query = { createdBy: new mongoose.Types.ObjectId(userId) };
    if (status) {
      query.status = status;
    }

    const items = await Item.find(query);
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching items by status", error });
  }
};

// PATCH approve item by ID
export const approveItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { status: "approved" },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error approving item", error });
  }
};

// PATCH reject item by ID
export const rejectItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { status: "rejected" },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error rejecting item", error });
  }
};

// GET check for duplicate draft by slug, title, or address and createdBy
export const checkDuplicateDraft = async (req, res) => {
  const { title, slug, address, createdBy, itemId } = req.body;

  const query = {
    status: "draft",
    createdBy,
    $or: [
      { title: title.trim() },
      { slug: slug.trim() },
      { address: address.trim() },
    ],
  };

  if (itemId) {
    query._id = { $ne: itemId }; // Exclude current draft
  }

  const exists = await Item.exists(query);
  res.json({ exists: Boolean(exists) });
};
