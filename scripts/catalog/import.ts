// One-time bootstrap: reads /sounds and /tags from the live Realtime DB
// (public REST endpoint, no credentials) and writes catalog/*.json.
import { fromDatabaseShape } from "./import-db.ts";
import { writeCatalog } from "./io.ts";

const databaseUrl = process.env.VITE_APP_FIREBASE_DATABASE_URL;
if (!databaseUrl) {
  console.error("Error: VITE_APP_FIREBASE_DATABASE_URL is not set");
  process.exit(1);
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(`${databaseUrl!.replace(/\/$/, "")}/${path}`);
  if (!response.ok) throw new Error(`GET ${path} failed: ${response.status}`);
  return response.json();
}

try {
  const [sounds, tags] = await Promise.all([
    fetchJson("sounds.json"),
    fetchJson("tags.json"),
  ]);
  const { catalog, repairs } = fromDatabaseShape({
    sounds: sounds as never,
    tags: tags as never,
  });
  for (const repair of repairs) console.log(`repair: ${repair}`);
  await writeCatalog(catalog);
  console.log(
    `Imported ${catalog.sounds.length} sounds, ${catalog.tags.length} tags`,
  );
  const tokenised = catalog.sounds.some((sound) =>
    sound.path.includes("token="),
  );
  console.log(tokenised ? "Paths use download tokens" : "Paths are tokenless");
} catch (error) {
  console.error(`Error: ${(error as Error).message}`);
  process.exit(1);
}
