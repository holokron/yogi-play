// @vitest-environment node
import { mkdtemp } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import snapshot from "./fixtures/db-snapshot.json" with { type: "json" };
import { fromDatabaseShape } from "./import-db.ts";
import { loadCatalog, writeCatalog } from "./io.ts";
import { toDatabaseShape } from "./model.ts";

const stripOrder = <T extends { order?: number }>(record: Record<string, T>) =>
  Object.fromEntries(
    Object.entries(record).map(([key, { order: _order, ...rest }]) => [
      key,
      rest,
    ]),
  );

describe("fromDatabaseShape", () => {
  it("sorts by order then name", () => {
    const { catalog } = fromDatabaseShape(snapshot);
    expect(catalog.sounds.map((s) => s.id)).toEqual(["s4", "s1", "s3", "s2"]);
    expect(catalog.tags.map((t) => t.id)).toEqual(["t2", "t3", "t1"]);
  });

  it("orders like the app: missing order counts as 0, ties by code-unit name", () => {
    const { catalog } = fromDatabaseShape({
      sounds: {
        a: { id: "a", name: "apple", path: "https://x/a.mp3", order: 0 },
        b: { id: "b", name: "Banana", path: "https://x/b.mp3", order: 0 },
        c: { id: "c", name: "Cherry", path: "https://x/c.mp3", order: 1 },
        d: { id: "d", name: "Date", path: "https://x/d.mp3" },
      },
      tags: {
        x: { id: "x", name: "zeta", slug: "zeta" },
        y: { id: "y", name: "Alpha", slug: "alpha", order: 0 },
      },
    });
    expect(catalog.sounds.map((s) => s.id)).toEqual(["b", "d", "a", "c"]);
    expect(catalog.tags.map((t) => t.id)).toEqual(["y", "x"]);
  });

  it("converts tag maps to slugs and keeps id/name/path/isNew", () => {
    const { catalog } = fromDatabaseShape(snapshot);
    expect(catalog.sounds.find((s) => s.id === "s1")).toEqual({
      id: "s1",
      name: "First",
      path: "https://x/1.mp3",
      tags: ["memes", "movies"],
      isNew: true,
    });
    expect(catalog.sounds.find((s) => s.id === "s4")).toEqual({
      id: "s4",
      name: "Untagged",
      path: "https://x/4.mp3",
      tags: [],
      isNew: false,
    });
    expect(catalog.tags[0]).toEqual({ id: "t2", slug: "memes", name: "Memes" });
  });

  it("repairs one-sided links with a union", () => {
    const { catalog, repairs } = fromDatabaseShape(snapshot);
    expect(catalog.sounds.find((s) => s.id === "s3")?.tags).toEqual(["movies"]);
    expect(repairs).toHaveLength(1);
    expect(repairs[0]).toContain("s3");
    expect(repairs[0]).toContain("t1");
  });

  it("round trips to the same DB shape apart from order and repairs", () => {
    const { catalog } = fromDatabaseShape(snapshot);
    const db = toDatabaseShape(catalog);
    const expected = structuredClone(snapshot) as typeof snapshot & {
      tags: { t1: { sounds: Record<string, boolean> } };
    };
    expected.tags.t1.sounds.s3 = true;
    expect(stripOrder(db.sounds)).toEqual(stripOrder(expected.sounds));
    expect(stripOrder(db.tags)).toEqual(stripOrder(expected.tags));
  });
});

describe("io", () => {
  it("explains how to create a missing catalog", async () => {
    const dir = await mkdtemp(join(tmpdir(), "catalog-"));
    await expect(loadCatalog(dir)).rejects.toThrow(
      "sounds.json not found. Run `pnpm catalog:import` to create the catalog",
    );
  });

  it("round trips through writeCatalog and loadCatalog", async () => {
    const dir = await mkdtemp(join(tmpdir(), "catalog-"));
    const { catalog } = fromDatabaseShape(snapshot);
    await writeCatalog(catalog, dir);
    expect(await loadCatalog(dir)).toEqual(catalog);
    for (const file of ["sounds.json", "tags.json"]) {
      expect((await readFile(join(dir, file), "utf8")).endsWith("]\n")).toBe(
        true,
      );
    }
  });
});
