import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  approveUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/:id/approve", approveUser);
router.delete("/:id", deleteUser);

export default router;
