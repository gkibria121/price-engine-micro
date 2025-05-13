import request from "supertest";
import app from "../../app";
import {
  createProduct,
  createVendor,
  createVendorProduct,
} from "../../helpers/test_helper_functions";

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
  console.log(response.body);
  expect(response.status).toBe(200);
});
