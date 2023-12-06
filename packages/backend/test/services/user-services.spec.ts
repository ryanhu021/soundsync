import bcrypt from "bcrypt";
import cookie from "cookie";
import { User } from "../../src/models/user-model";
import { register, login, logout } from "../../src/services/user-services";

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
}));
jest.mock("cookie", () => ({
  serialize: jest.fn().mockReturnValue("serializedToken"),
}));
jest.mock("../../src/util/auth", () => ({
  generateToken: jest.fn().mockResolvedValue("serializedToken"),
}));
jest.mock("../../src/models/user-model");

const MOCK_USER_ID = "user123";
const MOCK_NAME = "John Doe";
const MOCK_EMAIL = "johndoe@example.com";
const MOCK_PASSWORD = "password123";
const MOCK_HASHED_PASSWORD = "hashedPassword";
const MOCK_SERIALIZED_TOKEN = "serializedToken";
const MOCK_USER = {
  _id: MOCK_USER_ID,
  name: MOCK_NAME,
  email: MOCK_EMAIL,
  password: MOCK_HASHED_PASSWORD,
  playlists: [],
};

describe("User Services", () => {
  beforeAll(() => {
    User.prototype.save = jest.fn().mockResolvedValue({
      _id: "user123",
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashedPassword",
      playlists: [],
    });
  });

  describe("register", () => {
    it("should register a new user and return a serialized token", async () => {
      User.find = jest.fn().mockResolvedValue([]);
      const result = await register(MOCK_NAME, MOCK_EMAIL, MOCK_PASSWORD);

      expect(bcrypt.hash).toHaveBeenCalledWith(MOCK_PASSWORD, 10);
      expect(User.prototype.save).toHaveBeenCalledTimes(1);
      expect(result).toBe(MOCK_SERIALIZED_TOKEN);
    });

    it("should reject registration if user already exists", async () => {
      User.find = jest.fn().mockResolvedValue([MOCK_USER]);
      await expect(
        register(MOCK_NAME, MOCK_EMAIL, MOCK_PASSWORD)
      ).rejects.toEqual("User already exists");

      expect(User.find).toHaveBeenCalledWith({ email: MOCK_EMAIL });
    });
  });

  describe("login", () => {
    it("should login a user and return a serialized token", async () => {
      process.env.NODE_ENV = "production";
      User.findOne = jest.fn().mockResolvedValue(MOCK_USER);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const result = await login(MOCK_EMAIL, MOCK_PASSWORD);

      expect(User.findOne).toHaveBeenCalledWith({ email: MOCK_EMAIL });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        MOCK_PASSWORD,
        MOCK_HASHED_PASSWORD
      );
      expect(result).toBe(MOCK_SERIALIZED_TOKEN);
    });

    it("should reject login if email is invalid", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      await expect(login(MOCK_EMAIL, MOCK_PASSWORD)).rejects.toEqual(
        "Invalid email or password"
      );

      expect(User.findOne).toHaveBeenCalledWith({ email: MOCK_EMAIL });
    });

    it("should reject login if password is invalid", async () => {
      User.findOne = jest.fn().mockResolvedValue(MOCK_USER);
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      await expect(login(MOCK_EMAIL, MOCK_PASSWORD)).rejects.toEqual(
        "Invalid email or password"
      );

      expect(User.findOne).toHaveBeenCalledWith({ email: MOCK_EMAIL });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        MOCK_PASSWORD,
        MOCK_HASHED_PASSWORD
      );
    });
  });

  describe("logout", () => {
    it("should logout a user and return an empty serialized token", async () => {
      cookie.serialize = jest.fn().mockReturnValue("");
      const result = await logout();

      expect(result).toBe("");
    });
  });
});
