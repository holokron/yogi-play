<p align="center">
  <a href="https://yogi-play.pl">
    <img src="./public/icons/icon-192x192.png">
  </a>
</p>

# <p align="center">Yogi PLAY</p>

[![CI](https://github.com/holokron/yogi-play/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/holokron/yogi-play/actions/workflows/ci.yml)

Simple React JS app that plays funny sounds :)

## Install

```bash
pnpm install
```

## Develop

```bash
pnpm dev
```

## Build for production

```bash
pnpm build
```

## Managing sounds

Sound and tag metadata lives in [`catalog/`](./catalog). It is the source of truth:
`catalog/sounds.json` and `catalog/tags.json` are arrays whose order is the display order.
MP3 files live in Firebase Storage. On every merge to `master` that touches `catalog/`,
the **Sync catalog** workflow writes `/sounds` and `/tags` to the Realtime Database.
**Never edit sounds or tags in the Firebase console**; the next sync overwrites it.

### Add a sound (GitHub)

1. Open a **New sound** issue, fill in name and tags (slugs from `catalog/tags.json`),
   and drag a trimmed MP3 (max 1 MB, max 30 s) into the _Audio file_ field.
2. A maintainer applies the `sound:approved` label. CI uploads the file and opens a PR
   with a listen link. If something is wrong, CI comments on the issue; fix it and
   apply the label again.
3. Listen, adjust the entry in the PR if needed, and merge.

### Add a sound (locally)

```bash
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json \
  node --env-file=.env scripts/catalog/add-sound.ts ./clip.mp3 --name "No i co?" --tags movies,memes --new
```

Then commit `catalog/sounds.json` and open a PR.

### Edit, reorder, delete

Edit `catalog/sounds.json` in a PR (the GitHub web editor is fine). Moving an entry changes
its position on the site. Deleting an entry leaves its file in Storage. New tags are added to
`catalog/tags.json`. Run `pnpm catalog:validate` to check your changes (CI does too).

### One-time setup

- A GitHub environment named `production` with:
  - secret `FIREBASE_SERVICE_ACCOUNT`: JSON key of a service account with
    _Storage Object Admin_ on the bucket and write access to the Realtime Database;
  - variables `VITE_APP_FIREBASE_STORAGE_BUCKET` and `VITE_APP_FIREBASE_DATABASE_URL`.
- A label named `sound:approved`.
- _Settings → Actions → General → Allow GitHub Actions to create and approve pull requests_ enabled.
- Realtime Database rules that make `/sounds` and `/tags` read-only for clients.
- Bootstrap the catalog once from the live database:
  `node --env-file=.env scripts/catalog/import.ts`, then review and commit `catalog/`.

## Built with

- [Typescript](https://www.typescriptlang.org/) - Strict syntactical superset of JavaScript
- [React](https://reactjs.org/) - JavaScript UI library
- [Bootstrap](https://getbootstrap.com/) - Front-end component library
- [Firebase](https://firebase.google.com/) - Simple and free cloud provider

## To do

- [x] Favourites functionality
- [x] User requests functionality
- [x] Sounds search

## Contributing

Feel free to submit pull requests
