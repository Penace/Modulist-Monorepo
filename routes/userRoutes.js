import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  approveUser,
  deleteUser,
  getUserByEmail,
  rejectUser,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers); // List all users
router.get("/email/:email", getUserByEmail); // Find user by email
router.get("/:id", getUserById); // Get user by ID
router.post("/", createUser); // Create user
router.patch("/:id/approve", approveUser); // ✅ Approve user
router.patch("/:id/reject", rejectUser); // ✅ Reject user
router.post("/addFavorite", addFavorite); // Add to favorites
router.delete("/removeFavorite", removeFavorite); // Remove from favorites
router.get("/:userId/favorites", getFavorites); // Get user favorites
router.delete("/:id", deleteUser); // Delete user

export default router;
