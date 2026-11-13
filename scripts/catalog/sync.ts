// Writes catalog/*.json to the Realtime DB (/sounds and /tags only).
// Usage: pnpm catalog:sync [--dry-run]
import { parseArgs } from "node:util";
import { loadCatalog } from "./io.ts";
import { toDatabaseShape, validateCatalog } from "./model.ts";
import type { Catalog, DbShape } from "./types.ts";

export type Connection = {
  write(db: DbShape): Promise<void>;
  close(): Promise<void>;
};

/**
 * Validates, writes and always closes the connection: an open firebase-admin
 * RTDB socket would otherwise keep the process (and the CI job) alive.
 */
export async function runSync(
  catalog: Catalog,
  { connect }: { connect: () => Promise<Connection> },
): Promise<string> {
  const errors = validateCatalog(catalog);
  if (errors.length > 0) {
    throw new Error(`Catalog invalid; nothing synced:\n${errors.join("\n")}`);
  }
  const db = toDatabaseShape(catalog);
  const connection = await connect();
  try {
    await connection.write(db);
  } finally {
    await connection.close();
  }
  return `Synced ${Object.keys(db.sounds).length} sounds, ${Object.keys(db.tags).length} tags`;
}

async function connectFirebase(): Promise<Connection> {
  const { closeAdmin, initAdmin, writeDatabase } =
    await import("./firebase.ts");
  initAdmin();
  return { write: writeDatabase, close: closeAdmin };
}

if (import.meta.main) {
  const { values } = parseArgs({
    options: { "dry-run": { type: "boolean", default: false } },
  });
  try {
    const catalog = await loadCatalog();
    if (values["dry-run"]) {
      const db = toDatabaseShape(catalog);
      const errors = validateCatalog(catalog);
      if (errors.length > 0)
        throw new Error(`Catalog invalid:\n${errors.join("\n")}`);
      console.log(
        `Dry run: would sync ${Object.keys(db.sounds).length} sounds, ${Object.keys(db.tags).length} tags`,
      );
      const [first] = Object.values(db.sounds);
      if (first) console.log(JSON.stringify(first, null, 2));
    } else {
      console.log(await runSync(catalog, { connect: connectFirebase }));
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}
