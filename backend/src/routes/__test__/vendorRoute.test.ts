jest.mock("../../events/publishers/vendor-created-publisher");
jest.mock("../../events/publishers/vendor-updated-publisher");
jest.mock("../../events/publishers/vendor-deleted-publisher");
jest.mock("../../lib/nats-client");
import request from "supertest";
import app from "../../app";
import VendorModel from "../../models/VendorModel";
import VendorProductModel from "../../models/VendorProductModel";
import mongoose from "mongoose";
import ProductModel from "../../models/ProductModel";
import VendorCreatedPublisher from "../../events/publishers/vendor-created-publisher";
import VendorUpdatedPublisher from "../../events/publishers/vendor-updated-publisher";
import VendorDeletedPublisher from "../../events/publishers/vendor-deleted-publisher";

beforeEach(async () => {
  await VendorModel.deleteMany({});
  await VendorProductModel.deleteMany({});
});

describe("Test vendors api", () => {
  it("Should return empty vendor list", async () => {
    const res = await request(app).get("/api/v1/vendors");
    expect(res.status).toBe(200);
    expect(res.body.vendors).toEqual([]);
  });

  it("Should return vendor list", async () => {
    await VendorModel.create({
      name: "John",
      email: "john@example.com",
      address: "Street 1",
      rating: 4,
    });
    const res = await request(app).get("/api/v1/vendors");
    expect(res.status).toBe(200);
    expect(res.body.vendors.length).toBe(1);
  });
});

describe("Test create vendor api", () => {
  it("Should return 422 for missing vendor name", async () => {
    const res = await request(app).post("/api/v1/vendors/store").send({
      email: "test@example.com",
      address: "Street",
      rating: 5,
    });
    expect(res.status).toBe(422);
  });

  it("Should return 422 for missing vendor email", async () => {
    const res = await request(app).post("/api/v1/vendors/store").send({
      name: "Vendor",
      address: "Street",
      rating: 5,
    });
    expect(res.status).toBe(422);
  });

  it("Should return 422 for missing vendor address", async () => {
    const res = await request(app).post("/api/v1/vendors/store").send({
      name: "Vendor",
      email: "test@example.com",
      rating: 5,
    });
    expect(res.status).toBe(422);
  });

  it("Should return 422 for duplicate vendor email", async () => {
    await VendorModel.create({
      name: "A",
      email: "dup@example.com",
      address: "Addr",
      rating: 4,
    });
    const res = await request(app).post("/api/v1/vendors/store").send({
      name: "B",
      email: "dup@example.com",
      address: "Other",
      rating: 3,
    });
    expect(res.status).toBe(422);
  });

  it("Should create vendor", async () => {
    const res = await request(app).post("/api/v1/vendors/store").send({
      name: "Vendor",
      email: "new@example.com",
      address: "Street",
      rating: 5,
    });
    expect(res.status).toBe(201);
    expect(res.body.vendor).toHaveProperty("email", "new@example.com");
  });
});

describe("Test delete vendor api", () => {
  it("Should return 404 if vendor not found", async () => {
    const id = new mongoose.mongo.ObjectId();
    const res = await request(app).delete("/api/v1/vendors/" + id);
    expect(res.status).toBe(404);
  });

  it("Should delete vendor and vendor products", async () => {
    const vendor = await VendorModel.create({
      name: "Del",
      email: "del@example.com",
      address: "X",
    });
    const product = await ProductModel.create({
      name: "Del laptop",
    });
    await VendorProductModel.create({
      vendor: vendor._id,
      product: product,
      rating: 3,
    });

    const res = await request(app).delete(`/api/v1/vendors/${vendor._id}`);
    expect(res.status).toBe(200);

    const deletedVendor = await VendorModel.findById(vendor._id);
    expect(deletedVendor).toBeNull();

    const relatedProducts = await VendorProductModel.find({
      vendorId: vendor._id,
    });
    expect(relatedProducts.length).toBe(0);
  });
});

