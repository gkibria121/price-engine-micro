import request from "supertest";
import app from "../../app";
import {
  createProduct,
  createVendor,
  createVendorProduct,
} from "../../helpers/test_helper_functions";
import mongoose from "mongoose";

it("GET / should read JSON file and return data", async () => {
  const response = await request(app).get("/api/v1/delivery-slots");

  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

it("GET / should return delivery slots for a product id", async () => {
  const vendorProduct = await createVendorProduct();

  const response = await request(app).get(
    "/api/v1/delivery-slots/" + vendorProduct.product
  );
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0]._id).toBeDefined();
});
it("GET / should return  no delivery  slots for non existing product id", async () => {
  const response = await request(app).get(
    "/api/v1/delivery-slots/" + new mongoose.mongo.ObjectId()
  );
  expect(response.status).toBe(404);
});
