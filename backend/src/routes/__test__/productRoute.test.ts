import request from "supertest";
import app from "../../app";
it("Should empty products", async () => {
  const response = await request(app).get("/api/v1/products");
  expect(response.body.products.length).toBe(0);
  expect(response.statusCode).toBe(200);
});
