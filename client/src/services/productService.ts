import mongoose from "mongoose";

export async function deleteProduct(id: mongoose.mongo.ObjectId) {
  console.log("deleting product...", id);
  throw new Error("Somethign went wrong!");
}
