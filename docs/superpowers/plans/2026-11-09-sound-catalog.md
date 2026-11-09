# Sound Catalog in Git Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `catalog/*.json` in the repo the source of truth for sound and
tag metadata. Sounds are added through a GitHub issue form or a local CLI,
and the catalogue is synced to the Firebase Realtime DB on merge.

**Architecture:** The pure logic (types, validation, DB-shape conversion, ID
generation, issue parsing) lives in small TypeScript modules under
`scripts/catalog/`, run directly by Node 26. Firebase I/O is isolated in
one module (`firebase.ts`). Thin CLI entry points wire them together, and
three GitHub workflows call the CLIs. The app (`src/`) is not changed.

**Tech Stack:** Node 26 (native TS type stripping), TypeScript, vitest,
firebase-admin, music-metadata, GitHub Actions, GitHub issue forms.

**Spec:** `docs/superpowers/specs/2026-11-09-sound-catalog-design.md`

## Global Constraints

- Scripts run as `node scripts/catalog/<x>.ts`, with no tsx and no build step.
  Only erasable TS syntax is allowed (no `enum`, no `namespace`, no parameter
  properties). Relative imports use the `.ts` extension.
- `scripts/` is excluded from the root `tsconfig.json`. Typecheck it with
  `scripts/tsconfig.json` (Task 1).
- Every test file under `scripts/` starts with `// @vitest-environment node`,
  because the root vitest config defaults to jsdom.
- Audio limits: MPEG layer 3 only, at most 1 MB (1_048_576 bytes), at most 30 s.
- Storage object name: `sounds/<full sha256 hex>.mp3`, `contentType: audio/mpeg`.
- New sound ID: `<slugified-name>-<first 6 hex chars of sha256>`.
- Tag slug regex: `^[a-z0-9-]+$`.
- JSON files are written with `JSON.stringify(x, null, 2) + "\n"`.
- Attachment URL allowlist: host `github.com` with a path starting
  `/user-attachments/`, or a host ending in `.githubusercontent.com`.
- Env vars: `FIREBASE_SERVICE_ACCOUNT` (JSON string, preferred),
  `GOOGLE_APPLICATION_CREDENTIALS` (fallback), `VITE_APP_FIREBASE_STORAGE_BUCKET`,
  `VITE_APP_FIREBASE_DATABASE_URL`.
- Label `sound:approved`, GitHub environment `production`.
- `sync` never writes anything except `/sounds` and `/tags`.

## Review Focus

1. **Names that slugify to nothing.** For an emoji-only or punctuation-only
   name such as "!!!", `makeSoundId` must still return a valid ID
   (`sound-<hash6>`). Test in Task 3.
2. **Messy issue-form fields.** Tags with spaces, upper case or trailing
   commas (`" Movies, memes ,"`), CRLF line endings, and GitHub's literal
   `_No response_` for empty optional fields. The parser normalizes all of
   these. Test in Task 5.
3. **Attachment markdown variants.** `[clip.mp3](url)`, a bare URL, and
   `<a href="url">`. All must be extracted. A non-allowlisted URL, such as
   `https://evil.example/x.mp3`, is rejected. Test in Task 5.
4. **Re-running after the label is applied again.** If branch
   `sound/issue-N` already exists from a failed or earlier run, the workflow
   must recreate it from `master` (force-push) and reuse the open PR instead
   of failing. This is handled in the Task 5 workflow script and checked in
   the Task 7 manual run.
5. **The same file uploaded twice.** `addSoundEntry` must fail with
   `duplicate of <id>` when the computed path already exists, before any
   catalogue write. Test in Task 3.

---

## File Structure

