import request from "supertest";
import app from "../../app";
import VendorModel from "../../models/VendorModel";
import ProductModel from "../../models/ProductModel";
import VendorProductModel from "../../models/VendorProductModel";

// Helper Functions
async function createVendor() {
  return VendorModel.create({
    name: "Test Vendor",
    email: "vendor@example.com",
    address: "demo address",
    rating: 10,
  });
}

async function createProduct() {
  return ProductModel.create({ name: "Test Product" });
}

// Test Suite
describe("Vendor Product Controller", () => {
  // --- FETCH ---
  describe("Fetch Vendor Products", () => {
    it("should fetch all vendor products", async () => {
      const res = await request(app).get("/api/v1/vendor-products");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("vendorProducts");
    });

    it("should fetch a single vendor product by ID", async () => {
      const vendor = await createVendor();
      const product = await createProduct();
      const vendorProduct = await VendorProductModel.create({
        vendor: vendor._id,
        product: product._id,
      });

      const res = await request(app).get(
        `/api/v1/vendor-products/${vendorProduct._id}`
      );
      expect(res.status).toBe(200);
      expect(res.body.vendorProduct._id).toEqual(vendorProduct._id.toString());
    });

    it("should return 404 if fetching non-existent vendor product", async () => {
      const fakeId = "662fc0a8980a85b6aa88aa88";
      const res = await request(app).get(`/api/v1/vendor-products/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Product not found!");
    });
  });

  // --- CREATE ---
  describe("Create Vendor Product", () => {
    it("should create a new vendor product", async () => {
      const product = await createProduct();
      const vendor = await createVendor();

      const res = await request(app)
        .post("/api/v1/vendor-products/store")
        .send({
          vendorId: vendor._id,
          productId: product._id,
          pricingRules: [{ attribute: "Paper", value: "Glossy", price: 687 }],
          deliverySlots: [
            {
              price: 143,
              cutoffTime: "23:56",
              deliveryTimeStartTime: "14:06",
              label: "express",
              deliveryTimeStartDate: 4,
              deliveryTimeEndDate: 21,
              deliveryTimeEndTime: "05:12",
            },
          ],
          quantityPricings: [{ quantity: 10, price: 100 }],
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("association");
      expect(res.body.association.vendor.id).toEqual(vendor._id.toHexString());
      expect(res.body.association.product.id).toEqual(
        product._id.toHexString()
      );
    });

    it("should not create a vendor product if vendor already has the product", async () => {
      const vendor = await createVendor();
      const product = await createProduct();
      await VendorProductModel.create({
        vendor: vendor._id,
        product: product._id,
      });

      const res = await request(app)
        .post("/api/v1/vendor-products/store")
        .send({
          vendorId: vendor._id,
          productId: product._id,
          pricingRules: [],
          deliverySlots: [],
          quantityPricings: [],
        });

      expect(res.status).toBe(422);
      expect(res.body.message).toBe("The given data was invalid.");
    });

    it("should fail to create a vendor product if vendorId is missing", async () => {
      const product = await createProduct();
      const res = await request(app)
        .post("/api/v1/vendor-products/store")
        .send({
          productId: product._id,
          pricingRules: [],
          deliverySlots: [],
          quantityPricings: [],
        });

      expect(res.status).toBe(422);
      expect(res.body.message).toBe("The given data was invalid.");
    });
  });

  // --- UPDATE ---
  describe("Update Vendor Product", () => {
    it("should update a vendor product", async () => {
      const vendor = await createVendor();
      const product = await createProduct();
      const vendorProduct = await VendorProductModel.create({
        vendor: vendor._id,
        product: product._id,
      });

      const res = await request(app)
        .put(`/api/v1/vendor-products/${vendorProduct._id}`)
        .send({
          pricingRules: [{ attribute: "Paper", value: "Glossy", price: 687 }],
          deliverySlots: [
            {
              price: 143,
              cutoffTime: "23:56",
              deliveryTimeStartTime: "14:06",
              label: "express",
              deliveryTimeStartDate: 4,
              deliveryTimeEndDate: 21,
              deliveryTimeEndTime: "05:12",
            },
          ],
          quantityPricings: [{ quantity: 10, price: 100 }],
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Product updated successfully");
    });

    it("should return 404 if updating non-existent vendor product", async () => {
      const fakeId = "662fc0a8980a85b6aa88aa88";
      const res = await request(app)
        .put(`/api/v1/vendor-products/${fakeId}`)
        .send({
          pricingRules: [{ attribute: "Paper", value: "Glossy", price: 687 }],
          deliverySlots: [
            {
              price: 143,
              cutoffTime: "23:56",
              deliveryTimeStartTime: "14:06",
              label: "express",
              deliveryTimeStartDate: 4,
              deliveryTimeEndDate: 21,
              deliveryTimeEndTime: "05:12",
            },
          ],
          quantityPricings: [{ quantity: 10, price: 100 }],
        });

      expect(res.status).toBe(404);
      console.log(res.body.errors);
      expect(res.body.message).toBe("Vendor Product not found!");
    });
  });

  // --- DELETE ---
  describe("Delete Vendor Product", () => {
    it("should delete a vendor product", async () => {
      const vendor = await createVendor();
      const product = await createProduct();
      const vendorProduct = await VendorProductModel.create({
        vendor: vendor._id,
        product: product._id,
      });

      const res = await request(app).delete(
        `/api/v1/vendor-products/${vendorProduct._id}`
      );
      expect(res.status).toBe(204);
    });

    it("should return 404 if deleting non-existent vendor product", async () => {
      const fakeId = "662fc0a8980a85b6aa88aa88";
      const res = await request(app).delete(
        `/api/v1/vendor-products/${fakeId}`
      );

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Vendor Product not found!");
    });
  });

  // --- BULK UPLOAD ---
  describe("Bulk Upload Vendors", () => {
    it("should bulk insert vendors", async () => {
      const vendors = [
        {
          name: "Vendor A",
          email: "a@example.com",
          address: "address 1",
          rating: 10,
        },
        {
          name: "Vendor B",
          email: "b@example.com",
          address: "address 1",
          rating: 10,
        },
      ];

      const res = await request(app)
        .post("/api/v1/vendor-products/bulk-upload")
        .send({ vendors });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Vendors created");
      expect(res.body.vendors.length).toBe(2);
    });

    it("should reject duplicate vendor emails", async () => {
      await VendorModel.create({
        name: "Vendor Exists",
        email: "exists@example.com",
        address: "address 1",
        rating: 10,
      });

      const res = await request(app)
        .post("/api/v1/vendor-products/bulk-upload")
        .send({
          vendors: [
            {
              name: "Vendor Exists",
              email: "exists@example.com",
              address: "address 1",
              rating: 10,
            },
          ],
        });

      expect(res.status).toBe(422);
      expect(res.body.message).toBe("Some emails are already taken");
    });

    it("should fail bulk upload with missing vendors array", async () => {
      const res = await request(app)
        .post("/api/v1/vendor-products/bulk-upload")
        .send({});
      expect(res.status).toBe(422);
      expect(res.body.message).toBe("Missing or invalid vendor data");
    });

    it("should fail bulk upload if vendors is not an array", async () => {
      const res = await request(app)
        .post("/api/v1/vendor-products/bulk-upload")
        .send({ vendors: "not-an-array" });
      expect(res.status).toBe(422);
      expect(res.body.message).toBe("Missing or invalid vendor data");
    });

    it("should fail bulk upload if vendors array is empty", async () => {
      const res = await request(app)
        .post("/api/v1/vendor-products/bulk-upload")
        .send({ vendors: [] });
      expect(res.status).toBe(422);
      expect(res.body.message).toBe("Missing or invalid vendor data");
    });
  });
});

// --- VALIDATION TESTS SEPARATED ---
describe("Vendor Product Controller - Validation Errors", () => {
  it("should validate and reject missing vendorId", async () => {
    const product = await createProduct();
    const res = await request(app).post("/api/v1/vendor-products/store").send({
      productId: product._id,
      pricingRules: [],
      deliverySlots: [],
      quantityPricings: [],
    });

    expect(res.status).toBe(422);
    expect(res.body.errors.vendorId).toBeDefined();
  });

  it("should validate and reject missing productId", async () => {
    const vendor = await createVendor();
    const res = await request(app).post("/api/v1/vendor-products/store").send({
      vendorId: vendor._id,
      pricingRules: [],
      deliverySlots: [],
      quantityPricings: [],
    });

    expect(res.status).toBe(422);
    expect(res.body.errors.productId).toBeDefined();
  });

  it("should validate and reject missing pricingRules", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const res = await request(app).post("/api/v1/vendor-products/store").send({
      vendorId: vendor._id,
      productId: product._id,
      deliverySlots: [],
      quantityPricings: [],
    });

    expect(res.status).toBe(422);
    expect(res.body.errors.pricingRules).toBeDefined();
  });

  it("should validate and reject missing deliverySlots", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const res = await request(app).post("/api/v1/vendor-products/store").send({
      vendorId: vendor._id,
      productId: product._id,
      pricingRules: [],
      quantityPricings: [],
    });

    expect(res.status).toBe(422);
    expect(res.body.errors.deliverySlots).toBeDefined();
  });

  it("should validate and reject missing quantityPricings", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const res = await request(app).post("/api/v1/vendor-products/store").send({
      vendorId: vendor._id,
      productId: product._id,
      pricingRules: [],
      deliverySlots: [],
    });

    expect(res.status).toBe(422);
    expect(res.body.errors.quantityPricings).toBeDefined();
  });

  it("should validate and reject invalid vendorId (not objectId)", async () => {
    const product = await createProduct();
    const res = await request(app).post("/api/v1/vendor-products/store").send({
      vendorId: "not-an-objectid",
      productId: product._id,
      pricingRules: [],
      deliverySlots: [],
      quantityPricings: [],
    });

    expect(res.status).toBe(422);
    expect(res.body.errors.vendorId).toBeDefined();
  });

  it("should validate and reject invalid productId (not objectId)", async () => {
    const vendor = await createVendor();
    const res = await request(app).post("/api/v1/vendor-products/store").send({
      vendorId: vendor._id,
      productId: "invalid-id",
      pricingRules: [],
      deliverySlots: [],
      quantityPricings: [],
    });

    expect(res.status).toBe(422);
    expect(res.body.errors.productId).toBeDefined();
  });

  it("should reject invalid format inside pricingRules array", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const res = await request(app)
      .post("/api/v1/vendor-products/store")
      .send({
        vendorId: vendor._id,
        productId: product._id,
        pricingRules: [{ attribute: 123, value: "Glossy", price: 100 }],
        deliverySlots: [],
        quantityPricings: [],
      });

    expect(res.status).toBe(422);
    expect(res.body.errors["pricingRules[0].attribute"]).toBeDefined();
  });

  it("should reject invalid format inside deliverySlots array", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const res = await request(app)
      .post("/api/v1/vendor-products/store")
      .send({
        vendorId: vendor._id,
        productId: product._id,
        pricingRules: [],
        deliverySlots: [
          {
            price: "wrong-type",
            cutoffTime: "99:99",
            deliveryTimeStartTime: "14:06",
            label: "express",
            deliveryTimeStartDate: 4,
            deliveryTimeEndDate: 21,
            deliveryTimeEndTime: "05:12",
          },
        ],
        quantityPricings: [],
      });

    expect(res.status).toBe(422);
    expect(res.body.errors["deliverySlots[0].price"]).toBeDefined();
  });

  it("should reject invalid format inside quantityPricings array", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const res = await request(app)
      .post("/api/v1/vendor-products/store")
      .send({
        vendorId: vendor._id,
        productId: product._id,
        pricingRules: [{ attribute: "Paper", value: "Glossy", price: 687 }],
        deliverySlots: [
          {
            price: 143,
            cutoffTime: "23:56",
            deliveryTimeStartTime: "14:06",
            label: "express",
            deliveryTimeStartDate: 4,
            deliveryTimeEndDate: 21,
            deliveryTimeEndTime: "05:12",
          },
        ],
        quantityPricings: [{ quantites: 10, price: 100 }],
      });

    expect(res.status).toBe(422);
    expect(res.body.errors["quantityPricings[0].quantity"]).toBeDefined();
  });
});
