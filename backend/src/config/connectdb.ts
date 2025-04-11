import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI!;
    await mongoose.connect(MONGO_URI);

    console.log("Mongoose Connected");
  } catch (error) {
    console.error("Unable to connecte Mongoose");
    throw new Error("Unable to connect DB");
  }
};

export default connectDatabase;
