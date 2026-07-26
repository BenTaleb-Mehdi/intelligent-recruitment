import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      default: "application/pdf",
    },
    size: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["uploaded", "parsed", "failed"],
      default: "uploaded",
    },
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Cv = mongoose.models.Cv || mongoose.model("Cv", cvSchema, "cvs");

export default Cv;