```
scripts/
  tsconfig.json                 # typecheck config for scripts (Task 1)
  catalog/
    types.ts                    # Catalog/DB types (Task 1)
    model.ts                    # validateCatalog, toDatabaseShape (Task 1)
    model.test.ts
    io.ts                       # loadCatalog, writeCatalog (Task 2)
    import-db.ts                # fromDatabaseShape (pure) (Task 2)
    import-db.test.ts
    fixtures/db-snapshot.json   # fake DB snapshot used by tests (Task 2)
    import.ts                   # CLI (Task 2)
    validate.ts                 # CLI (Task 2)
    sound.ts                    # makeSoundId, checkAudio, buildDownloadUrl, addSoundEntry (Task 3)
    sound.test.ts
    firebase.ts                 # initAdmin, uploadSound, writeDatabase (Task 3)
    add-sound.ts                # CLI (Task 3)
    sync.ts                     # CLI (Task 4)
    parse-issue.ts              # parseIssueBody (pure) + CLI mode (Task 5)
    parse-issue.test.ts
catalog/sounds.json, tags.json, schema.json        (Task 2)
.github/workflows/ci.yml (modify), sync-catalog.yml, sound-request.yml
.github/ISSUE_TEMPLATE/new-sound.yml, request-sound.yml   (delete .github/ISSUE_TEMPLATE.md)
README.md (modify)
```

---

### Task 1: Scaffold, types, validation, DB shape

**Files:**
- Create: `scripts/tsconfig.json`, `scripts/catalog/types.ts`, `scripts/catalog/model.ts`, `scripts/catalog/model.test.ts`
- Modify: `package.json` (dev deps and scripts), `.oxlintrc.json` (add `"overrides"` with `env.node: true` for `scripts/**`)

**Interfaces:**
- Produces (`types.ts`):
  ```ts
  export type CatalogTag = { id: string; slug: string; name: string };
  export type CatalogSound = { id: string; name: string; path: string; tags: string[]; isNew?: boolean };
  export type Catalog = { sounds: CatalogSound[]; tags: CatalogTag[] };
  export type DbSound = { id: string; name: string; path: string; order: number; tags?: Record<string, true>; isNew?: boolean };
  export type DbTag = { id: string; name: string; slug: string; order: number; sounds?: Record<string, true> };
  export type DbShape = { sounds: Record<string, DbSound>; tags: Record<string, DbTag> };
  ```
- Produces (`model.ts`):
  - `validateCatalog(c: Catalog): string[]` returns every error, or `[]`.
  - `toDatabaseShape(c: Catalog): DbShape`

- [ ] **Step 1: Setup.**
  - Run `pnpm add -D firebase-admin music-metadata`.
  - Add scripts to `package.json`:
    - `"sound:add": "node scripts/catalog/add-sound.ts"`
    - `"catalog:validate": "node scripts/catalog/validate.ts"`
    - `"catalog:sync": "node scripts/catalog/sync.ts"`
    - `"catalog:import": "node scripts/catalog/import.ts"`
    - `"typecheck:scripts": "tsc -p scripts/tsconfig.json"`
  - In `"typecheck"`, append `&& tsc -p scripts/tsconfig.json`.
  - Write `scripts/tsconfig.json` with these options: `module: nodenext`,
    `moduleResolution: nodenext`, `target: ESNext`, `strict`, `noEmit`,
    `allowImportingTsExtensions`, `erasableSyntaxOnly`,
    `resolveJsonModule`, `types: ["node"]`, `skipLibCheck`,
    `include: ["catalog"]`.
- [ ] **Step 2: Write the failing tests in `model.test.ts`.** Use this fixture:
  ```ts
  const catalog: Catalog = {
    tags: [{ id: "t1", slug: "movies", name: "Movies" }, { id: "t2", slug: "memes", name: "Memes" }],
    sounds: [
      { id: "s1", name: "A", path: "https://x/a.mp3", tags: ["movies", "memes"], isNew: true },
      { id: "s2", name: "B", path: "https://x/b.mp3", tags: [] },
    ],
  };
  ```
  Tests:
  - `toDatabaseShape builds two-way maps and order`:
    - `sounds.s1` equals `{ id:"s1", name:"A", path:"https://x/a.mp3", order:0, tags:{t1:true,t2:true}, isNew:true }`;
    - `sounds.s2` equals `{ id:"s2", name:"B", path:"https://x/b.mp3", order:1 }` (no `tags` key, no `isNew` key);
    - `tags.t1.sounds` equals `{s1:true}`;
    - `tags.t2.order === 1`.
  - `validateCatalog accepts a valid catalog`: returns `[]`.
  - `validateCatalog reports every error`: a catalogue containing all of the
    following returns exactly 6 errors, each mentioning the offending
    ID or slug:
    - a duplicate sound ID;
    - a duplicate tag ID;
    - a duplicate tag slug;
    - an unknown tag slug `"nope"`;
    - a duplicate path;
    - a tag slug `"Bad Slug"`.
  - `validateCatalog rejects bad fields`: an empty `name`, a path that
    starts with `http://`, and `tags` that is not an array each produce an
    error.
