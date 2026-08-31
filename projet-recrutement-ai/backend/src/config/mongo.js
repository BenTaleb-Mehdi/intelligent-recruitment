import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/recruitment_chat";
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(mongoUri);
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectMongo;
