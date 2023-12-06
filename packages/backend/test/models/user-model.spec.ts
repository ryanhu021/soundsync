import { User } from "../../src/models/user-model";

describe("User Model", () => {
  it("should create a user with the correct properties", () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      playlists: ["111111111111111111111111", "111111111111111111111112"],
    });

    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("johndoe@example.com");
    expect(user.password).toBe("password123");
    expect(user.playlists.at(0)?.toString()).toBe("111111111111111111111111");
    expect(user.playlists.at(1)?.toString()).toBe("111111111111111111111112");
  });

  it("should require name, email, and password", () => {
    const user = new User({});

    const validationError = user.validateSync();
    expect(validationError?.errors.name).toBeDefined();
    expect(validationError?.errors.email).toBeDefined();
    expect(validationError?.errors.password).toBeDefined();
  });
});
