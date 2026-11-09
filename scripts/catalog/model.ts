import type { Catalog, DbShape, DbSound, DbTag } from "./types.ts";

export const TAG_SLUG_PATTERN = /^[a-z0-9-]+$/;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

/** Returns every problem found in the catalog, or an empty array. */
export function validateCatalog(catalog: Catalog): string[] {
  const errors: string[] = [];
  const tags: unknown[] = Array.isArray(catalog?.tags) ? catalog.tags : [];
  const sounds: unknown[] = Array.isArray(catalog?.sounds)
    ? catalog.sounds
    : [];

  if (!Array.isArray(catalog?.tags)) errors.push("tags.json must be an array");
  if (!Array.isArray(catalog?.sounds))
    errors.push("sounds.json must be an array");

  const tagIds = new Set<string>();
  const tagSlugs = new Set<string>();

  tags.forEach((raw, index) => {
    const tag = (raw ?? {}) as Record<string, unknown>;
    const label = `tag #${index}`;
    if (!isNonEmptyString(tag.id))
      errors.push(`${label}: "id" must be a non-empty string`);
    if (!isNonEmptyString(tag.name))
      errors.push(`${label}: "name" must be a non-empty string`);
    if (typeof tag.slug !== "string" || !TAG_SLUG_PATTERN.test(tag.slug)) {
      errors.push(
        `${label}: slug "${String(tag.slug)}" must match ${TAG_SLUG_PATTERN}`,
      );
    }
    if (typeof tag.id === "string") {
      if (tagIds.has(tag.id)) errors.push(`duplicate tag id "${tag.id}"`);
      tagIds.add(tag.id);
    }
    if (typeof tag.slug === "string") {
      if (tagSlugs.has(tag.slug))
        errors.push(`duplicate tag slug "${tag.slug}"`);
      tagSlugs.add(tag.slug);
    }
  });

  const soundIds = new Set<string>();
  const paths = new Map<string, string>();

  sounds.forEach((raw, index) => {
    const sound = (raw ?? {}) as Record<string, unknown>;
    const label = `sound #${index}${typeof sound.id === "string" ? ` ("${sound.id}")` : ""}`;
    if (!isNonEmptyString(sound.id))
      errors.push(`${label}: "id" must be a non-empty string`);
    if (!isNonEmptyString(sound.name))
      errors.push(`${label}: "name" must be a non-empty string`);
    if (typeof sound.path !== "string" || !sound.path.startsWith("https://")) {
      errors.push(`${label}: "path" must be an https URL`);
    }
    if (sound.isNew !== undefined && typeof sound.isNew !== "boolean") {
      errors.push(`${label}: "isNew" must be a boolean`);
    }
    if (!Array.isArray(sound.tags)) {
      errors.push(`${label}: "tags" must be an array of tag slugs`);
    } else {
      for (const slug of sound.tags) {
        if (typeof slug !== "string" || !tagSlugs.has(slug)) {
          errors.push(`${label}: unknown tag "${String(slug)}"`);
        }
      }
    }
    if (typeof sound.id === "string") {
      if (soundIds.has(sound.id))
        errors.push(`duplicate sound id "${sound.id}"`);
      soundIds.add(sound.id);
    }
    if (typeof sound.path === "string") {
      const previous = paths.get(sound.path);
      if (previous !== undefined) {
        errors.push(
          `${label}: path ${sound.path} is already used by "${previous}"`,
        );
      } else {
        paths.set(sound.path, String(sound.id));
      }
    }
  });

  return errors;
}

/** Builds the Realtime DB shape the app reads (two-way maps, order = index). */
export function toDatabaseShape(catalog: Catalog): DbShape {
  const tagIdBySlug = new Map(catalog.tags.map((tag) => [tag.slug, tag.id]));
  const soundsByTagId = new Map<string, Record<string, true>>();

  const sounds: Record<string, DbSound> = {};
  catalog.sounds.forEach((sound, order) => {
    const entry: DbSound = {
      id: sound.id,
      name: sound.name,
      path: sound.path,
      order,
    };
    const tagMap: Record<string, true> = {};
    for (const slug of sound.tags) {
      const tagId = tagIdBySlug.get(slug);
      if (tagId === undefined) continue;
      tagMap[tagId] = true;
      const members = soundsByTagId.get(tagId) ?? {};
      members[sound.id] = true;
      soundsByTagId.set(tagId, members);
    }
    if (Object.keys(tagMap).length > 0) entry.tags = tagMap;
    if (sound.isNew !== undefined) entry.isNew = sound.isNew;
    sounds[sound.id] = entry;
  });

  const tags: Record<string, DbTag> = {};
  catalog.tags.forEach((tag, order) => {
    const entry: DbTag = { id: tag.id, name: tag.name, slug: tag.slug, order };
    const members = soundsByTagId.get(tag.id);
    if (members) entry.sounds = members;
    tags[tag.id] = entry;
  });

  return { sounds, tags };
}