- [ ] **Step 3: Run `pnpm vitest run scripts/catalog/model.test.ts`.** Expected: FAIL (module not found).
- [ ] **Step 4: Implement `types.ts` and `model.ts`.** `validateCatalog`
  takes `unknown`-ish input at runtime, so check `typeof` and
  `Array.isArray` before reading fields. Don't add a schema-library
  dependency.
- [ ] **Step 5: Run the tests, `pnpm typecheck` and `pnpm lint`.** Expected: all pass.
- [ ] **Step 6: Commit.** Message: `feat(catalog): add catalog model, validation and DB shape`.

### Task 2: Catalogue I/O, import (bootstrap), validate CLI, CI step

**Files:**
- Create:
  - `scripts/catalog/io.ts`
  - `scripts/catalog/import-db.ts`
  - `scripts/catalog/import-db.test.ts`
  - `scripts/catalog/fixtures/db-snapshot.json`
  - `scripts/catalog/import.ts`
  - `scripts/catalog/validate.ts`
  - `catalog/schema.json`
  - `catalog/sounds.json`
  - `catalog/tags.json`
- Modify: `.github/workflows/ci.yml` (add the step `- name: Validate catalog` / `run: pnpm catalog:validate` before Test)

**Interfaces:**
- Consumes: the types and `validateCatalog`/`toDatabaseShape` from Task 1.
- Produces:
  - `io.ts`:
    - `CATALOG_DIR: string`, which is the repo-root `catalog`, resolved from `import.meta.dirname`;
    - `loadCatalog(dir = CATALOG_DIR): Promise<Catalog>`;
    - `writeCatalog(c: Catalog, dir = CATALOG_DIR): Promise<void>`, which writes `sounds.json` and `tags.json` only.
  - `import-db.ts`:
    - `fromDatabaseShape(db: { sounds: Record<string, Partial<DbSound>>; tags: Record<string, Partial<DbTag>> }): { catalog: Catalog; repairs: string[] }`.

- [ ] **Step 1: Write the fixture and the failing tests.**
  `fixtures/db-snapshot.json`:
  - 3 tags with `order` values 2, 0, 1;
  - 4 sounds, two of which share `order: 5` and have names "Zebra" and "Alpha";
  - one inconsistency: sound `s3` lists tag `t1`, but `t1.sounds` lacks `s3`.

  Tests:
  - `fromDatabaseShape sorts by order then name`: the sound IDs come out in
    the expected order, and "Alpha" comes before "Zebra".
  - `fromDatabaseShape converts tag maps to slugs and keeps id/name/path/isNew`.
  - `fromDatabaseShape repairs one-sided links with a union`: `s3` has the
    slug of `t1`, and `repairs` has length 1 and mentions `s3` and `t1`.
  - `round trip`: take `toDatabaseShape(fromDatabaseShape(snapshot).catalog)`,
    remove the `order` fields from both it and the snapshot, then
    add the repaired link to the snapshot. The two deep-equal.
  - `io round trip`: in a temp dir, `writeCatalog` then `loadCatalog`
    returns an equal catalogue, and each file ends with `"\n"`.
