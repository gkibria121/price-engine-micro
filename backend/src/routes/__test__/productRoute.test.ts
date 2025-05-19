// Place these FIRST, before importing the code that uses them
jest.mock("../../events/publishers/product-created-publisher");
jest.mock("../../events/publishers/product-updated-publisher");
jest.mock("../../events/publishers/product-deleted-publisher");
jest.mock("../../lib/jet-stream-client");
import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { createProduct } from "../../helpers/test_helper_functions";
import ProductCreatedPublisher from "../../events/publishers/product-created-publisher";
import ProductDeletedPublisher from "../../events/publishers/product-deleted-publisher";
import ProductUpdatedPublisher from "../../events/publishers/product-updated-publisher";
describe("Test products api", () => {
  it("Should return empty products", async () => {
    const response = await request(app).get("/api/v1/products");
    expect(response.body.products.length).toBe(0);
    expect(response.statusCode).toBe(200);
  });

  it("Should return list of products", async () => {
    await createProduct();
    const response = await request(app).get("/api/v1/products");
    expect(response.body.products.length).toBe(1);
    expect(response.statusCode).toBe(200);
  });
});

describe("Test create product api", () => {
  it("Should return 422 for missing product name", async () => {
    const response = await request(app).post("/api/v1/products");
    expect(response.statusCode).toBe(422);
    const response1 = await request(app).post("/api/v1/products").send({
      name: "",
    });
    expect(response1.statusCode).toBe(422);
  });
  it("Should return 422 for duplicate product name", async () => {
    const response1 = await request(app).post("/api/v1/products").send({
      name: "product 1",
    });
    expect(response1.statusCode).toBe(201);
    const response2 = await request(app).post("/api/v1/products").send({
      name: "product 1",
    });
    expect(response2.statusCode).toBe(422);
  });
  it("Should return 201 with product", async () => {
    const response = await request(app).post("/api/v1/products").send({
      name: "product 1",
    });
    expect(response.statusCode).toBe(201);
  });
});

describe("Test product bulk upload api", () => {
  it("Should return 422 for missing products", async () => {
    const response = await request(app)
      .post("/api/v1/products/bulk-upload")
      .send({});
    expect(response.statusCode).toBe(422);
  });
  it("Should return 422 for empty  products list", async () => {
    const response = await request(app)
      .post("/api/v1/products/bulk-upload")
      .send({ products: [] });
    expect(response.statusCode).toBe(422);
  });
  it("Should return 422 for any duplicate product name in products", async () => {
    const response = await request(app)
      .post("/api/v1/products/bulk-upload")
      .send({ products: [{ name: "product 1" }, { name: "product 1" }] });
    expect(response.statusCode).toBe(422);
  });
  it("Should return 201 with products", async () => {
    const response = await request(app)
      .post("/api/v1/products/bulk-upload")
      .send({ products: [{ name: "product 1" }, { name: "product 2" }] });
    expect(response.statusCode).toBe(201);
  });
  it("Should skip duplicate products", async () => {
    await request(app)
      .post("/api/v1/products/bulk-upload")
      .send({ products: [{ name: "product 1" }] });
    const response = await request(app)
      .post("/api/v1/products/bulk-upload")
      .send({ products: [{ name: "product 1" }, { name: "product 2" }] });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe(
      "Some products were skipped due to previously taken names"
    );
    expect(response.body.products[0].name).toBe("product 2");
  });
});

describe("Test product api", () => {
  it("Should return 404 for invalid product id", async () => {
    const id = new mongoose.mongo.ObjectId();
    const response = await request(app).get("/api/v1/products/" + id);
    expect(response.statusCode).toBe(404);
  });
  it("Should product with id and name", async () => {
    const product = await createProduct();
    const response = await request(app).get("/api/v1/products/" + product._id);
    expect(response.body.name).toBe(product.name);
    expect(response.body.id).toBe(product._id.toHexString());
    expect(response.statusCode).toBe(200);
  });
});

describe("Test product update api", () => {
  it("Should return 404 if product not found", async () => {
    const id = new mongoose.mongo.ObjectId();
    const response = await request(app)
      .put("/api/v1/products/" + id)
      .send({
        name: "Product updated",
      });
    expect(response.statusCode).toBe(404);
  });
  it("Should return 400 for invalid product id", async () => {
    const response = await request(app)
      .put("/api/v1/products/invalid-id")
      .send({
        name: "Product updated",
      });
    expect(response.statusCode).toBe(400);
  });
  it("Should return 422 for missing product name", async () => {
    const product = await createProduct();
    const response = await request(app).put("/api/v1/products/" + product._id);
    expect(response.statusCode).toBe(422);
  });
  it("Should updated product with id and name", async () => {
    const product = await createProduct();
    const response = await request(app)
      .put("/api/v1/products/" + product._id)
      .send({
        name: "Product 2",
      });
    expect(response.statusCode).toBe(203);
    expect(response.body.product.id).toBe(product._id.toHexString());
    expect(response.body.product.name).toBe("Product 2");
  });
});

describe("Test product delete api", () => {
  it("Should return 404 for invalid product id", async () => {
    const id = new mongoose.mongo.ObjectId();
    const response = await request(app).delete("/api/v1/products/" + id);
    expect(response.statusCode).toBe(404);
  });
  it("Should return 204 and  delete product", async () => {
    const product = await createProduct();
    const response = await request(app).delete(
      "/api/v1/products/" + product._id
    );
    expect(response.statusCode).toBe(204);
  });
});

describe("Test event publishing", () => {
  it("Should publish event when product is created", async () => {
    const response = await request(app).post("/api/v1/products").send({
      name: "product 1",
    });
    expect(response.statusCode).toBe(201);
    expect(ProductCreatedPublisher.prototype.publish).toHaveBeenCalled();
  });
  it("Should publish event when products are bulk created", async () => {
    const response = await request(app)
      .post("/api/v1/products/bulk-upload")
      .send({ products: [{ name: "product 1" }, { name: "product 2" }] });
    expect(response.statusCode).toBe(201);
    expect(ProductCreatedPublisher.prototype.publish).toHaveBeenCalledTimes(2);
  });
  it("Should publish event when product is deleted", async () => {
    const product = await createProduct();
    const response = await request(app).delete(
      "/api/v1/products/" + product._id
    );
    expect(response.statusCode).toBe(204);
    expect(ProductDeletedPublisher.prototype.publish).toHaveBeenCalled();
  });
  it("Should publish event when product is updated", async () => {
    const product = await createProduct();
    const response = await request(app)
      .put("/api/v1/products/" + product._id)
      .send({
        name: "Product 2",
      });
    expect(response.statusCode).toBe(203);
    expect(response.body.product.id).toBe(product._id.toHexString());
    expect(response.body.product.name).toBe("Product 2");
    expect(ProductUpdatedPublisher.prototype.publish).toHaveBeenCalled();
    expect(ProductUpdatedPublisher.prototype.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Product 2",
      })
    );
  });
});
