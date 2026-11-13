import type { Catalog, CatalogSound, CatalogTag } from "./types.ts";

type RawSound = {
  id?: string;
  name?: string;
  path?: string;
  order?: number;
  tags?: Record<string, boolean>;
  isNew?: boolean;
};

type RawTag = {
  id?: string;
  name?: string;
  slug?: string;
  order?: number;
  sounds?: Record<string, boolean>;
};

/** Live DB data as fetched over REST: loosely shaped, possibly null. */
export type RawDatabase = {
  sounds?: Record<string, RawSound> | null;
  tags?: Record<string, RawTag> | null;
};

type Ordered = { key: string; order: number; name: string };

// Mirrors the app's sort (src/store/selectors.ts): `order || 0`, then a
// code-unit comparison of names, so the first sync keeps the visible order.
const byOrderThenName = (a: Ordered, b: Ordered): number => {
  if (a.order !== b.order) return a.order < b.order ? -1 : 1;
  if (a.name === b.name) return 0;
  return a.name < b.name ? -1 : 1;
};

const orderOf = (value: unknown): number =>
  (typeof value === "number" ? value : 0) || 0;

/**
 * Converts the live Realtime DB data into a catalog. Links that exist on only
 * one side (Sound.tags vs Tag.sounds) are merged, and every merge is reported.
 */
export function fromDatabaseShape(db: RawDatabase): {
  catalog: Catalog;
  repairs: string[];
} {
  const rawSounds = db.sounds ?? {};
  const rawTags = db.tags ?? {};
  const repairs: string[] = [];

  const tagEntries: Ordered[] = Object.entries(rawTags).map(([key, tag]) => ({
    key,
    order: orderOf(tag.order),
    name: tag.name ?? "",
  }));
  tagEntries.sort(byOrderThenName);
  const tagRank = new Map(tagEntries.map((entry, index) => [entry.key, index]));

  const tags: CatalogTag[] = tagEntries.map(({ key }) => {
    const tag = rawTags[key];
    return { id: tag.id ?? key, slug: tag.slug ?? "", name: tag.name ?? "" };
  });

  const links = new Map<string, Set<string>>();
  const link = (soundKey: string, tagKey: string) => {
    const set = links.get(soundKey) ?? new Set<string>();
    set.add(tagKey);
    links.set(soundKey, set);
  };

  for (const [soundKey, sound] of Object.entries(rawSounds)) {
    for (const tagKey of Object.keys(sound.tags ?? {})) {
      if (!(tagKey in rawTags)) {
        repairs.push(
          `sound "${soundKey}" references missing tag "${tagKey}" — dropped`,
        );
        continue;
      }
      link(soundKey, tagKey);
      if (!rawTags[tagKey].sounds?.[soundKey]) {
        repairs.push(
          `sound "${soundKey}" lists tag "${tagKey}" but the tag does not list it — linked`,
        );
      }
    }
  }
  for (const [tagKey, tag] of Object.entries(rawTags)) {
    for (const soundKey of Object.keys(tag.sounds ?? {})) {
      if (!(soundKey in rawSounds)) {
        repairs.push(
          `tag "${tagKey}" references missing sound "${soundKey}" — dropped`,
        );
        continue;
      }
      if (!rawSounds[soundKey].tags?.[tagKey]) {
        link(soundKey, tagKey);
        repairs.push(
          `tag "${tagKey}" lists sound "${soundKey}" but the sound does not list it — linked`,
        );
      }
    }
  }

  const soundEntries: Ordered[] = Object.entries(rawSounds).map(
    ([key, sound]) => ({
      key,
      order: orderOf(sound.order),
      name: sound.name ?? "",
    }),
  );
  soundEntries.sort(byOrderThenName);

  const sounds: CatalogSound[] = soundEntries.map(({ key }) => {
    const sound = rawSounds[key];
    const tagKeys = [...(links.get(key) ?? [])].toSorted(
      (a, b) => (tagRank.get(a) ?? 0) - (tagRank.get(b) ?? 0),
    );
    const entry: CatalogSound = {
      id: sound.id ?? key,
      name: sound.name ?? "",
      path: sound.path ?? "",
      tags: tagKeys.map((tagKey) => rawTags[tagKey].slug ?? ""),
    };
    if (typeof sound.isNew === "boolean") entry.isNew = sound.isNew;
    return entry;
  });

  return { catalog: { sounds, tags }, repairs };
}
