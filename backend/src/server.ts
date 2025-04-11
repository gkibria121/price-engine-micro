import app from "./app";
import connectDatabase from "./config/connectdb";
import dotenv from "dotenv";
import path from "path";
const PORT = 3000;
const setup = async () => {
  try {
    await connectDatabase();

    console.log("Database connected!");
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
setup();
