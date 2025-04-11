import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach } from "@jest/globals";

let mongo: MongoMemoryServer;
// jest.mock("../lib/natas-client");
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  // process.env.JWT_KEY = "asdf";
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  jest.clearAllMocks();
  await mongoose.connection.dropDatabase(); // Clear the database after each test
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop(); // Ensure final cleanup
});
