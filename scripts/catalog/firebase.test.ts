// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { initAdmin } from "./firebase.ts";

afterEach(() => vi.unstubAllEnvs());

describe("initAdmin", () => {
  it("never echoes a malformed service account into the error", () => {
    vi.stubEnv("FIREBASE_SERVICE_ACCOUNT", '{"private_key": "SUPER-SECRET-KEY');
    vi.stubEnv("VITE_APP_FIREBASE_STORAGE_BUCKET", "b");
    vi.stubEnv("VITE_APP_FIREBASE_DATABASE_URL", "https://db");
    let message = "";
    try {
      initAdmin();
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toBe("FIREBASE_SERVICE_ACCOUNT is not valid JSON");
    expect(message).not.toContain("SECRET");
  });
});
