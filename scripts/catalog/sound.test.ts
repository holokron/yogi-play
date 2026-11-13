// @vitest-environment node
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  addSoundEntry,
  buildDownloadUrl,
  checkAudio,
  makeSoundId,
  usesDownloadTokens,
} from "./sound.ts";
import type { Catalog } from "./types.ts";

const HASH = "abcdef0123456789";

const parseLongMp3 = async () =>
  ({
    format: { container: "MPEG", codec: "MPEG 1 Layer 3", duration: 31 },
  }) as never;

const catalog: Catalog = {
  tags: [
    { id: "t1", slug: "movies", name: "Movies" },
    { id: "t2", slug: "memes", name: "Memes" },
  ],
  sounds: [{ id: "s1", name: "A", path: "https://x/a.mp3", tags: ["movies"] }],
};

describe("makeSoundId", () => {
  it("transliterates Polish diacritics", () => {
    expect(makeSoundId("Żółć gęślą", HASH)).toBe("zolc-gesla-abcdef");
  });

  it("falls back to 'sound' when the name has no usable characters", () => {
    expect(makeSoundId("!!!", HASH)).toBe("sound-abcdef");
  });

  it("trims and collapses punctuation", () => {
    expect(makeSoundId("  No i co?  ", "123456789")).toBe("no-i-co-123456");
  });
});

describe("buildDownloadUrl", () => {
  it("builds a tokenless Firebase download URL", () => {
    expect(buildDownloadUrl("b.appspot.com", "sounds/x.mp3")).toBe(
      "https://firebasestorage.googleapis.com/v0/b/b.appspot.com/o/sounds%2Fx.mp3?alt=media",
    );
  });

  it("appends the download token when given", () => {
    expect(buildDownloadUrl("b.appspot.com", "sounds/x.mp3", "t")).toMatch(
      /\?alt=media&token=t$/,
    );
  });
});

describe("usesDownloadTokens", () => {
  it("detects tokenised paths", () => {
    expect(usesDownloadTokens(catalog)).toBe(false);
    const withToken = structuredClone(catalog);
    withToken.sounds[0].path = "https://x/a.mp3?alt=media&token=abc";
    expect(usesDownloadTokens(withToken)).toBe(true);
  });
});

describe("addSoundEntry", () => {
  const entry = {
    id: "new-abcdef",
    name: "New",
    path: "https://x/new.mp3",
    tags: ["memes"],
  };

  it("appends at the end without mutating the input", () => {
    const result = addSoundEntry(catalog, entry);
    expect(result.sounds.map((s) => s.id)).toEqual(["s1", "new-abcdef"]);
    expect(catalog.sounds).toHaveLength(1);
  });

  it("rejects unknown tags and lists the valid ones", () => {
    expect(() => addSoundEntry(catalog, { ...entry, tags: ["nope"] })).toThrow(
      'Unknown tag "nope". Valid tags: movies, memes',
    );
  });

  it("rejects a duplicate id", () => {
    expect(() => addSoundEntry(catalog, { ...entry, id: "s1" })).toThrow(/s1/);
  });

  it("reports the duplicate when the same file is re-added under the same id", () => {
    expect(() =>
      addSoundEntry(catalog, { ...entry, id: "s1", path: "https://x/a.mp3" }),
    ).toThrow("duplicate of s1");
  });

  it("rejects a duplicate path", () => {
    expect(() =>
      addSoundEntry(catalog, { ...entry, path: "https://x/a.mp3" }),
    ).toThrow("duplicate of s1");
  });
});

describe("checkAudio", () => {
  it("rejects files over 1 MB", async () => {
    await expect(checkAudio(new Uint8Array(1_048_577))).rejects.toThrow("1 MB");
  });

  it("rejects non-audio bytes", async () => {
    const bytes = new TextEncoder().encode(
      "definitely not an mp3 file, just text",
    );
    await expect(checkAudio(bytes)).rejects.toThrow("not an MP3");
  });

  it("accepts a valid mp3", async () => {
    const bytes = new Uint8Array(
      await readFile(new URL("./fixtures/silence.mp3", import.meta.url)),
    );
    const { durationSec } = await checkAudio(bytes);
    expect(durationSec).toBeGreaterThan(0);
    expect(durationSec).toBeLessThan(2);
  });

  it("rejects sounds longer than 30 s", async () => {
    await expect(checkAudio(new Uint8Array(10), parseLongMp3)).rejects.toThrow(
      "30 s",
    );
  });
});
