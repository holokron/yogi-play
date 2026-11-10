import { loadCatalog } from "./io.ts";
import { validateCatalog } from "./model.ts";

try {
  const catalog = await loadCatalog();
  const errors = validateCatalog(catalog);
  if (errors.length > 0) {
    for (const error of errors) console.error(`✗ ${error}`);
    throw new Error(`Catalog invalid: ${errors.length} error(s)`);
  }
  console.log(
    `Catalog OK: ${catalog.sounds.length} sounds, ${catalog.tags.length} tags`,
  );
} catch (error) {
  console.error(`Error: ${(error as Error).message}`);
  process.exit(1);
}
