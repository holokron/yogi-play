import { randomUUID } from "node:crypto";
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { buildDownloadUrl } from "./sound.ts";
import type { DbShape } from "./types.ts";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/**
 * Initialises firebase-admin from FIREBASE_SERVICE_ACCOUNT (JSON string) or,
 * failing that, GOOGLE_APPLICATION_CREDENTIALS.
 */
export function initAdmin(): void {
  if (getApps().length > 0) return;
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS",
    );
  }
  initializeApp({
    credential: serviceAccount
      ? cert(JSON.parse(serviceAccount))
      : applicationDefault(),
    storageBucket: requireEnv("VITE_APP_FIREBASE_STORAGE_BUCKET"),
    databaseURL: requireEnv("VITE_APP_FIREBASE_DATABASE_URL"),
  });
}

/** Uploads to sounds/<sha256>.mp3 (skipped when it already exists) and returns its download URL. */
export async function uploadSound(
  bytes: Uint8Array,
  sha256: string,
  withToken: boolean,
): Promise<string> {
  const bucket = getStorage().bucket();
  const objectName = `sounds/${sha256}.mp3`;
  const file = bucket.file(objectName);
  const [exists] = await file.exists();

  let token: string | undefined;
  if (exists) {
    const [metadata] = await file.getMetadata();
    const tokens = metadata.metadata?.firebaseStorageDownloadTokens;
    token = typeof tokens === "string" ? tokens.split(",")[0] : undefined;
    if (withToken && !token) {
      token = randomUUID();
      await file.setMetadata({
        metadata: { firebaseStorageDownloadTokens: token },
      });
    }
  } else {
    token = withToken ? randomUUID() : undefined;
    await file.save(Buffer.from(bytes), {
      resumable: false,
      contentType: "audio/mpeg",
      metadata: token
        ? { metadata: { firebaseStorageDownloadTokens: token } }
        : undefined,
    });
  }

  return buildDownloadUrl(
    bucket.name,
    objectName,
    withToken ? token : undefined,
  );
}

/** Replaces /sounds and /tags. Never touches anything else (e.g. /users). */
export async function writeDatabase(db: DbShape): Promise<void> {
  const database = getDatabase();
  await database.ref("/sounds").set(db.sounds);
  await database.ref("/tags").set(db.tags);
}
