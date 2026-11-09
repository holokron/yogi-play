# Sound Catalog in Git — Design

- **Date:** 2026-11-09
- **Status:** Approved design, pending implementation plan

## 1. Goal

Make the git repository the single source of truth for sound and tag metadata,
so adding, editing, reordering or removing a sound is a reviewable change on
GitHub. Nobody edits sounds or tags in the Firebase console any more.

**Success criteria**

- A maintainer adds a sound by filling in a GitHub issue form, labelling it
  `sound:approved`, and merging the PR that CI opens. No local tooling is
  needed.
- The same operation can be run locally via `pnpm sound:add`.
- After a merge to `master`, the live app shows the change without a redeploy.
- Existing users' favourites keep working: sound IDs are preserved.

## 2. Current state

- The app fetches `${databaseURL}/sounds.json` and `/tags.json` from the
  Firebase Realtime Database REST API at runtime (`src/store/index.ts`).
- mp3 files live in **Firebase Storage**; `Sound.path` holds their download
  URLs.
- Sounds and tags reference each other through two-way maps
  (`Sound.tags: {tagId: true}`, `Tag.sounds: {soundId: true}`), maintained
  by hand. Order is set by hand-maintained `order` fields.
- No snapshot of the database is committed.
- There is no automated deploy. CI (`.github/workflows/ci.yml`) runs lint,
  tests and the build only.

## 3. Decisions

| Topic | Decision |
|---|---|
| Audio source | A ready, trimmed mp3 is supplied. CI never downloads or cuts audio from links. |
| Audio storage | It stays in **Firebase Storage**. CI and the script upload there. |
| Metadata | It lives in `catalog/*.json` in the repo. |
| How the app sees changes | CI **syncs the catalogue to the Realtime DB** on merge. The app code is unchanged. |
| Intake | **Approach 3:** a GitHub issue form plus a CI workflow, and the same script runnable locally. |

## 4. Catalogue format

```
catalog/
  sounds.json
  tags.json
  schema.json   # JSON Schema for both files (editor autocomplete + validation)
```

`catalog/tags.json` is an array whose position is the display order:

```json
[{ "id": "-Labc123", "slug": "movies", "name": "Movies" }]
```

`catalog/sounds.json` is an array whose position is the display order:

```json
[
  {
    "id": "-Lxyz789",
    "name": "No i co?",
    "path": "https://firebasestorage.googleapis.com/.../sounds%2F3f9a....mp3?alt=media",
    "tags": ["movies"],
    "isNew": true
  }
]
```

Rules:

- `id`: required and unique. Existing sounds keep their Firebase push IDs.
  New sounds get `<slugified-name>-<first 6 hex chars of the file's sha256>`.
- `name`: a required, non-empty string.
- `path`: a required https URL.
- `tags`: an array of tag slugs. Each must exist in `tags.json`, and the
  array may be empty.
- `isNew`: an optional boolean.
- Tag `id` and `slug` are both unique. `slug` matches `^[a-z0-9-]+$`.
- Order is the array index. The hand-maintained `order` field is no longer
  stored in the catalogue.

### Database shape (generated)

`toDatabaseShape(catalog)` produces exactly what the app already reads:

- `/sounds/{id}`: `{ id, name, path, order: index, tags: {tagId: true}, isNew? }`
- `/tags/{id}`: `{ id, name, slug, order: index, sounds: {soundId: true} }`

The `tags` and `sounds` maps are left out when empty. `Sound.tags` keys are
tag **IDs** (resolved from slugs).

## 5. Scripts

These are TypeScript files run directly by Node 26 (native type stripping), so
there's no build step. Shared logic lives in `scripts/catalog/lib.ts`.

New dev dependencies are:

- `firebase-admin`, for Storage uploads and RTDB writes;
- `music-metadata`, for checking audio format and duration in pure JavaScript.

