import { Request, Response } from "express";
import VendorModel from "../models/VendorModel";
import VendorProductModel from "../models/VendorProductModel";

// GET /vendors
export async function index(req: Request, res: Response) {
  const vendors = await VendorModel.find();
  res.status(200).send({ vendors });
}

// POST /vendors/store
export async function createVendor(req: Request, res: Response) {
  const { name, email, address, rating } = req.body;

  if (!name || !email || !address || !rating) {
    res.status(422).send({ message: "Missing fields" });
    return;
  }

  const existingVendor = await VendorModel.findOne({ email });
  if (existingVendor) {
    res.status(422).send({ email: "Email already taken" });
    return;
  }

  const newVendor = await VendorModel.create({ name, email, address, rating });
  res.status(201).send({ vendor: newVendor });
}

// PUT/PATCH /vendors/:id
export async function updateVendor(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { name, email, address, rating } = req.body;

  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    res.status(404).send({ message: "Vendor not found!" });
    return;
  }
  if (!name || !email || !address) {
    res.status(422).send({ message: "Missing fields" });
    return;
  }

  const existingVendorWithEmail = await VendorModel.findOne({
    email,
    _id: { $ne: id },
  });
  if (existingVendorWithEmail) {
    res.status(422).send({ email: "Email already taken" });
    return;
  }
  try {
    await VendorModel.findByIdAndUpdate(
      id,
      { name, email, address, rating },
      { new: true, runValidators: true }
    );
    res.status(200).send({ message: "Vendor updated!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Something went wrong!" });
  }
}

// DELETE /vendors/:id
export async function deleteVendor(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    res.status(404).send({ message: "Vendor not found!" });
    return;
  }

  await VendorProductModel.deleteMany({ vendorId: id });
  await VendorModel.findByIdAndDelete(id);

  res.status(200).send({ message: "Vendor deleted successfully" });
}

// POST /vendors/bulk-upload
export async function bulkInsertOrUpdate(req: Request, res: Response) {
  const { vendors } = req.body;

  if (!vendors || !Array.isArray(vendors) || vendors.length === 0) {
    res.status(422).send({ message: "Missing or invalid vendor data" });
    return;
  }

  const existingEmails = await VendorModel.find({
    email: { $in: vendors.map((v) => v.email) },
  }).distinct("email");

  if (existingEmails.length > 0) {
    res.status(422).send({
      message: "Some emails are already taken",
      existingEmails,
    });
    return;
  }

  const savedVendors = await VendorModel.insertMany(vendors);
  res.status(201).send({ message: "Vendors created", vendors: savedVendors });
}
