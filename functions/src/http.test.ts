import { describe, expect, it } from "vitest";
import { HttpError, problemFor, statusFor } from "./http.js";

describe("http helpers", () => {
  it("maps expected errors to public problems", () => {
    const error = new HttpError(401, "unauthenticated", "A Firebase ID token is required");

    expect(statusFor(error)).toBe(401);
    expect(problemFor(error)).toEqual({
      error: {
        code: "unauthenticated",
        message: "A Firebase ID token is required"
      }
    });
  });

  it("does not leak unexpected error details", () => {
    expect(statusFor(new Error("database password leaked"))).toBe(500);
    expect(problemFor(new Error("database password leaked"))).toEqual({
      error: {
        code: "internal",
        message: "Unexpected server error"
      }
    });
  });
});

