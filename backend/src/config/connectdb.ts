import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    // Ensure MONGO_URI is available in environment variables
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    // Connect to MongoDB with autoIndex set to true for development
    await mongoose.connect(MONGO_URI, { autoIndex: true });

    // Check if db connection exists before attempting to create index
    if (mongoose.connection.db) {
      // Create unique index for 'name' field in the 'products' collection
      await mongoose.connection.db
        .collection("products")
        .createIndex({ name: 1 }, { unique: true });
      console.log("Mongoose Connected and Index Created");
    } else {
      throw new Error("Database connection is undefined");
    }
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error);
    throw new Error("Unable to connect DB");
  }
};

export default connectDatabase;
