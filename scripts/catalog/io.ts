import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { Catalog } from "./types.ts";

export const CATALOG_DIR = resolve(import.meta.dirname, "../../catalog");

const toJson = (value: unknown): string =>
  `${JSON.stringify(value, null, 2)}\n`;

async function readJson(dir: string, file: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(join(dir, file), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        `${file} not found. Run \`pnpm catalog:import\` to create the catalog`,
        { cause: error },
      );
    }
    throw error;
  }
}

export async function loadCatalog(dir: string = CATALOG_DIR): Promise<Catalog> {
  // Sequential so a missing catalog always reports sounds.json first.
  const sounds = (await readJson(dir, "sounds.json")) as Catalog["sounds"];
  const tags = (await readJson(dir, "tags.json")) as Catalog["tags"];
  return { sounds, tags };
}

export async function writeCatalog(
  catalog: Catalog,
  dir: string = CATALOG_DIR,
): Promise<void> {
  await writeFile(join(dir, "sounds.json"), toJson(catalog.sounds));
  await writeFile(join(dir, "tags.json"), toJson(catalog.tags));
}
