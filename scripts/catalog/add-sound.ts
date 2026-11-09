// Usage: pnpm sound:add <file|url> --name "<name>" --tags a,b [--new]
import { createHash } from "node:crypto";
import { appendFile, readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { initAdmin, uploadSound } from "./firebase.ts";
import { loadCatalog, writeCatalog } from "./io.ts";
import { validateCatalog } from "./model.ts";
import {
  addSoundEntry,
  checkAudio,
  makeSoundId,
  usesDownloadTokens,
} from "./sound.ts";
import type { CatalogSound } from "./types.ts";

async function readInput(input: string): Promise<Uint8Array> {
  if (/^https?:\/\//.test(input)) {
    const response = await fetch(input);
    if (!response.ok)
      throw new Error(`Download failed: ${response.status} ${input}`);
    return new Uint8Array(await response.arrayBuffer());
  }
  return new Uint8Array(await readFile(input));
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      name: { type: "string" },
      tags: { type: "string", default: "" },
      new: { type: "boolean", default: false },
    },
  });
  const input = positionals[0];
  const name = values.name?.trim();
  if (!input || !name) {
    throw new Error(
      'Usage: pnpm sound:add <file|url> --name "<name>" --tags a,b [--new]',
    );
  }
  const tags = values.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  const bytes = await readInput(input);
  await checkAudio(bytes);
  const sha256 = createHash("sha256").update(bytes).digest("hex");

  const catalog = await loadCatalog();
  const entry: CatalogSound = {
    id: makeSoundId(name, sha256),
    name,
    path: "",
    tags,
  };
  if (values.new) entry.isNew = true;

  // Fail fast on bad tags or an id clash before uploading anything.
  addSoundEntry(catalog, { ...entry, path: "https://placeholder.invalid/" });

  initAdmin();
  entry.path = await uploadSound(bytes, sha256, usesDownloadTokens(catalog));

  const updated = addSoundEntry(catalog, entry);
  const errors = validateCatalog(updated);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  await writeCatalog(updated);

  console.log(JSON.stringify(entry, null, 2));
  console.log(`Listen: ${entry.path}`);

  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `id=${entry.id}\nname=${entry.name}\nurl=${entry.path}\n`,
    );
  }
}

try {
  await main();
} catch (error) {
  console.error(`Error: ${(error as Error).message}`);
  process.exit(1);
}
