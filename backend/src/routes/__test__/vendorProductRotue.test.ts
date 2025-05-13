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
      expect(res.body.vendorProduct.id).toEqual(vendorProduct._id.toString());
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
          rating: 10,
          quantityPricings: [{ quantity: 10, price: 100 }],
          pricingRuleMetas: [
            {
              attribute: "Paper",
              default: 0,
              values: ["Glossy"],
              inputType: "radio",
              required: false,
              description: "",
              hasOther: false,
            },
          ],
        });
      const newVendorProduct = await VendorProductModel.findOne();
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("association");
      expect(res.body.association.vendor.id).toEqual(vendor._id.toHexString());
      expect(res.body.association.product.id).toEqual(
        product._id.toHexString()
      );

      expect(res.body.association.pricingRules[0]._id).toBe(
        newVendorProduct.pricingRules[0]._id.toHexString()
      );
      expect(res.body.association.deliverySlots[0]._id).toBe(
        newVendorProduct.deliverySlots[0]._id.toHexString()
      );
      expect(res.body.association.quantityPricings[0]._id).toBe(
        newVendorProduct.quantityPricings[0]._id.toHexString()
      );
      expect(res.body.association.pricingRuleMetas[0].id).toBe(
        newVendorProduct.pricingRuleMetas[0]._id.toHexString()
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
          rating: 10,
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
          pricingRuleMetas: [
            {
              attribute: "Paper",
              default: 0,
              values: ["Glossy"],
              inputType: "radio",
              required: false,
              description: "",
              hasOther: false,
            },
          ],
        });
      const updatedVendorProduct = await VendorProductModel.findOne()
        .populate("pricingRules")
        .populate("deliverySlots")
        .populate("quantityPricings")
        .populate("pricingRuleMetas");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Product updated successfully");
      expect(res.body.vendorProduct.id).toBe(
        updatedVendorProduct._id.toHexString()
      );

      expect(res.body.vendorProduct.pricingRules[0]._id).toBe(
        updatedVendorProduct.pricingRules[0]._id.toHexString()
      );
      expect(res.body.vendorProduct.deliverySlots[0]._id).toBe(
        updatedVendorProduct.deliverySlots[0]._id.toHexString()
      );
      expect(res.body.vendorProduct.quantityPricings[0]._id).toBe(
        updatedVendorProduct.quantityPricings[0]._id.toHexString()
      );
      expect(res.body.vendorProduct.pricingRuleMetas[0].id).toBe(
        updatedVendorProduct.pricingRuleMetas[0]._id.toHexString()
      );
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
          rating: 10,
        });

      expect(res.status).toBe(404);
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
    expect(res.body.errors["pricingRules.0.attribute"]).toBeDefined();
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
    expect(res.body.errors["deliverySlots.0.price"]).toBeDefined();
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
    expect(res.body.errors["quantityPricings.0.quantity"]).toBeDefined();
  });
});
describe("Vendor Product Controller - Bulk Insert or Update", () => {
  it("Should create vendor Product", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const response = await request(app)
      .post("/api/v1/vendor-products/bulk-store")
      .send({
        vendorProducts: [
          {
            vendorId: vendor._id,
            productId: product._id,
            rating: 10,
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
            pricingRuleMetas: [
              {
                attribute: "Paper",
                default: 0,
                values: ["Glossy"],
                inputType: "radio",
                required: false,
                description: "",
                hasOther: false,
              },
            ],
          },
        ],
      });
    expect(response.body.vendorProducts[0].product).toBe(
      product._id.toHexString()
    );
    expect(response.body.vendorProducts[0].pricingRules[0]).toBeDefined();
    expect(response.body.vendorProducts[0].deliverySlots[0]).toBeDefined();
    expect(response.body.vendorProducts[0].pricingRuleMetas[0]).toBeDefined();
    expect(response.status).toBe(201);
  });
  it("Should return 422 for empty pricingRules deliverySlots, quantityPricings", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const response = await request(app)
      .post("/api/v1/vendor-products/bulk-store")
      .send({
        vendorProducts: [
          {
            vendorId: vendor._id,
            productId: product._id,
            pricingRules: [],
            deliverySlots: [],
            quantityPricings: [],
          },
        ],
      });
    expect(response.body).toEqual({
      message: "The given data was invalid.",
      errors: {
        "vendorProducts.0.pricingRules": [
          "At least one pricing rule is required",
        ],
        "vendorProducts.0.deliverySlots": [
          "At least one delivery slot is required",
        ],
        "vendorProducts.0.quantityPricings": [
          "At least one quantity pricing is required",
        ],
        "vendorProducts.0.rating": ["Rating is required"],
      },
    });
    expect(response.status).toBe(422);
  });

  it("Should return 422 for invalid pricingRules deliverySlots, quantityPricings, pricingRuleMetas", async () => {
    const vendor = await createVendor();
    const product = await createProduct();
    const response = await request(app)
      .post("/api/v1/vendor-products/bulk-store")
      .send({
        vendorProducts: [
          {
            vendorId: vendor._id.toHexString(),
            productId: product._id.toHexString(),
            pricingRules: [{}],
            deliverySlots: [{}],
            quantityPricings: [{}],
            pricingRuleMetas: [{}],
          },
        ],
      });

    expect(response.body).toEqual({
      message: "The given data was invalid.",
      errors: {
        "vendorProducts.0.pricingRules.0.attribute": ["Attribute is required"],
        "vendorProducts.0.pricingRules.0.value": ["Value is required"],
        "vendorProducts.0.pricingRules.0.price": ["Invalid input"],
        "vendorProducts.0.deliverySlots.0.label": ["Label is required"],
        "vendorProducts.0.deliverySlots.0.price": ["Price is required"],
        "vendorProducts.0.deliverySlots.0.deliveryTimeStartDate": [
          "Start date is required",
        ],
        "vendorProducts.0.deliverySlots.0.deliveryTimeStartTime": [
          "Start time is required",
        ],
        "vendorProducts.0.deliverySlots.0.deliveryTimeEndDate": [
          "End date is required",
        ],
        "vendorProducts.0.deliverySlots.0.deliveryTimeEndTime": [
          "End time is required",
        ],
        "vendorProducts.0.deliverySlots.0.cutoffTime": [
          "Cutoff time is required",
        ],
        "vendorProducts.0.quantityPricings.0.quantity": [
          "Quantity is required",
        ],
        "vendorProducts.0.rating": ["Rating is required"],
        "vendorProducts.0.quantityPricings.0.price": ["Price is required"],

        "vendorProducts.0.pricingRuleMetas.0.attribute": [
          "Attribute name is required",
        ],
        "vendorProducts.0.pricingRuleMetas.0.default": [
          "Default value is required.",
        ],
        "vendorProducts.0.pricingRuleMetas.0.inputType": [
          "Input type is required.",
        ],
        "vendorProducts.0.pricingRuleMetas.0.values": ["Required"],
      },
    });
    expect(response.status).toBe(422);
  });
});
