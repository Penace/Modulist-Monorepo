import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/raw/" });
console.log("📥 Upload route mounted");

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const processedImages = [];

    for (const file of req.files) {
      const inputPath = file.path;
      const baseName = path.parse(file.originalname).name;
      const filename = `${Date.now()}-${baseName}.webp`;
      const outputPath = path.join("uploads/optimized", filename);

      await sharp(inputPath)
        .resize({ width: 1920 })
        .toFormat("webp")
        .webp({ quality: 80 })
        .toFile(outputPath);

      fs.unlinkSync(inputPath); // Remove raw file
      processedImages.push(`/uploads/optimized/${filename}`);
    }

    res.json({ urls: processedImages });
  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ error: "Failed to process images" });
  }
});

export default router;