- [ ] **Step 2: Run `pnpm vitest run scripts/catalog/import-db.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement `io.ts` and `import-db.ts`.**
- [ ] **Step 4: Implement the CLIs.**
  - `import.ts` fetches `${VITE_APP_FIREBASE_DATABASE_URL}/sounds.json` and
    `/tags.json`, calls `fromDatabaseShape`, prints each repair and then
    `Imported N sounds, M tags`, and calls `writeCatalog`. If any existing
    path contains `token=`, it prints `Paths use download tokens`;
    otherwise it prints `Paths are tokenless`.
  - `validate.ts` loads the catalogue and prints each error from
    `validateCatalog`. It exits with code 1 if there are any errors, and
    otherwise prints `Catalog OK: N sounds, M tags`.
- [ ] **Step 5: Write `catalog/schema.json`.** It's a JSON Schema (draft
  2020-12) with `$defs` `sound` and `tag` mirroring §4 of the spec. It's used
  only for editor autocomplete: don't add `$schema` keys to the data files,
  because they're arrays.
- [ ] **Step 6: Create the real catalogue.** Copy `.env.dist` to `.env`
  with a real `VITE_APP_FIREBASE_DATABASE_URL` (ask the maintainer for it),
  then run `node --env-file=.env scripts/catalog/import.ts`. Expected: it
  prints the repairs and the counts, and creates `catalog/sounds.json` and
  `catalog/tags.json`.
  **If the URL isn't available or the DB isn't reachable:** stop and ask
  the maintainer to run this one command locally and commit the output.
  Don't invent catalogue data.
- [ ] **Step 7: Run `pnpm catalog:validate`, the tests and `pnpm lint`.** Expected: `Catalog OK: …`, and everything passes.
- [ ] **Step 8: Commit.** Message: `feat(catalog): import catalog from DB and validate in CI`.

### Task 3: Add-sound core, Firebase I/O, add-sound CLI

**Files:**
- Create: `scripts/catalog/sound.ts`, `scripts/catalog/sound.test.ts`, `scripts/catalog/firebase.ts`, `scripts/catalog/add-sound.ts`

**Interfaces:**
- Consumes: `Catalog`, `validateCatalog`, `loadCatalog`, `writeCatalog`.
- Produces (`sound.ts`, all pure apart from `checkAudio`'s parsing):
  - `slugify(name: string): string`, which converts Polish diacritics to
    ASCII (ą→a, ć→c, ę→e, ł→l, ń→n, ó→o, ś→s, ź→z, ż→z, case-insensitive)
    and collapses anything else to `-`;
  - `makeSoundId(name: string, sha256: string): string`;
  - `checkAudio(bytes: Uint8Array, parse = parseBuffer): Promise<{ durationSec: number }>`, which throws an `Error` with a readable message. `parse` is injectable for tests;
  - `buildDownloadUrl(bucket: string, objectName: string, token?: string): string`, which builds
    `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectName)}?alt=media` plus `&token=${token}` when a token is given;
  - `usesDownloadTokens(c: Catalog): boolean`, which is true if any path contains `token=`;
  - `addSoundEntry(c: Catalog, entry: { id: string; name: string; path: string; tags: string[]; isNew?: boolean }): Catalog`, which returns a new catalogue with the entry appended and throws on an unknown tag, a duplicate ID or a duplicate path.
- Produces (`firebase.ts`):
  - `initAdmin(): void`, which reads the credential env vars and calls `initializeApp` with `storageBucket` and `databaseURL`;
  - `uploadSound(bytes: Uint8Array, sha256: string, withToken: boolean): Promise<string>`, which returns the download URL. It skips the upload if `sounds/<sha256>.mp3` already exists; in that case it reuses the existing token from metadata, or sets a new `crypto.randomUUID()` in `metadata.metadata.firebaseStorageDownloadTokens`.
  - `writeDatabase(db: DbShape): Promise<void>`, which calls `ref('/sounds').set` and then `ref('/tags').set`.

- [ ] **Step 1: Write the failing tests in `sound.test.ts`.**
  - `makeSoundId("Żółć gęślą", "abcdef0123…")` returns `"zolc-gesla-abcdef"`.
  - `makeSoundId("!!!", "abcdef…")` returns `"sound-abcdef"` (Review Focus 1).
  - `makeSoundId("  No i co?  ", "123456…")` returns `"no-i-co-123456"`.
  - `buildDownloadUrl("b.appspot.com", "sounds/x.mp3")` returns
    `"https://firebasestorage.googleapis.com/v0/b/b.appspot.com/o/sounds%2Fx.mp3?alt=media"`, and with the token `"t"` it ends `&token=t`.
  - `addSoundEntry` cases:
    - It appends at the end and doesn't mutate the input.
    - An unknown tag throws a message containing `Unknown tag "nope". Valid tags: movies, memes`.
    - A duplicate ID throws.
    - A duplicate path throws `duplicate of s1` (Review Focus 5).
  - `checkAudio` cases:
    - It rejects `new Uint8Array(1_048_577)` with a message containing `1 MB`.
    - It rejects random non-audio bytes with `not an MP3`.
    - It accepts a tiny valid mp3. Commit a short fixture, `fixtures/silence.mp3`, made with
      `ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t 0.5 -q:a 9 scripts/catalog/fixtures/silence.mp3`.
      If ffmpeg isn't installed, `apt-get install -y ffmpeg` first.
    - Duration over 30 s is checked by stubbing the duration. Expose
      `checkAudio(bytes, parse = parseBuffer)` so tests can inject a fake
      parser that returns `{ format: { container: "MPEG", codec: "MPEG 1 Layer 3", duration: 31 } }`,
      and assert the error contains `30 s`.
- [ ] **Step 2: Run `pnpm vitest run scripts/catalog/sound.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement `sound.ts`.** `checkAudio` uses `parseBuffer` from
  `music-metadata` and accepts audio when `format.codec` matches
  `/MPEG.*Layer 3/i` or `format.container` is `"MPEG"` with codec layer 3.
  It catches parser errors and rethrows them as `not an MP3`.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Implement `firebase.ts` and `add-sound.ts`.** No unit tests:
  this is thin I/O, per spec §8.
  - **CLI arguments** are parsed with `node:util` `parseArgs`: a positional
    `<file|url>`, `--name` (required), `--tags` (comma-separated, trimmed,
    lower-cased, empty entries dropped) and `--new` (boolean).
  - **Flow:**
    1. Read the bytes. For a URL, use `fetch` and check `res.ok`.
    2. Call `checkAudio` and compute the sha256 with `node:crypto`.
    3. Load the catalogue.
    4. Pre-check the ID and tags with `addSoundEntry` and a placeholder
       path. This fails fast before uploading.
    5. Call `initAdmin` and `uploadSound(bytes, sha, usesDownloadTokens(catalog))`.
    6. Call `addSoundEntry` with the real path. It catches a duplicate path.
    7. Run `validateCatalog`, then `writeCatalog`.
    8. Print the entry as JSON, then the line `Listen: <url>`.
  - **Errors** print `Error: <message>` to stderr and exit 1.
  - **Output:** when `GITHUB_OUTPUT` is set, append `id=`, `name=` and
    `url=` lines to it.
