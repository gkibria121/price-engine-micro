import request from "supertest";
import app from "../../app";
import { createVendorProduct } from "../../helpers/test_helper_functions";

describe("Test calculate-price API validations", () => {
  it("should return 404 if the route does not exist", async () => {
    const response = await request(app).post("/api/v1/calculate-price");
    expect(response.statusCode).not.toBe(404);
  });

  it("should return 422 if productId is missing", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 1651524220,
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors.productId).toEqual([
      "productId is required",
      "productId must be a valid MongoID",
    ]);
  });

  it("should return 422 if productId is not a valid MongoID", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: "invalid-id",
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 1651524220,
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors.productId[0]).toBe(
      "productId must be a valid MongoID"
    );
  });

  it("should return 422 if quantity is missing", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
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
      .post("/api/v1/calculate-price")
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
      .post("/api/v1/calculate-price")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 1651524220,
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors["attributes"][0]).toBe(
      "attributes must be a non-empty array"
    );
  });

  it("should return 422 if attribute has no name", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ value: "red" }], // Missing name
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 1651524220,
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors["attributes.0.name"][0]).toBe(
      "Each attribute must have a name"
    );
  });

  it("should return 422 if attribute value is not a string", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: 123 }], // Invalid value type
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 1651524220,
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors["attributes.0.value"][0]).toBe(
      "Attribute value must be a string"
    );
  });

  it("should return 422 if deliveryMethod is missing", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price")
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

  it("should return 422 if deliveryMethod has missing or invalid fields", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "", // Invalid value
          deliveryTimeStartDate: "invalid", // Invalid type
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors["deliveryMethod.label"][0]).toBe(
      "deliveryMethod.label is required"
    );
    expect(
      response.body.errors["deliveryMethod.deliveryTimeStartDate"][0]
    ).toBe("deliveryTimeStartDate must be a number");
  });

  it("should return not return 422 if all inputs are valid", async () => {
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: "60d5f7f5c2a6c914f5e1e4e1", // valid MongoID
        quantity: 5,
        attributes: [{ name: "color", value: "red" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 1651524220,
          deliveryTimeEndDate: 1651527600,
          deliveryTimeEndTime: "2025-04-30T14:00:00Z",
        },
      });
    expect(response.statusCode).not.toBe(422);
    // Further assertions for response content can be added here
  });
});

describe("Test calculate-price API", () => {
  beforeAll(() => {
    // Original UTC date
    const mockDateUTC = new Date("2025-04-27T21:58:00.000Z"); // April 27, 2025, 17:58:00 UTC

    // Adjust the date to UTC+6 by adding 6 hours (6 * 60 * 60 * 1000 ms)
    const mockDateUTCPlus6 = new Date(mockDateUTC.getTime()); // Add 6 hours

    // Mock Date.now() to return the adjusted date's timestamp
    jest
      .spyOn(Date, "now")
      .mockImplementation(() => mockDateUTCPlus6.getTime());
  });
  it("should return the correct price breakdown based on product, quantity, and delivery method", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: vendorProduct.product, // valid MongoID
        quantity: 5,
        attributes: [{ name: "Paper", value: "Glossy" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 4,
          deliveryTimeEndDate: 21,
          deliveryTimeEndTime: "05:12",
        },
      });

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

  it("should return 404 if attributes do not match any vendor's offering", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: vendorProduct.product, // valid MongoID
        quantity: 5,
        attributes: [{ name: "Size", value: "A4" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 4,
          deliveryTimeEndDate: 21,
          deliveryTimeEndTime: "05:12",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vendor not found!");
  });

  it("should return 404 if delivery start date does not match any vendor's delivery range", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: vendorProduct.product, // valid MongoID
        quantity: 5,
        attributes: [{ name: "Paper", value: "Glossy" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 3,
          deliveryTimeEndDate: 21,
          deliveryTimeEndTime: "05:12",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vendor not found!");
  });

  it("should return 404 if delivery end date does not match any vendor's delivery range", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: vendorProduct.product, // valid MongoID
        quantity: 5,
        attributes: [{ name: "Paper", value: "Glossy" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 4,
          deliveryTimeEndDate: 20,
          deliveryTimeEndTime: "05:12",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vendor not found!");
  });

  it("should return 404 if delivery end time does not match vendor's end time time", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: vendorProduct.product, // valid MongoID
        quantity: 5,
        attributes: [{ name: "Paper", value: "Glossy" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 4,
          deliveryTimeEndDate: 21,
          deliveryTimeEndTime: "05:11",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vendor not found!");
  });

  it("should return 404 if additional attributes do not exist for the vendor", async () => {
    const vendorProduct = await createVendorProduct();
    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: vendorProduct.product, // valid MongoID
        quantity: 5,
        attributes: [
          { name: "Paper", value: "Glossy" },
          { name: "Size", value: "A4" },
        ],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 4,
          deliveryTimeEndDate: 21,
          deliveryTimeEndTime: "05:12",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vendor not found!");
  });

  it("should return 404 if the current time exceeds vendor's cutoff time", async () => {
    const vendorProduct = await createVendorProduct();
    // Original UTC date
    const mockDateUTC = new Date("2025-04-27T23:58:00.000Z"); // April 27, 2025, 17:58:00 UTC

    // Adjust the date to UTC+6 by adding 6 hours (6 * 60 * 60 * 1000 ms)
    const mockDateUTCPlus6 = new Date(mockDateUTC.getTime()); // Add 6 hours

    // Mock Date.now() to return the adjusted date's timestamp
    jest
      .spyOn(Date, "now")
      .mockImplementation(() => mockDateUTCPlus6.getTime());

    const response = await request(app)
      .post("/api/v1/calculate-price")
      .send({
        productId: vendorProduct.product, // valid MongoID
        quantity: 5,
        attributes: [{ name: "Paper", value: "Glossy" }],
        deliveryMethod: {
          label: "express",
          deliveryTimeStartDate: 4,
          deliveryTimeEndDate: 21,
          deliveryTimeEndTime: "05:12",
        },
      });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vendor not found!");
  });
});
