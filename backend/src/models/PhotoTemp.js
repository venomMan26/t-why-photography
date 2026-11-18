
import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      enum: ["normal", "tall", "wide", "large"],
      default: "normal",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Photo", photoSchema);
