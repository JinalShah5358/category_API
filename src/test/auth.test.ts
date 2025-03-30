import request from "supertest";
import { app } from "../index";
import User from "../db/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

tjest.mock("../db/user");

describe("Auth API Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** REGISTER TESTS **/
  it("should register a new user", async () => {
    User.findOne.mockResolvedValueOnce(null);
    jest.spyOn(User.prototype, "save").mockResolvedValueOnce({ _id: "123" });
    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedpassword123");

    const res = await request(app).post("/api/auth/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123"
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should not register a user if email already exists", async () => {
    User.findOne.mockResolvedValueOnce({ _id: "123" });

    const res = await request(app).post("/api/auth/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  /** LOGIN TESTS **/
  it("should login successfully with correct credentials", async () => {
    const mockUser = {
      _id: "123",
      email: "johndoe@example.com",
      password: "hashedpassword123"
    };
    User.findOne.mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);
    jest.spyOn(jwt, "sign").mockReturnValue("mocked_jwt_token");

    const res = await request(app).post("/api/auth/login").send({
      email: "johndoe@example.com",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBe("mocked_jwt_token");
  });

  it("should return an error for invalid email", async () => {
    User.findOne.mockResolvedValueOnce(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "wrongemail@example.com",
      password: "password123"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should return an error for invalid password", async () => {
    const mockUser = {
      _id: "123",
      email: "johndoe@example.com",
      password: "hashedpassword123"
    };
    User.findOne.mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);

    const res = await request(app).post("/api/auth/login").send({
      email: "johndoe@example.com",
      password: "wrongpassword"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should return a server error on unexpected failure", async () => {
    User.findOne.mockRejectedValueOnce(new Error("Database error"));

    const res = await request(app).post("/api/auth/login").send({
      email: "johndoe@example.com",
      password: "password123"
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error");
  });
});
