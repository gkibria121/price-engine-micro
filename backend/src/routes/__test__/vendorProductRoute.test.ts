import request from "supertest";
import app from "../../app";
describe("Test vendors api", () => {
  it.todo("Should return empty vendor list");
  it.todo("Should return vendor list");
});

describe("Test create vendor api", () => {
  it.todo("Should return 422 for missing vendor name");
  it.todo("Should return 422 for missing vendor email");
  it.todo("Should return 422 for duplicate vendor email");
  it.todo("Should return 422 for missing vendor address");
  it.todo("Should return 422 for missing  vendor rating");
  it.todo("Should return 422 for missing vendor name, email,address,rating");
  it.todo("Should create vendor");
});

describe("Test delete vendor api", () => {
  it.todo("Should return 404 if vendor not found");
  it.todo("Should delete vendor");
  it.todo("Should delete vendor products");
});

describe("Test update vendor api", () => {
  it.todo("Should return 404 if vendor not found");
  it.todo("Should return 422 for missing vendor name");
  it.todo("Should return 422 for missing vendor email");
  it.todo("Should return 422 for duplicate vendor email");
  it.todo("Should return 422 for missing vendor address");
  it.todo("Should return 422 for missing  vendor rating");
  it.todo("Should return 422 for missing vendor name, email,address,rating");
  it.todo("Should update vendor");
});

describe("Test bulk upload vendor api", () => {
  it.todo("Should return 422 for missing vendors");
  it.todo("Should return 422 for  missing any vendor name");
  it.todo("Should return 422 for missing any vendor email");
  it.todo("Should return 422 for missing  any vendor address");
  it.todo("Should return 422 for missing any vendor rating");
  it.todo(
    "Should return 422 for missing any vendor name, email,address,rating"
  );
  it.todo("Should create or update vendor");
});
