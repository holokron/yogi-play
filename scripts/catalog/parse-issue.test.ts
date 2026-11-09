// @vitest-environment node
import { describe, expect, it } from "vitest";
import { isAllowedAttachmentUrl, parseIssueBody } from "./parse-issue.ts";

const ATTACHMENT_URL = "https://github.com/user-attachments/files/123/clip.mp3";

const body = (
  overrides: Partial<Record<"name" | "tags" | "isNew" | "audio", string>> = {},
) =>
  [
    "### Name",
    "",
    overrides.name ?? "No i co?",
    "",
    "### Tags",
    "",
    overrides.tags ?? " Movies, memes ,",
    "",
    "### Mark as new",
    "",
    overrides.isNew ?? '- [X] Show the "new" badge',
    "",
    "### Audio file",
    "",
    overrides.audio ?? `[clip.mp3](${ATTACHMENT_URL})`,
  ].join("\n");

describe("parseIssueBody", () => {
  it("parses a rendered issue form", () => {
    expect(parseIssueBody(body())).toEqual({
      name: "No i co?",
      tags: ["movies", "memes"],
      isNew: true,
      url: ATTACHMENT_URL,
    });
  });

  it("handles CRLF line endings", () => {
    expect(parseIssueBody(body().replaceAll("\n", "\r\n"))).toEqual(
      parseIssueBody(body()),
    );
  });

  it("reads an unchecked box as not new", () => {
    expect(
      parseIssueBody(body({ isNew: '- [ ] Show the "new" badge' })).isNew,
    ).toBe(false);
  });

  it("treats _No response_ as missing", () => {
    expect(() => parseIssueBody(body({ tags: "_No response_" }))).toThrow(
      "Tags",
    );
  });

  it("lists every missing field", () => {
    const both = body({ name: "_No response_", audio: "_No response_" });
    expect(() => parseIssueBody(both)).toThrow(/Name[\s\S]*Audio file/);
  });

  it("extracts a bare URL", () => {
    expect(parseIssueBody(body({ audio: ATTACHMENT_URL })).url).toBe(
      ATTACHMENT_URL,
    );
  });

  it("extracts a URL from an anchor tag", () => {
    const asset = "https://github.com/user-attachments/assets/abc";
    expect(
      parseIssueBody(body({ audio: `<a href="${asset}">clip.mp3</a>` })).url,
    ).toBe(asset);
  });

  it("rejects attachments from other hosts", () => {
    expect(() =>
      parseIssueBody(body({ audio: "[x.mp3](https://evil.example/x.mp3)" })),
    ).toThrow("not an allowed attachment URL");
  });
});

describe("isAllowedAttachmentUrl", () => {
  it("allows GitHub attachment hosts", () => {
    expect(isAllowedAttachmentUrl(ATTACHMENT_URL)).toBe(true);
    expect(
      isAllowedAttachmentUrl("https://objects.githubusercontent.com/x"),
    ).toBe(true);
  });

  it("rejects look-alikes and other GitHub paths", () => {
    expect(
      isAllowedAttachmentUrl("https://github.com/holokron/yogi-play/raw/x.mp3"),
    ).toBe(false);
    expect(
      isAllowedAttachmentUrl("https://github.com.evil.io/user-attachments/x"),
    ).toBe(false);
    expect(isAllowedAttachmentUrl("http://github.com/user-attachments/x")).toBe(
      false,
    );
    expect(isAllowedAttachmentUrl("not a url")).toBe(false);
  });
});
