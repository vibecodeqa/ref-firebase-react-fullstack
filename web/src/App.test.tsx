import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders project data returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          projects: [
            {
              id: "project-a",
              name: "Launch checklist",
              ownerUid: "demo-user",
              status: "active",
              createdAt: "2026-07-24T00:00:00.000Z",
              updatedAt: "2026-07-24T00:00:00.000Z"
            }
          ]
        })
      }))
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Launch checklist")).toBeInTheDocument();
    });
  });

  it("shows API failures without exposing internals", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500
      }))
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("API failed with 500");
    });
  });
});

