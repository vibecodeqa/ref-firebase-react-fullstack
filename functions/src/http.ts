import type { Problem } from "@vcqa-ref/shared";
import { problem } from "@vcqa-ref/shared";
import { getAuth } from "firebase-admin/auth";
import type { Request } from "firebase-functions/v2/https";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export function problemFor(error: unknown): Problem {
  if (error instanceof HttpError) {
    return problem(error.code, error.message);
  }

  return problem("internal", "Unexpected server error");
}

export function statusFor(error: unknown): number {
  return error instanceof HttpError ? error.status : 500;
}

export async function requireUid(request: Request): Promise<string> {
  const emulatorUid = request.header("x-vcqa-user");

  if (process.env.FUNCTIONS_EMULATOR === "true" && emulatorUid) {
    return emulatorUid;
  }

  const authorization = request.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(401, "unauthenticated", "A Firebase ID token is required");
  }

  const token = authorization.slice("Bearer ".length);
  const decoded = await getAuth().verifyIdToken(token);
  return decoded.uid;
}

