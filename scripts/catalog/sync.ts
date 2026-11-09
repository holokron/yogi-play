// Writes catalog/*.json to the Realtime DB (/sounds and /tags only).
// Usage: pnpm catalog:sync [--dry-run]
import { parseArgs } from "node:util";
import { loadCatalog } from "./io.ts";
import { toDatabaseShape, validateCatalog } from "./model.ts";

const { values } = parseArgs({
  options: { "dry-run": { type: "boolean", default: false } },
});

try {
  const catalog = await loadCatalog();
  const errors = validateCatalog(catalog);
  if (errors.length > 0) {
    for (const error of errors) console.error(`✗ ${error}`);
    throw new Error(
      `Catalog invalid: ${errors.length} error(s); nothing synced`,
    );
  }

  const db = toDatabaseShape(catalog);
  const counts = `${Object.keys(db.sounds).length} sounds, ${Object.keys(db.tags).length} tags`;

  if (values["dry-run"]) {
    console.log(`Dry run: would sync ${counts}`);
    const [first] = Object.values(db.sounds);
    if (first) console.log(JSON.stringify(first, null, 2));
  } else {
    const { initAdmin, writeDatabase } = await import("./firebase.ts");
    initAdmin();
    await writeDatabase(db);
    console.log(`Synced ${counts}`);
  }
} catch (error) {
  console.error(`Error: ${(error as Error).message}`);
  process.exit(1);
}
