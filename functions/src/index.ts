import { CreateProjectSchema, type Project, isoNow } from "@vcqa-ref/shared";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { HttpError, problemFor, requireUid, statusFor } from "./http.js";

initializeApp();

const db = getFirestore();

export const api = onRequest(
  {
    region: "us-central1",
    cors: [/^http:\/\/localhost:\d+$/]
  },
  async (request, response) => {
    try {
      response.set("Cache-Control", "no-store");

      if (request.path === "/api/health" && request.method === "GET") {
        response.status(200).json({ ok: true });
        return;
      }

      if (request.path === "/api/projects" && request.method === "GET") {
        const uid = await requireUid(request);
        const snapshot = await db
          .collection("projects")
          .where("ownerUid", "==", uid)
          .orderBy("updatedAt", "desc")
          .limit(20)
          .get();

        const projects = snapshot.docs.map((doc) => toProject(doc.id, doc.data()));
        response.status(200).json({ projects });
        return;
      }

      if (request.path === "/api/projects" && request.method === "POST") {
        const uid = await requireUid(request);
        const input = CreateProjectSchema.parse(request.body);
        const now = isoNow();

        const ref = await db.collection("projects").add({
          name: input.name,
          ownerUid: uid,
          status: "active",
          createdAt: now,
          updatedAt: now,
          serverCreatedAt: FieldValue.serverTimestamp()
        });

        response.status(201).json({
          id: ref.id,
          name: input.name,
          ownerUid: uid,
          status: "active",
          createdAt: now,
          updatedAt: now
        });
        return;
      }

      throw new HttpError(404, "not_found", "Route not found");
    } catch (error) {
      logger.warn("api request failed", {
        path: request.path,
        method: request.method,
        error
      });
      response.status(statusFor(error)).json(problemFor(error));
    }
  }
);

function toProject(id: string, data: FirebaseFirestore.DocumentData): Project {
  return {
    id,
    name: String(data.name),
    ownerUid: String(data.ownerUid),
    status: data.status === "archived" ? "archived" : "active",
    createdAt: String(data.createdAt),
    updatedAt: String(data.updatedAt)
  };
}