- [ ] **Step 6: Run `pnpm typecheck`, `pnpm lint` and `pnpm vitest run`.** Expected: all pass.
- [ ] **Step 7: Commit.** Message: `feat(catalog): add sound:add CLI with Storage upload`.

### Task 4: Sync CLI and workflow

**Files:**
- Create: `scripts/catalog/sync.ts`, `.github/workflows/sync-catalog.yml`

**Interfaces:**
- Consumes: `loadCatalog`, `validateCatalog`, `toDatabaseShape`, `initAdmin`, `writeDatabase`.

- [ ] **Step 1: Implement `sync.ts`.** It loads the catalogue and validates
  it, exiting 1 with the errors if invalid. Then it calls `initAdmin()` and
  `writeDatabase(toDatabaseShape(c))`, and prints
  `Synced N sounds, M tags`. It accepts `--dry-run`, which prints the
  shape's counts and the first sound's JSON and skips Firebase.
- [ ] **Step 2: Run `pnpm catalog:sync --dry-run`.** Expected: the counts and one sound object, with no Firebase calls.
- [ ] **Step 3: Write `sync-catalog.yml`.**
  - It has the triggers, environment, permissions and concurrency from spec §6.3.
  - Its steps are checkout, pnpm/action-setup@v4, setup-node (with
    `.nvmrc` and the pnpm cache), `pnpm install --frozen-lockfile` and
    `pnpm catalog:sync`.
  - Set this `env` on the sync step:
    - `FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}`
    - `VITE_APP_FIREBASE_STORAGE_BUCKET: ${{ vars.VITE_APP_FIREBASE_STORAGE_BUCKET }}`
    - `VITE_APP_FIREBASE_DATABASE_URL: ${{ vars.VITE_APP_FIREBASE_DATABASE_URL }}`
- [ ] **Step 4: Lint the workflow.** Run `pnpm dlx @action-validator/cli .github/workflows/sync-catalog.yml`, or use `actionlint` if it's available. Expected: no errors.
- [ ] **Step 5: Commit.** Message: `feat(catalog): sync catalog to Realtime DB on merge`.

### Task 5: Issue parsing, issue forms and the sound-request workflow

