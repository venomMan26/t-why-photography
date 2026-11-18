
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const admin = await Admin.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful.",
      token,
      username: admin.username,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Unable to log in.",
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("username");

    if (!admin) {
      return res.status(404).json({
        message: "Admin account not found.",
      });
    }

    res.json({ username: admin.username });
  } catch {
    res.status(500).json({
      message: "Unable to verify session.",
    });
  }
});

export default router;
