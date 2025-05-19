import app from "./app";
import connectDatabase from "./config/connectdb";
import dotenv from "dotenv";
import path from "path";
import { connectNatsJetStream } from "./config/connetNatsJetStream";
const PORT = 8000;
const setup = async () => {
  try {
    await connectDatabase();
    console.log("Database connected!");
    await connectNatsJetStream();
    console.log("Nats connected!");
  } catch (error: unknown) {
    console.log(error);
    process.exit();
  }
  app.listen(PORT, () => {
    console.log("Server running at localhost:" + PORT);
  });
};
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required!");
if (!process.env.CLUSTER_ID) throw new Error("CLUSTER_ID is required!");
if (!process.env.NATS_URL) throw new Error("NATS_URL is required!");
setup();
