import { Request } from "express-validator/lib/base";
import VendorModel from "../models/VendorModel";
import { Response } from "express";
import VendorProductModel from "../models/VendorProductModel";

export async function index(req: Request, res: Response) {
  const vendors = await VendorModel.find();
  res.status(200).send({
    vendors,
  });
}

export async function createVendor(req: Request, res: Response) {
  const { name, email, address, rating } = req.body;
  const existingVendor = await VendorModel.findOne({ email });
  if (!name || !email || !address) {
    res.status(442).send({ message: "Missing fields" });
    return;
  }
  if (existingVendor) {
    res.status(442).send({ email: "Email already taken" });
    return;
  }
  const newVendor = await VendorModel.create({ name, email, address, rating });
  res.status(201).send({ vendor: newVendor });
}
export async function deleteVendor(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    res.status(404).send({ message: "Vendor not found!" });
    return;
  }
  // Delete vendor and related products
  await VendorProductModel.deleteMany({ vendorId: id });
  await VendorModel.findByIdAndDelete(id);
  res.status(204).send({ message: "Vendor not found!" });
}
export async function updateVendor(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const { name, email, address, rating } = req.body;

  if (!name || !email || !address) {
    res.status(442).send({ message: "Missing fields" });
    return;
  }

  const vendor = await VendorModel.findById(id);

  if (!vendor) {
    res.status(404).send({ message: "Vendor not found!" });
    return;
  }
  // Delete vendor and related products
  await VendorProductModel.findOneAndUpdate(
    { _id: id },
    { $set: { name, email, address, rating } },
    { new: true, runValidators: true }
  );

  res.status(200).send({ message: "Vendor updated!" });
}
export async function bulkInsertOrUpdate(req: Request, res: Response) {
  const { vendors } = req.body;

  if (!vendors || !Array.isArray(vendors) || vendors.length === 0) {
    res.status(442).send({ message: "Missing or invalid vendor data" });
    return;
  }
  // Check for duplicate emails in the database
  const existingEmails = await VendorModel.find({
    email: { $in: vendors.map((v) => v.email) },
  }).distinct("email");
  if (existingEmails.length > 0) {
    res.status(442).send({ message: "Some emails are already taken" });
    return;
  }
  // Save multiple vendors
  const savedVendors = await VendorModel.insertMany(vendors);

  res.status(201).send({ message: "Vendors created", vendors: savedVendors });
}