describe("Test update vendor api", () => {
  it("Should return 404 if vendor not found", async () => {
    const id = new mongoose.mongo.ObjectId();
    const res = await request(app)
      .put("/api/v1/vendors/" + id)
      .send({
        name: "Updated",
        email: "email@example.com",
        address: "Street",
        rating: 5,
      });
    expect(res.status).toBe(404);
  });

  it("Should return 422 for missing vendor name", async () => {
    const vendor = await VendorModel.create({
      name: "A",
      email: "a@a.com",
      address: "B",
      rating: 1,
    });
    const res = await request(app).put(`/api/v1/vendors/${vendor._id}`).send({
      email: "new@example.com",
      address: "Street",
      rating: 5,
    });
    expect(res.status).toBe(422);
  });

  it("Should return 422 for duplicate vendor email", async () => {
    await VendorModel.create({
      name: "A",
      email: "dup@e.com",
      address: "X",
      rating: 1,
    });
    const vendor = await VendorModel.create({
      name: "B",
      email: "b@e.com",
      address: "Y",
      rating: 2,
    });

    const res = await request(app).put(`/api/v1/vendors/${vendor._id}`).send({
      name: "Updated",
      email: "dup@e.com",
      address: "Street",
      rating: 5,
    });
    expect(res.status).toBe(422);
  });

  it("Should update vendor", async () => {
    const vendor = await VendorModel.create({
      name: "A",
      email: "old@a.com",
      address: "B",
      rating: 1,
    });
    const res = await request(app).put(`/api/v1/vendors/${vendor._id}`).send({
      name: "Updated",
      email: "updated@a.com",
      address: "Street",
      rating: 5,
    });
    expect(res.status).toBe(200);
    const updated = await VendorModel.findById(vendor._id);
    expect(updated?.name).toBe("Updated");
  });
});

describe("Test bulk upload vendor api", () => {
  it("Should return 422 for missing vendors", async () => {
    const res = await request(app).post("/api/v1/vendors/bulk-store").send({});
    expect(res.status).toBe(422);
  });

  it("Should return 422 for duplicate emails", async () => {
    await VendorModel.create({
      name: "Dup",
      email: "dupe@e.com",
      address: "X",
      rating: 3,
    });

    const res = await request(app)
      .post("/api/v1/vendors/bulk-store")
      .send([{ name: "A", email: "dupe@e.com", address: "B", rating: 5 }]);
    expect(res.status).toBe(422);
  });

  it("Should create vendors", async () => {
    const res = await request(app)
      .post("/api/v1/vendors/bulk-store")
      .send({
        vendors: [
          { name: "A", email: "a@e.com", address: "X", rating: 1 },
          { name: "B", email: "b@e.com", address: "Y", rating: 2 },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.vendors.length).toBe(2);
  });
});

describe("Test vendor events", () => {
  it("Should publish vendor created event", async () => {
    const res = await request(app).post("/api/v1/vendors/store").send({
      name: "Vendor",
      email: "new@example.com",
      address: "Street",
      rating: 5,
    });
    expect(res.status).toBe(201);
    expect(VendorCreatedPublisher.prototype.publish).toHaveBeenCalled();
  });
  it("Should publish vendor created event for bulk", async () => {
    const res = await request(app)
      .post("/api/v1/vendors/bulk-store")
      .send({
        vendors: [
          { name: "A", email: "a@e.com", address: "X", rating: 1 },
          { name: "B", email: "b@e.com", address: "Y", rating: 2 },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.vendors.length).toBe(2);
    expect(VendorCreatedPublisher.prototype.publish).toHaveBeenCalledTimes(2);
  });
  it("Should publish vendor updated event", async () => {
    const vendor = await VendorModel.create({
      name: "A",
      email: "old@a.com",
      address: "B",
      rating: 1,
    });
    const res = await request(app).put(`/api/v1/vendors/${vendor._id}`).send({
      name: "Updated",
      email: "updated@a.com",
      address: "Street",
      rating: 5,
    });
    expect(res.status).toBe(200);
    const updated = await VendorModel.findById(vendor._id);
    expect(updated?.name).toBe("Updated");
    expect(VendorUpdatedPublisher.prototype.publish).toHaveBeenCalled();
  });
  it("Should publish vendor deleted event", async () => {
    const vendor = await VendorModel.create({
      name: "Del",
      email: "del@example.com",
      address: "X",
    });
    const product = await ProductModel.create({
      name: "Del laptop",
    });
    await VendorProductModel.create({
      vendor: vendor._id,
      product: product,
      rating: 3,
    });

    const res = await request(app).delete(`/api/v1/vendors/${vendor._id}`);
    expect(res.status).toBe(200);

    const deletedVendor = await VendorModel.findById(vendor._id);
    expect(deletedVendor).toBeNull();

    const relatedProducts = await VendorProductModel.find({
      vendorId: vendor._id,
    });
    expect(relatedProducts.length).toBe(0);
    expect(VendorDeletedPublisher.prototype.publish).toHaveBeenCalled();
  });
});
