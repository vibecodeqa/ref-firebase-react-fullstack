import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-vcqa-ref-firebase",
    firestore: {
      rules: readFileSync(resolve("../firestore.rules"), "utf8")
    }
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv?.cleanup();
});

describe("Firestore project rules", () => {
  it("allows an owner to create and read their project", async () => {
    const db = testEnv.authenticatedContext("user-a").firestore();
    const ref = db.collection("projects").doc("project-a");

    await assertSucceeds(
      ref.set({
        name: "Launch checklist",
        ownerUid: "user-a",
        status: "active",
        createdAt: "2026-07-24T00:00:00.000Z",
        updatedAt: "2026-07-24T00:00:00.000Z"
      })
    );

    await assertSucceeds(ref.get());
  });

  it("denies cross-user project reads", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection("projects").doc("project-a").set({
        name: "Launch checklist",
        ownerUid: "user-a",
        status: "active",
        createdAt: "2026-07-24T00:00:00.000Z",
        updatedAt: "2026-07-24T00:00:00.000Z"
      });
    });

    const db = testEnv.authenticatedContext("user-b").firestore();
    await assertFails(db.collection("projects").doc("project-a").get());
  });

  it("denies unauthenticated writes", async () => {
    const db = testEnv.unauthenticatedContext().firestore();

    await assertFails(
      db.collection("projects").doc("project-a").set({
        name: "Launch checklist",
        ownerUid: "user-a",
        status: "active",
        createdAt: "2026-07-24T00:00:00.000Z",
        updatedAt: "2026-07-24T00:00:00.000Z"
      })
    );
  });
});
