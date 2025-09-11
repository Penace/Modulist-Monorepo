import Item from "../models/Item.js";
import express from "express";
import {
  getAllItems,
  getItemById,
  getItemsByStatus,
  createItem,
  updateItem,
  deleteItem,
  approveItem,
  rejectItem,
  checkDuplicateDraft,
} from "../controllers/itemController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requirePublisher } from "../middleware/requirePublisher.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

// Public routes
router.get("/", getAllItems);
router.get("/:id", getItemById);

// Publisher routes (require authentication and publisher role)
router.get(
  "/status/:status",
  requireAuth,
  requirePublisher,
  (req, res, next) => {
    req.status = req.params.status;
    next();
  },
  getItemsByStatus
);
router.post("/", requireAuth, requirePublisher, createItem);
router.patch("/:id", requireAuth, requirePublisher, updateItem);
router.delete("/:id", requireAuth, requirePublisher, deleteItem);

// Admin routes for managing item statuses
router.post("/:id/approve", requireAuth, requireAdmin, approveItem);
router.post("/:id/reject", requireAuth, requireAdmin, rejectItem);

// Route to check for duplicate draft item
router.post(
  "/check-duplicate-draft",
  requireAuth,
  requirePublisher,
  checkDuplicateDraft
);

export default router;
