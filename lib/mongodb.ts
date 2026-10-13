import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  try {

    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}