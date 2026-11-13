// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { type Connection, runSync } from "./sync.ts";
import type { Catalog } from "./types.ts";

const catalog: Catalog = {
  tags: [{ id: "t1", slug: "movies", name: "Movies" }],
  sounds: [{ id: "s1", name: "A", path: "https://x/a.mp3", tags: ["movies"] }],
};

describe("runSync", () => {
  it("writes the DB shape and closes the Firebase connection", async () => {
    const write = vi.fn<Connection["write"]>(async () => {});
    const close = vi.fn<Connection["close"]>(async () => {});
    const message = await runSync(catalog, {
      connect: async () => ({ write, close }),
    });
    expect(write).toHaveBeenCalledWith(
      expect.objectContaining({
        sounds: expect.objectContaining({ s1: expect.anything() }),
      }),
    );
    expect(close).toHaveBeenCalledOnce();
    expect(message).toBe("Synced 1 sounds, 1 tags");
  });

  it("closes the connection even when the write fails", async () => {
    const close = vi.fn<Connection["close"]>(async () => {});
    const write = vi.fn<Connection["write"]>(async () => {
      throw new Error("permission denied");
    });
    await expect(
      runSync(catalog, { connect: async () => ({ write, close }) }),
    ).rejects.toThrow("permission denied");
    expect(close).toHaveBeenCalledOnce();
  });

  it("refuses an invalid catalog without connecting", async () => {
    const connect = vi.fn<() => Promise<Connection>>();
    const invalid = {
      ...catalog,
      sounds: [{ ...catalog.sounds[0], tags: ["nope"] }],
    };
    await expect(runSync(invalid, { connect })).rejects.toThrow(
      "Catalog invalid",
    );
    expect(connect).not.toHaveBeenCalled();
  });
});
