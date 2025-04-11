// predownload-mongo.js
const { MongoMemoryServer } = require("mongodb-memory-server");

async function downloadMongo() {
  console.log("Pre-downloading MongoDB binary...");
  const mongod = await MongoMemoryServer.create();
  await mongod.stop();
  console.log("MongoDB binary downloaded successfully!");
}

downloadMongo();
