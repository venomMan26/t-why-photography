
import express from "express";
import multer from "multer";
import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.js";
import Photo from "../models/PhotoTemp.js";
import protect from "../middleware/auth.js";

const router = express.Router();

const allowedSizes = ["normal", "tall", "wide", "large"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed."));
    }

    callback(null, true);
  },
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "t-why-photography-gallery",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

// PUBLIC: Get all gallery photographs
router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    console.error("Gallery error:", error.message);

    res.status(500).json({
      message: "Unable to load gallery.",
    });
  }
});

// ADMIN: Upload a photograph
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    let uploadedImage;

    try {
      const { title, category, size } = req.body;

      if (!title?.trim() || !category?.trim() || !req.file) {
        return res.status(400).json({
          message: "Title, category and image are required.",
        });
      }

      const selectedSize = size || "normal";

      if (!allowedSizes.includes(selectedSize)) {
        return res.status(400).json({
          message: "Invalid display size selected.",
        });
      }

      uploadedImage = await uploadToCloudinary(req.file.buffer);

      const photo = await Photo.create({
        title: title.trim(),
        category: category.trim().toUpperCase(),
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        size: selectedSize,
      });

      res.status(201).json({
        message: "Photograph uploaded successfully.",
        photo,
      });
    } catch (error) {
      if (uploadedImage?.public_id) {
        await cloudinary.uploader
          .destroy(uploadedImage.public_id)
          .catch(() => {});
      }

      console.error("Upload error:", error.message);

      res.status(500).json({
        message: error.message || "Image upload failed.",
      });
    }
  }
);

// ADMIN: Edit photograph details
router.patch("/:id", protect, async (req, res) => {
  try {
    const { title, category, size } = req.body;

    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        message: "Photograph not found.",
      });
    }

    if (typeof title === "string" && title.trim()) {
      photo.title = title.trim();
    }

    if (typeof category === "string" && category.trim()) {
      photo.category = category.trim().toUpperCase();
    }

    if (size !== undefined) {
      if (!allowedSizes.includes(size)) {
        return res.status(400).json({
          message: "Invalid display size selected.",
        });
      }

      photo.size = size;
    }

    await photo.save();

    res.json({
      message: "Photograph updated successfully.",
      photo,
    });
  } catch (error) {
    console.error("Edit error:", error.message);

    res.status(500).json({
      message: "Unable to update photograph.",
    });
  }
});

// ADMIN: Delete photograph
router.delete("/:id", protect, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        message: "Photograph not found.",
      });
    }

    await cloudinary.uploader.destroy(photo.publicId);
    await photo.deleteOne();

    res.json({
      message: "Photograph deleted successfully.",
    });
  } catch (error) {
    console.error("Delete error:", error.message);

    res.status(500).json({
      message: "Unable to delete photograph.",
    });
  }
});

export default router;
