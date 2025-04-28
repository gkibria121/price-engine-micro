import { Request, Response } from "express";
import fs from "fs/promises"; // Use fs.promises for async/await

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
