import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure monorepo-level uploads directories exist
const monorepoUploadsRoot = path.join(process.cwd(), "uploads");
const rawDir = path.join(monorepoUploadsRoot, "raw");
const optimizedDir = path.join(monorepoUploadsRoot, "optimized");
[monorepoUploadsRoot, rawDir, optimizedDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, rawDir),
  filename: (_req, file, cb) => {
    const baseName = path.parse(file.originalname).name;
    const unique = `${Date.now()}-${baseName}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
console.log("📥 Upload route mounted");

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const processedImages = [];

    for (const file of req.files) {
      const inputPath = file.path;
      const baseName = path.parse(file.originalname).name;
      const filename = `${Date.now()}-${baseName}.webp`;
      const outputPath = path.join(optimizedDir, filename);

      await sharp(inputPath)
        .resize({ width: 1920 })
        .toFormat("webp")
        .webp({ quality: 80 })
        .toFile(outputPath);

      fs.unlinkSync(inputPath); // Remove raw file
      processedImages.push(`/uploads/${filename}`);
    }

    res.json({ urls: processedImages });
  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ error: "Failed to process images" });
  }
});

export default router;