| Command | File | Purpose |
|---|---|---|
| `pnpm sound:add <file\|url> --name <n> --tags <a,b> [--new]` | `scripts/catalog/add-sound.ts` | Validate, upload and add an entry. |
| `pnpm catalog:validate` | `scripts/catalog/validate.ts` | Offline validation of `catalog/`. |
| `pnpm catalog:sync` | `scripts/catalog/sync.ts` | Write `/sounds` and `/tags` to the RTDB. |
| `pnpm catalog:import` | `scripts/catalog/import.ts` | One-time bootstrap from the live DB. |
| (used by CI) | `scripts/catalog/parse-issue.ts` | Turn an issue-form body into `add-sound` arguments. |

### `add-sound` behaviour

1. Load the input. If the input is a URL, download it to a temp file.
2. Check the audio with `music-metadata`. It must be MPEG layer 3 audio, at
   most 1 MB, and at most 30 s long. Any other input is rejected with a clear
   message.
3. Resolve the tags. Any unknown slug is an error that lists the valid slugs.
   New tags are added by editing `tags.json` in the same PR.
4. Compute the sha256 and upload to Storage at `sounds/<sha256>.mp3` with
   `contentType: audio/mpeg`. If the object already exists, the upload is
   skipped. The path is the Firebase download URL, as for existing sounds.
5. Generate the ID. If it collides with an existing ID, fail. If the same path
   is already in the catalogue, fail with "duplicate of <id>".
6. Append the entry to `sounds.json`, so new sounds go last, and write the file
   in stable, 2-space-indented formatting.
7. Print the new entry and its listen URL.

Credentials come from `FIREBASE_SERVICE_ACCOUNT` (JSON string) if it's set.
Otherwise they come from `GOOGLE_APPLICATION_CREDENTIALS`. The Storage bucket
and database URL come from `VITE_APP_FIREBASE_STORAGE_BUCKET` and
`VITE_APP_FIREBASE_DATABASE_URL`, the same variables the app uses.

### `validate`

This check runs offline, so it needs no secrets. It checks the schema, unique
sound IDs, unique tag IDs and slugs, that every referenced tag exists, and
that no two sounds share a path. On failure it exits non-zero, listing every
error, not just the first.

### `sync`

This step runs `validate` first, then `toDatabaseShape`, then
`db.ref('/sounds').set(...)` and `db.ref('/tags').set(...)`. Each `set` is a
full replace. It never touches `/users`.

### `import` (bootstrap)

1. Read `/sounds.json` and `/tags.json` from the public REST endpoint, with no
   credentials.
2. Sort by the existing `order`, breaking ties by name.
3. Combine `Sound.tags` and `Tag.sounds` into a single `tags: [slug]` list per
   sound. Where they disagree, take the union and print every repair made.
4. Keep `id`, `name`, `path` and `isNew` exactly.
5. Write the catalogue files.

## 6. GitHub workflows

### 6.1 `ci.yml` (modified)

Add the step `pnpm catalog:validate`.

### 6.2 `sound-request.yml` (new)

- **Trigger:** `issues: [labeled]`, where `label.name == 'sound:approved'`.
  Only users with triage access or higher can apply labels, and that is the
  authorization gate.
- **Environment:** `production`, which holds the secret.
- **Permissions:** `contents: write`, `pull-requests: write`,
  `issues: write`.
- **Concurrency:** `sound-request-${{ issue.number }}`.
- **Steps:**
  1. Check out, then set up pnpm and Node, then `pnpm install --frozen-lockfile`.
  2. `parse-issue.ts` reads the body from `env.ISSUE_BODY`. The body is never
     interpolated into a `run:` script.
  3. Extract the name, tags, the "new" flag and the attachment URL. The URL's
     host must be `github.com` with path prefix `/user-attachments/`, or a
     `*.githubusercontent.com` host. Anything else is rejected.
  4. `pnpm sound:add <url> ...`, then `pnpm catalog:validate`.
  5. Create branch `sound/issue-<N>`, commit, push, and open a PR titled
     `feat(sounds): add "<name>"` whose body contains `Closes #<N>`, the
     listen URL and the entry.
  6. **On failure:** comment the error on the issue and remove the
     `sound:approved` label, so the maintainer can fix the issue and label it
     again.

