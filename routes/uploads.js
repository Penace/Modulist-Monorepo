import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/raw/" });
console.log("📥 Upload route mounted");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const baseName = path.parse(req.file.originalname).name;
    const filename = `${Date.now()}-${baseName}.webp`;
    const outputPath = path.join("uploads/optimized", filename);

    await sharp(inputPath)
      .resize({ width: 1920 }) // Resize for consistency
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(outputPath);

    fs.unlinkSync(inputPath); // Remove raw file

    res.json({ url: `/uploads/optimized/${filename}` });
  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ error: "Failed to process image" });
  }
});

export default router;
