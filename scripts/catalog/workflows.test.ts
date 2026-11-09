// @vitest-environment node
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const read = (name: string) =>
  readFile(new URL(`../../.github/workflows/${name}`, import.meta.url), "utf8");

describe("sound-request workflow", () => {
  it("runs every step with pipefail so `| tee` cannot hide failures", async () => {
    // `shell: bash` makes Actions use `bash --noprofile --norc -eo pipefail {0}`.
    expect(await read("sound-request.yml")).toMatch(
      /^defaults:\n {2}run:\n {4}shell: bash$/m,
    );
  });

  it("does not expose secrets or the write token at job level", async () => {
    const workflow = await read("sound-request.yml");
    const jobEnv = workflow.match(/^ {4}env:\n((?: {6}.*\n)+)/m)?.[1] ?? "";
    expect(jobEnv).not.toMatch(/FIREBASE_SERVICE_ACCOUNT|GH_TOKEN/);
    expect(workflow.match(/FIREBASE_SERVICE_ACCOUNT:/g)).toHaveLength(1);
  });
});

describe.each(["sound-request.yml", "sync-catalog.yml"])("%s", (name) => {
  it("has a job timeout", async () => {
    expect(await read(name)).toMatch(/timeout-minutes: \d+/);
  });
});
