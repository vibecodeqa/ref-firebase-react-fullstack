import { describe, expect, it } from "vitest";
import { CreateProjectSchema, ProjectSchema, problem } from "./index.js";

describe("shared contracts", () => {
  it("accepts valid project creation input", () => {
    expect(CreateProjectSchema.parse({ name: "Launch checklist" })).toEqual({
      name: "Launch checklist"
    });
  });

  it("rejects weak project names", () => {
    expect(() => CreateProjectSchema.parse({ name: "x" })).toThrow();
  });

  it("keeps API problem responses structured", () => {
    expect(problem("unauthenticated", "Sign in first")).toEqual({
      error: {
        code: "unauthenticated",
        message: "Sign in first"
      }
    });
  });

  it("requires ISO timestamps on project output", () => {
    expect(() =>
      ProjectSchema.parse({
        id: "project-a",
        name: "Launch checklist",
        ownerUid: "user-a",
        status: "active",
        createdAt: "not-a-date",
        updatedAt: "2026-07-24T00:00:00.000Z"
      })
    ).toThrow();
  });
});

