import { loadCatalog } from "./io.ts";
import { validateCatalog } from "./model.ts";

const catalog = await loadCatalog();
const errors = validateCatalog(catalog);

if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`);
  console.error(`Catalog invalid: ${errors.length} error(s)`);
  process.exit(1);
}

console.log(
  `Catalog OK: ${catalog.sounds.length} sounds, ${catalog.tags.length} tags`,
);