**Files:**
- Create:
  - `scripts/catalog/parse-issue.ts`
  - `scripts/catalog/parse-issue.test.ts`
  - `.github/ISSUE_TEMPLATE/new-sound.yml`
  - `.github/ISSUE_TEMPLATE/request-sound.yml`
  - `.github/workflows/sound-request.yml`
- Delete: `.github/ISSUE_TEMPLATE.md`

**Interfaces:**
- Produces:
  - `parseIssueBody(body: string): { name: string; tags: string[]; isNew: boolean; url: string }`, which throws an `Error` listing every missing or invalid field;
  - `isAllowedAttachmentUrl(url: string): boolean`.
  - CLI mode: `node scripts/catalog/parse-issue.ts` reads `process.env.ISSUE_BODY` and writes `name`, `tags` (comma-joined), `new` (`true`/`false`) and `url` to `$GITHUB_OUTPUT`. Multi-line-safe values aren't needed, because all four are single-line. It rejects a newline in the name.
- The section headings it parses are the form's field `label`s, and they must match exactly: `Name`, `Tags`, `Mark as new`, `Audio file`.

- [ ] **Step 1: Write the failing tests in `parse-issue.test.ts`.** The fixture body is exactly what GitHub renders for the form:
  ```
  ### Name\n\nNo i co?\n\n### Tags\n\n Movies, memes ,\n\n### Mark as new\n\n- [X] Show the "new" badge\n\n### Audio file\n\n[clip.mp3](https://github.com/user-attachments/files/123/clip.mp3)
  ```
  Tests:
  - The fixture parses to `{ name:"No i co?", tags:["movies","memes"], isNew:true, url:"https://github.com/user-attachments/files/123/clip.mp3" }`.
  - The same body with `\r\n` line endings parses identically (Review Focus 2).
  - Unchecked `- [ ]` gives `isNew: false`.
  - When Tags is `_No response_`, it throws `Tags`. When both Name and Audio file are missing, the error mentions both (Review Focus 2).
  - The audio field can be a bare URL or `<a href="https://github.com/user-attachments/assets/abc">`, and both are extracted (Review Focus 3).
  - Audio `[x.mp3](https://evil.example/x.mp3)` throws `not an allowed attachment URL` (Review Focus 3).
  - `isAllowedAttachmentUrl` returns true for
    `https://objects.githubusercontent.com/x` and false for:
    - `https://github.com/holokron/yogi-play/raw/x.mp3`
    - `https://github.com.evil.io/user-attachments/x`
    - `http://github.com/user-attachments/x`
- [ ] **Step 2: Run `pnpm vitest run scripts/catalog/parse-issue.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement `parse-issue.ts`.** Normalize `\r\n` to `\n`,
  split on `^### ` headings, and trim each section. Treat `_No response_`
  as empty. Run the CLI mode only when the file is the entry point
  (`import.meta.main`).
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Write the issue forms.**
  - `new-sound.yml`:
    - name "New sound (maintainers)", `labels: []`;
    - description: "Attach a trimmed MP3 (≤ 1 MB, ≤ 30 s). A maintainer applies `sound:approved` to publish.";
    - fields:
      - `input` labelled `Name`, required;
      - `input` labelled `Tags`, required, with the description "Comma-separated tag slugs, e.g. movies, memes";
      - `checkboxes` labelled `Mark as new` with the option `Show the "new" badge`;
      - `textarea` labelled `Audio file`, required, with the description "Drag and drop the .mp3 here".
  - `request-sound.yml`:
    - name "Request a sound";
    - fields: a `Link to sound (with time stamp)` input and a `Time stamps` textarea (e.g. `0:15-0:25`).
  - Delete `.github/ISSUE_TEMPLATE.md`.
