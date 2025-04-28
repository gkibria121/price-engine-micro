import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach } from "@jest/globals";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  // Check if db connection exists before attempting to use it
  if (mongoose.connection.db) {
    await mongoose.connection.db
      .collection("products")
      .createIndex({ name: 1 }, { unique: true });
  } else {
    throw new Error("Database connection is undefined");
  }
});

afterEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase(); // Clear the database after each test
  } else {
    throw new Error("Database connection is undefined during test cleanup");
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop(); // Ensure final cleanup
});
