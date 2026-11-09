// Parses the body GitHub renders for .github/ISSUE_TEMPLATE/new-sound.yml.
// CLI mode reads ISSUE_BODY and writes name/tags/new/url to $GITHUB_OUTPUT.
import { appendFile } from "node:fs/promises";

export type SoundRequest = {
  name: string;
  tags: string[];
  isNew: boolean;
  url: string;
};

const NO_RESPONSE = "_No response_";

export function isAllowedAttachmentUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  if (parsed.hostname === "github.com")
    return parsed.pathname.startsWith("/user-attachments/");
  return parsed.hostname.endsWith(".githubusercontent.com");
}

function sections(body: string): Map<string, string> {
  const result = new Map<string, string>();
  const parts = body.replace(/\r\n/g, "\n").split(/^### /m).slice(1);
  for (const part of parts) {
    const newline = part.indexOf("\n");
    const heading = (newline === -1 ? part : part.slice(0, newline)).trim();
    const value = newline === -1 ? "" : part.slice(newline + 1).trim();
    result.set(heading, value === NO_RESPONSE ? "" : value);
  }
  return result;
}

function extractUrl(text: string): string | undefined {
  return (
    text.match(/\]\((https?:\/\/[^)\s]+)\)/)?.[1] ??
    text.match(/href="(https?:\/\/[^"]+)"/)?.[1] ??
    text.match(/https?:\/\/\S+/)?.[0]
  );
}

/** Throws one Error listing every missing or invalid field. */
export function parseIssueBody(body: string): SoundRequest {
  const fields = sections(body);
  const errors: string[] = [];

  const name = fields.get("Name") ?? "";
  if (!name) errors.push("Name is required");
  if (name.includes("\n")) errors.push("Name must be a single line");

  const tags = (fields.get("Tags") ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  if (tags.length === 0)
    errors.push("Tags is required (comma-separated tag slugs)");

  const isNew = /^- \[x\]/im.test(fields.get("Mark as new") ?? "");

  const audio = fields.get("Audio file") ?? "";
  const url = extractUrl(audio) ?? "";
  if (!audio || !url) {
    errors.push(
      "Audio file is required (drag and drop the .mp3 into the field)",
    );
  } else if (!isAllowedAttachmentUrl(url)) {
    errors.push(`Audio file: ${url} is not an allowed attachment URL`);
  }

  if (errors.length > 0) throw new Error(errors.join("\n"));
  return { name, tags, isNew, url };
}

if (import.meta.main) {
  try {
    const request = parseIssueBody(process.env.ISSUE_BODY ?? "");
    const output = process.env.GITHUB_OUTPUT;
    if (!output) throw new Error("GITHUB_OUTPUT is not set");
    await appendFile(
      output,
      `name=${request.name}\ntags=${request.tags.join(",")}\nnew=${request.isNew}\nurl=${request.url}\n`,
    );
    console.log(JSON.stringify(request, null, 2));
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}
