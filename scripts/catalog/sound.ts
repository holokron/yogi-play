import { parseBuffer } from "music-metadata";
import type { Catalog, CatalogSound } from "./types.ts";

export const MAX_AUDIO_BYTES = 1_048_576;
export const MAX_AUDIO_SECONDS = 30;

const POLISH: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => POLISH[char])
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeSoundId(name: string, sha256: string): string {
  return `${slugify(name) || "sound"}-${sha256.slice(0, 6)}`;
}

type Parse = typeof parseBuffer;

/** Throws a readable Error unless the bytes are an MP3 within the size and length limits. */
export async function checkAudio(
  bytes: Uint8Array,
  parse: Parse = parseBuffer,
): Promise<{ durationSec: number }> {
  if (bytes.byteLength > MAX_AUDIO_BYTES) {
    throw new Error(
      `File is ${(bytes.byteLength / 1_048_576).toFixed(2)} MB; the limit is 1 MB`,
    );
  }
  let format: Awaited<ReturnType<Parse>>["format"];
  try {
    ({ format } = await parse(bytes));
  } catch {
    throw new Error("File is not an MP3");
  }
  const isMp3 = /MPEG.*Layer 3/i.test(format.codec ?? "");
  if (!isMp3) throw new Error("File is not an MP3");
  const durationSec = format.duration ?? 0;
  if (durationSec > MAX_AUDIO_SECONDS) {
    throw new Error(
      `Sound is ${durationSec.toFixed(1)} s long; the limit is 30 s`,
    );
  }
  return { durationSec };
}

export function buildDownloadUrl(
  bucket: string,
  objectName: string,
  token?: string,
): string {
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectName)}?alt=media`;
  return token ? `${url}&token=${token}` : url;
}

export function usesDownloadTokens(catalog: Catalog): boolean {
  return catalog.sounds.some((sound) => sound.path.includes("token="));
}

/** Returns a new catalog with the entry appended; throws on unknown tags or duplicates. */
export function addSoundEntry(catalog: Catalog, entry: CatalogSound): Catalog {
  const validSlugs = catalog.tags.map((tag) => tag.slug);
  for (const slug of entry.tags) {
    if (!validSlugs.includes(slug)) {
      throw new Error(
        `Unknown tag "${slug}". Valid tags: ${validSlugs.join(", ")}`,
      );
    }
  }
  const samePath = catalog.sounds.find((sound) => sound.path === entry.path);
  if (samePath)
    throw new Error(
      `This file is already in the catalog: duplicate of ${samePath.id}`,
    );
  if (catalog.sounds.some((sound) => sound.id === entry.id)) {
    throw new Error(`A sound with id "${entry.id}" already exists`);
  }
  return { ...catalog, sounds: [...catalog.sounds, entry] };
}
