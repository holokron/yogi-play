import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { Catalog } from "./types.ts";

export const CATALOG_DIR = resolve(import.meta.dirname, "../../catalog");

const toJson = (value: unknown): string =>
  `${JSON.stringify(value, null, 2)}\n`;

export async function loadCatalog(dir: string = CATALOG_DIR): Promise<Catalog> {
  const [sounds, tags] = await Promise.all(
    ["sounds.json", "tags.json"].map(async (file) =>
      JSON.parse(await readFile(join(dir, file), "utf8")),
    ),
  );
  return { sounds, tags };
}

export async function writeCatalog(
  catalog: Catalog,
  dir: string = CATALOG_DIR,
): Promise<void> {
  await writeFile(join(dir, "sounds.json"), toJson(catalog.sounds));
  await writeFile(join(dir, "tags.json"), toJson(catalog.tags));
}
