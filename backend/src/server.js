
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import authRoutes from "./routes/auth.js";
import galleryRoutes from "./routes/gallery.js";

const app = express();

const allowedOrigins = [
  "https://t-why-photography.vercel.app",
  "http://localhost:5173",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
].map((origin) => origin.replace(/\/$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      console.error("Blocked by CORS:", origin);
      return callback(new Error("Origin not allowed by CORS."));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ message: "T-Why Photography API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);

app.use((error, req, res, next) => {
  console.error(error.message);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Image must be 5MB or smaller."
          : error.message,
    });
  }

  res.status(400).json({
    message: error.message || "Something went wrong.",
  });
});

const createInitialAdmin = async () => {
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password || password.length < 12) {
    throw new Error(
      "Set ADMIN_USERNAME and an ADMIN_PASSWORD of at least 12 characters in .env"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const existingAdmin = await Admin.findOne({ username });

  if (!existingAdmin) {
    await Admin.create({
      username,
      password: hashedPassword,
    });

    console.log(`Initial admin account created: ${username}`);
  } else {
    existingAdmin.password = hashedPassword;
    await existingAdmin.save();

    console.log("Admin password updated successfully.");
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await createInitialAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`T-Why API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