- [ ] **Step 6: Write `sound-request.yml`.**
  - It has the trigger, the condition `if: github.event.label.name == 'sound:approved'`, and the environment, permissions and concurrency from spec §6.2.
  - Its job `env` contains `ISSUE_BODY: ${{ github.event.issue.body }}`,
    `ISSUE_NUMBER`, `GH_TOKEN: ${{ github.token }}`, the Firebase
    secret and the two variables. Shell steps refer to these only as
    `"$VAR"`, never as `${{ }}` inside `run:`.
  - Steps:
    1. Checkout, then pnpm and Node setup, then install.
    2. Step `parse` (`id: parse`) runs `node scripts/catalog/parse-issue.ts`.
    3. Step `add` (`id: add`) runs `pnpm sound:add "$URL" --name "$NAME" --tags "$TAGS" $NEW_FLAG`.
       The step's `env` maps the parse outputs to `URL`, `NAME`, `TAGS`, and to
       `NEW_FLAG` (`--new` or empty).
    4. `pnpm catalog:validate`.
    5. Run the branch-and-PR script. Its step `env` maps `NAME: ${{ steps.parse.outputs.name }}`, `SOUND_ID: ${{ steps.add.outputs.id }}` and `SOUND_URL: ${{ steps.add.outputs.url }}`:
       ```bash
       git config user.name "github-actions[bot]"
       git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
       BRANCH="sound/issue-$ISSUE_NUMBER"
       git checkout -B "$BRANCH"
       git add catalog/sounds.json
       git commit -m "feat(sounds): add \"$NAME\"" -m "Closes #$ISSUE_NUMBER"
       git push --force origin "$BRANCH"
       PR=$(gh pr list --head "$BRANCH" --state open --json number -q '.[0].number')
       if [ -z "$PR" ]; then gh pr create --head "$BRANCH" --title "feat(sounds): add \"$NAME\"" --body-file pr-body.md; else gh pr edit "$PR" --body-file pr-body.md; fi
       ```
       Write `pr-body.md` beforehand, with `Closes #N`, `Listen: <url>`
       and the entry JSON from `jq --arg id "$SOUND_ID" '.[] | select(.id == $id)' catalog/sounds.json`. This covers Review Focus 4.
    6. An `if: failure()` step comments with `gh issue comment "$ISSUE_NUMBER" --body "..."`,
       linking to the run URL `$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID`,
       and then runs `gh issue edit "$ISSUE_NUMBER" --remove-label sound:approved`.
- [ ] **Step 7: Lint the workflows.** Run the same validator on `sound-request.yml`. Also run `grep -n '\${{ *github.event.issue' .github/workflows/sound-request.yml`, which may only match inside `env:` blocks.
- [ ] **Step 8: Run `pnpm vitest run`, `pnpm lint` and `pnpm typecheck`.** Expected: all pass.
- [ ] **Step 9: Commit.** Message: `feat(catalog): add sound issue form and request workflow`.

### Task 6: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a "Managing sounds" section to the README.** It should cover:
  - **Adding a sound:** through the issue form, then labelling it
    `sound:approved`, then merging the PR; or locally with
    `node --env-file=.env scripts/catalog/add-sound.ts ./clip.mp3 --name "…" --tags a,b --new`,
    with `GOOGLE_APPLICATION_CREDENTIALS` set.
  - **Editing, reordering or deleting** by editing `catalog/sounds.json` in a PR. Deleted files stay in Storage.
  - **New tags:** add them to `catalog/tags.json`.
  - **One-time setup:**
    - the `production` environment, with the `FIREBASE_SERVICE_ACCOUNT` secret (Storage Object Admin and RTDB write) and the two variables;
    - the `sound:approved` label;
    - RTDB rules that make `/sounds` and `/tags` read-only for clients.
  - **Rule:** never edit sounds or tags in the Firebase console.

  While you're there, fix the stale `npm` commands in the README to use
  `pnpm`. This keeps the doc accurate next to the new `pnpm` commands.
- [ ] **Step 2: Commit.** Message: `docs: document sound catalog workflow`.

### Task 7: Cutover (the maintainer runs this with the implementer)

There are no code changes in this task. It follows spec §9, steps 3–5.

- [ ] **Step 1: The maintainer sets up GitHub.** They create the
  `production` environment, its secret and its variables, plus the
  `sound:approved` label.
- [ ] **Step 2: Merge the PR.** Then confirm that the `sync-catalog` run is
  green and that `/sounds` and `/tags` in the console differ only in their
  renumbered `order` values.
- [ ] **Step 3: Test end to end.**
  1. Open a "New sound" issue with a real mp3 and label it. Check that the
     PR opens with a working listen link.
  2. Remove the label and apply it again. The same PR should be updated,
     not duplicated.
  3. Merge the PR, check that the sync runs, and check that the sound
     appears on yogi-play.pl.
