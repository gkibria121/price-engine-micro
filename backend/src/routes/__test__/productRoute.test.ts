import request from "supertest";
import app from "../../app";
describe("Test products api", () => {
  it("Should return empty products", async () => {
    const response = await request(app).get("/api/v1/products");
    expect(response.body.products.length).toBe(0);
    expect(response.statusCode).toBe(200);
  });
  it.todo("Should return list of products");
});

describe("Test create product api", () => {
  it.todo("Should return 422 for missing product name");
  it.todo("Should return 422 for duplicate product name");
  it.todo("Should return 201 with product");
});

describe("Test product bulk upload api", () => {
  it.todo("Should return 422 for missing products");
  it.todo("Should return 422 for empty  products list");
  it.todo("Should return 422 for any duplicate product name in products");
  it.todo("Should return 201 with products");
});

describe("Test product api", () => {
  it.todo("Should return 404 for invalid product id");
  it.todo("Should product with id and name");
});

describe("Test product update api", () => {
  it.todo("Should return 404 for invalid product id");
  it.todo("Should return 422 for missing product name");
  it.todo("Should updated product with id and name");
});

describe("Test product delete api", () => {
  it.todo("Should return 404 for invalid product id");
  it.todo("Should return 204 and  delete product");
});
