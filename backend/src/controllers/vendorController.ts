import { Request, Response } from "express";
import VendorModel from "../models/VendorModel";
import VendorProductModel from "../models/VendorProductModel";
import { NotFoundException } from "../Exceptions/NotFoundException";
import "express-async-errors";
import { CustomValidationException } from "../Exceptions/CustomValidationException";
import { ValidationErrors } from "../Exceptions/ValidationError";
import VendorCreatedPublisher from "../events/publishers/vendor-created-publisher";
import VendorUpdatedPublisher from "../events/publishers/vendor-updated-publisher";
import VendorDeletedPublisher from "../events/publishers/vendor-deleted-publisher";
import { jetStreamWrapper } from "../lib/jet-stream-client";
// GET /vendors
export async function index(req: Request, res: Response) {
  const vendors = await VendorModel.find();
  res.status(200).send({ vendors });
}
// GET /vendor
export async function getVendor(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    throw new NotFoundException("Vendor not found!");
  }
  res.status(200).send({ vendor });
}

// POST /vendors/store
export async function createVendor(req: Request, res: Response) {
  const { name, email, address } = req.body;

  const existingVendor = await VendorModel.findOne({ email });
  if (existingVendor) {
    throw new CustomValidationException("Email is already taken", {
      email: ["Email already taken"],
    });
  }

  const newVendor = await VendorModel.create({ name, email, address });
  const publisher = new VendorCreatedPublisher(jetStreamWrapper.client);
  publisher.publish(newVendor);
  res.status(201).send({ vendor: newVendor });
}

// PUT/PATCH /vendors/:id
export async function updateVendor(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { name, email, address } = req.body;

  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    throw new NotFoundException("Vendor not found!");
  }
  const existingVendorWithEmail = await VendorModel.findOne({
    email,
    _id: { $ne: id },
  });
  if (existingVendorWithEmail) {
    throw new CustomValidationException("Email is already taken", {
      email: ["Email already taken"],
    });
  }

  await VendorModel.findByIdAndUpdate(
    id,
    { name, email, address },
    { new: true, runValidators: true }
  );

  const updatedVendor = await VendorModel.findOne({ _id: id });

  const publisher = new VendorUpdatedPublisher(jetStreamWrapper.client);
  publisher.publish(updatedVendor);

  res.status(200).send({ message: "Vendor updated!" });
}

// DELETE /vendors/:id
export async function deleteVendor(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    throw new NotFoundException("Vendor not found!");
  }

  await VendorProductModel.deleteMany({ vendorId: id });
  await VendorModel.findByIdAndDelete(id);
  const publisher = new VendorDeletedPublisher(jetStreamWrapper.client);
  publisher.publish({ id: id });
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
    const errors = {} as ValidationErrors;
    vendors.map((vendor, index) => {
      if (existingEmails.indexOf(vendor.email) !== -1) {
        errors[`vendors.${index}.email`] = ["Email already taken."];
      }
    });

    throw new CustomValidationException(
      "Some emails are already taken",
      errors
    );
  }

  const savedVendors = await VendorModel.insertMany(vendors);
  const publisher = new VendorCreatedPublisher(jetStreamWrapper.client);
  savedVendors.map((vendor) => {
    publisher.publish(vendor);
  });
  res.status(201).send({ message: "Vendors created", vendors: savedVendors });
}
