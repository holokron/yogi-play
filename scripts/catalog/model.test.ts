// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toDatabaseShape, validateCatalog } from "./model.ts";
import type { Catalog } from "./types.ts";

const catalog: Catalog = {
  tags: [
    { id: "t1", slug: "movies", name: "Movies" },
    { id: "t2", slug: "memes", name: "Memes" },
  ],
  sounds: [
    {
      id: "s1",
      name: "A",
      path: "https://x/a.mp3",
      tags: ["movies", "memes"],
      isNew: true,
    },
    { id: "s2", name: "B", path: "https://x/b.mp3", tags: [] },
  ],
};

describe("toDatabaseShape", () => {
  it("builds two-way maps and order", () => {
    const db = toDatabaseShape(catalog);
    expect(db.sounds.s1).toEqual({
      id: "s1",
      name: "A",
      path: "https://x/a.mp3",
      order: 0,
      tags: { t1: true, t2: true },
      isNew: true,
    });
    expect(db.sounds.s2).toEqual({
      id: "s2",
      name: "B",
      path: "https://x/b.mp3",
      order: 1,
    });
    expect(db.tags.t1.sounds).toEqual({ s1: true });
    expect(db.tags.t2.order).toBe(1);
  });
});

describe("validateCatalog", () => {
  it("accepts a valid catalog", () => {
    expect(validateCatalog(catalog)).toEqual([]);
  });

  it("reports every error", () => {
    const bad: Catalog = {
      tags: [
        { id: "t1", slug: "movies", name: "Movies" },
        { id: "t1", slug: "other", name: "Other" },
        { id: "t3", slug: "movies", name: "Movies 2" },
        { id: "t4", slug: "Bad Slug", name: "Bad" },
      ],
      sounds: [
        { id: "s1", name: "A", path: "https://x/a.mp3", tags: ["nope"] },
        { id: "s1", name: "B", path: "https://x/b.mp3", tags: [] },
        { id: "s3", name: "C", path: "https://x/a.mp3", tags: [] },
      ],
    };
    const errors = validateCatalog(bad);
    expect(errors).toHaveLength(6);
    for (const needle of [
      '"s1"',
      '"t1"',
      '"movies"',
      '"nope"',
      "https://x/a.mp3",
      '"Bad Slug"',
    ]) {
      expect(errors.some((e) => e.includes(needle))).toBe(true);
    }
  });

  it("rejects bad fields", () => {
    const tag = { id: "t1", slug: "movies", name: "Movies" };
    const cases = [
      { id: "a", name: "", path: "https://x/a.mp3", tags: [] },
      { id: "b", name: "B", path: "http://x/b.mp3", tags: [] },
      { id: "c", name: "C", path: "https://x/c.mp3", tags: "movies" },
    ];
    for (const sound of cases) {
      const errors = validateCatalog({
        tags: [tag],
        sounds: [sound],
      } as unknown as Catalog);
      expect(errors.length).toBeGreaterThan(0);
    }
  });
});
