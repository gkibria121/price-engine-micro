import { Request, Response } from "express";
import fs from "fs/promises"; // Use fs.promises for async/await
import VendorProductModel from "../models/VendorProductModel";
import { NotFoundException } from "../Exceptions/NotFoundException";
import { filterDeliverySlots } from "../services/deliverySlotService";

export async function index(req: Request, res: Response) {
  try {
    // Read the file asynchronously
    const data = await fs.readFile("src/data/deliverySlots.json", "utf-8");

    // Parse the JSON content
    const slots = JSON.parse(data);

    // Send the data as a response
    res.status(200).send(slots);
  } catch (error) {
    // Handle errors (e.g., file not found, invalid JSON)
    res.status(500).send({ error: "Failed to read or parse the JSON file." });
  }
}
export async function getProductDeliverySlots(req: Request, res: Response) {
  // Read the file asynchronously
  const { productId } = req.params;
  const availableVendorProducts = await VendorProductModel.find({
    product: productId,
  }).populate("deliverySlots");

  if (availableVendorProducts.length === 0) {
    throw new NotFoundException("No Vendor Product found for this product");
  }
  const deliverySlots = availableVendorProducts.flatMap(
    (vp) => vp.deliverySlots
  );
  const filteredDeliveySlots = filterDeliverySlots(deliverySlots);
  // Send the data as a response
  res.status(200).send(filteredDeliveySlots);
}
