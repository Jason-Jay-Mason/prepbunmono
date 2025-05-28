import { describe, it, expect } from "vitest";
import { jwt } from "./jwt";
import { Claims } from "./types";

const mockSecret = "secret";

const mockClaims: Claims = {
  userAgent: "Mozilla/5.0",
  uid: "oi32hjrof23",
  withCreds: true,
};

describe("create and validate jwt", () => {
  let mockToken = "";
  it("should create a jwt", () => {
    const res = jwt.generate(mockSecret, mockClaims);
    if (res.isErr()) {
      expect.fail();
    }
    if (typeof res.value !== "string") expect.fail();
    mockToken = res.value;
  });

  it("should throw error if bad claims", () => {
    //@ts-ignore
    const res = jwt.generate(mockSecret, { blob: "bad claims" });
    if (res.isErr()) {
      switch (res.error.type) {
        case "Invalid claims object":
          return;
        case "Invalid secret":
          expect.fail();
        default:
          expect.fail();
      }
    }
    expect.fail();
  });

  it("should throw error if bad secret", () => {
    //@ts-ignore
    const res = jwt.generate(123120, mockClaims);
    if (res.isErr()) {
      switch (res.error.type) {
        case "Invalid claims object":
          expect.fail();
        case "Invalid secret":
          return;
        default:
          expect.fail();
      }
    }
    expect.fail();
  });

  it("should parse the token with right secret", () => {
    const res = jwt.parse(mockToken, mockSecret);
    if (res.isErr()) {
      expect.fail();
    }
    expect(res.value).toBeTruthy();
  });

  it("should fail with wrong secret", () => {
    const res = jwt.parse(mockToken, "bad secret");
    if (res.isErr()) {
      expect(res).toBeTruthy();
      switch (res.error.type) {
        case "Invalid JWT signature":
          return;
        case "JWT malformed":
          expect.fail();
        case "Unknown JWT parse error":
          expect.fail();
      }
    }
  });

  it("should fail with spoofed token", () => {
    const res = jwt.parse("aelkfhja3098frf", mockSecret);
    if (res.isErr()) {
      expect(res).toBeTruthy();
      switch (res.error.type) {
        case "Invalid JWT signature":
          expect.fail();
        case "JWT malformed":
          return;
        case "Unknown JWT parse error":
          expect.fail();
      }
    }
  });
});
