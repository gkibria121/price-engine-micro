import request from "supertest";
import app from "../../app";
describe("Test calculate-price api", () => {
  it("Should not return  404", async () => {
    const response = await request(app).post("/api/v1/calculate-price");

    expect(response.statusCode).not.toBe(404);
  });
});