PRs opened with `GITHUB_TOKEN` do not trigger other workflows, so `ci.yml`
won't run on them. Step 4 runs validation for that reason. Full CI on bot PRs
would need a GitHub App token or a personal access token, and that's out of
scope.

### 6.3 `sync-catalog.yml` (new)

- **Triggers:** `push` to `master` with `paths: ['catalog/**']`, plus
  `workflow_dispatch`.
- **Environment:** `production`.
- **Permissions:** `contents: read`.
- **Concurrency:** `sync-catalog`, with `cancel-in-progress: false`.
- **Step:** `pnpm catalog:sync`.

### 6.4 Issue templates

`.github/ISSUE_TEMPLATE.md` is replaced by:

- `.github/ISSUE_TEMPLATE/new-sound.yml` (issue form). It has these fields:
  - Name (input, required);
  - Tags (input, comma-separated slugs, required);
  - Mark as new (checkbox);
  - Audio file (textarea, required, for a drag-and-drop mp3 attachment).

  The template's description says that a maintainer must apply
  `sound:approved`.
- `.github/ISSUE_TEMPLATE/request-sound.yml`: a public request form with a
  link and timestamps, the same content as today. CI never processes it.

## 7. Secrets and setup

- **GitHub environment `production`:** holds the secret
  `FIREBASE_SERVICE_ACCOUNT`, the JSON key of a service account with
  Storage Object Admin on the bucket and write access to the Realtime DB.
  The same environment holds the variables `VITE_APP_FIREBASE_STORAGE_BUCKET`
  and `VITE_APP_FIREBASE_DATABASE_URL`.
- **Label:** `sound:approved`.
- **RTDB rules:** clients must have read-only access to `/sounds` and `/tags`.
  The maintainer confirms this, because the rules are not in the repo.

## 8. Testing

These are vitest unit tests that run in the existing `pnpm vitest run`:

- `toDatabaseShape`: order, two-way maps, and empty maps left out.
- `validate`: each rule, including reporting every error.
- `parse-issue`: a real issue-form body, missing fields, a rejected
  attachment host, and tag whitespace or case.
- ID generation: slugifying Polish diacritics, and appending the hash.
- `import` round trip: building the catalogue from a fixture DB snapshot and
  then applying `toDatabaseShape` equals the snapshot, ignoring derived
  `order` values. A second fixture covers the union repair.

Storage and DB I/O are kept behind thin functions and are not unit-tested.
They are verified manually during cutover.

## 9. Cutover

1. Run `pnpm catalog:import` locally and review the printed repairs.
2. Open a PR containing the scripts, the workflows, the templates and the
   imported `catalog/`. CI validates it.
3. Before merging, create the `production` environment, its secret and
   variables, and the `sound:approved` label.
4. Merge. `sync-catalog` runs. Confirm in the Firebase console that `/sounds`
   and `/tags` are unchanged apart from `order` being renumbered from 0.
5. Test it end to end: add one sound through the issue form, merge it, and
   check that it appears on yogi-play.pl.
6. From now on, sounds and tags are no longer edited in the Firebase console.

## 10. Docs

Add a "Managing sounds" section to the README covering:

- adding a sound through an issue or with `pnpm sound:add`;
- editing, reordering or deleting a sound by editing `catalog/sounds.json` in
  a PR;
- the one-time setup described in section 7.

## 11. Out of scope

- Cutting audio from links in CI.
- Moving mp3s into git, or bundling the catalogue into the app.
- Automated cleanup of orphaned Storage objects, which come from closed PRs
  and deleted sounds.
- Automated Hosting deploys, and full CI on bot-opened PRs.
