import request from "supertest";
import app from "../../app";

it("GET / should read JSON file and return data", async () => {
  const response = await request(app).get("/api/v1/delivery-slots");

  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});
