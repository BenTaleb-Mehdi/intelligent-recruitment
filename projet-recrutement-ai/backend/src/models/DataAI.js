import mongoose from "mongoose";

const dataAISchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      index: true,
    },
    cvId: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      index: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: false, // Flexible schema for any payload structure saved by n8n or external parser
  }
);

const DataAI = mongoose.models.DataAI || mongoose.model("DataAI", dataAISchema, "dataAI");

export default DataAI;
