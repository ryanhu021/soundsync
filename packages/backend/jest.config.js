/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ["src/models/*.ts", "src/services/*.ts"],
  transformIgnorePatterns: ["node_modules/*"],
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.env.js"],
};
