import request from "supertest";
import app from "../../app";
import { createVendorProduct } from "../../helpers/test_helper_functions";

describe("Test calculate-price API validations", () => {
  it("should return 404 if the route does not exist", async () => {
    const response = await request(app).post(
      "/api/v1/calculate-price-with-vendor"
    );
    expect(response.statusCode).not.toBe(404);
  });

  it("should return 422 if productId is missing", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        vendorId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors.productId).toEqual([
      "productId is required",
      "productId must be a valid MongoID",
    ]);
  });
  it("should return 422 if vendorId is missing", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors.vendorId).toEqual([
      "vendorId is required",
      "vendorId must be a valid MongoID",
    ]);
  });

  it("should return 422 if productId is not a valid MongoID", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: "invalid-id",
        vendorId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors.productId[0]).toBe(
      "productId must be a valid MongoID"
    );
  });

  it("should return 422 if quantity is missing", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        vendorId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 1651524220,
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors["quantity"][0]).toBe("quantity is required");
  });

  it("should return 422 if quantity is not a number", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: "five",
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 1651524220,
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors["quantity"][0]).toBe(
      "quantity must be a number"
    );
  });

  it("should return 422 if attributes is not a non-empty array", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [],
        deliveryMethod: {
          label: "express",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors["attributes"][0]).toBe(
      "attributes must be a non-empty array"
    );
  });

  it("should return 422 if deliveryMethod is missing", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors.deliveryMethod[0]).toBe(
      "deliveryMethod is required"
    );
  });
  it("should return 422 if deliveryMethod.label is missing", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {},
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors["deliveryMethod.label"][0]).toBe(
      "deliveryMethod.label is required"
    );
  });
  it("should return not return 422 if all inputs are valid", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        vendorId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
        },
      });
    expect(response.statusCode).not.toBe(422);
    // Further assertions for response content can be added here
  });
});

describe("Test calculate-price API", () => {
  it("should return the correct price breakdown based on product, quantity, and delivery method", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: vendorProduct.product, // valid MongoID
        vendorId: vendorProduct.vendor, // valid MongoID
        quantity: 5,
        attributes: [{ name: "Paper", value: "Glossy" }],
        deliveryMethod: {
          label: "express",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      productName: "Product 1",
      quantity: 5,
      totalPrice: 547.32125,
      breakdown: {
        basePrice: 51.375,
        attributeCost: 352.94625,
        deliveryCharge: 143,
      },
    });
  });
  it("should return  404 if delivery method does not match with vendors", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: vendorProduct.product, // valid MongoID
        vendorId: vendorProduct.vendor, // valid MongoID
        quantity: 5,
        attributes: [{ name: "Paper", value: "Glossy" }],
        deliveryMethod: {
          label: "standard",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Delivery method not found!");
  });

  it("should return  404 if attributes does not match with vendors", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price-with-vendor")
      .send({
        productId: vendorProduct.product, // valid MongoID
        vendorId: vendorProduct.vendor, // valid MongoID
        quantity: 15,
        attributes: [{ name: "Paper1", value: "Glossy" }],
        deliveryMethod: {
          label: "express",
        },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Unable to calculate price. Attribute "Paper1" or Attribute value "Glossy" does not exist for this product.'
    );
  });
});
