# xunhen-front

The website for [xunhen](https://github.com/nuggocto/xunhen) at
<https://xunhen.org>: a landing page and the release changelog. It is a
static [Astro](https://astro.build) site that Cloudflare Pages builds and
serves. It never runs xunhen and never accepts anyone's undo files.

## Develop

You need Node.js 24 (`.node-version`) and pnpm 11.3.0, the version
`packageManager` in `package.json` names; `corepack enable` provides it.

```sh
pnpm install --frozen-lockfile
pnpm run dev       # http://localhost:4321, reloads on save
pnpm run build     # astro check, then the static site in dist/
pnpm run preview   # serves dist/
```

Dependencies may not run install scripts unless `pnpm-workspace.yaml`
allows them; none currently needs one.

`pnpm run build` fails on a type error or on release notes whose metadata
does not validate.

## What is where

```text
src/pages/            index (/), changelog (/changelog/), 404
src/components/       Browse: the replica of xunhen browse; Transcript: a command and xunhen's real output;
                      Command: copyable commands; Brush: 寻痕
src/layouts/Base.astro  header tabs, footer, page metadata
src/styles/global.css   colours, type, sizes, the shared two-column layout
src/content/changelog/  one Markdown file per release
public/_headers         Content-Security-Policy and other headers for Cloudflare Pages
```

The page uses no colour, as xunhen's terminal browser uses none: emphasis
is bold, faint, or reverse video, and reverse video always marks the
current selection. It uses three typefaces and three font sizes.

The screen in `Browse.astro` and the transcripts on the home page are
xunhen's own output for
`testdata/undo/abandoned-branch` in the xunhen repository, the screen at 96
by 12. If xunhen changes what it prints, capture it again rather than
editing the text by hand.

## Release notes

Each release is a file in `src/content/changelog/`, named for its version,
with its notes copied from the application's `CHANGELOG.md` for the
published tag:

```markdown
---
version: X.Y.Z
date: YYYY-MM-DD
release: https://github.com/nuggocto/xunhen/releases/tag/vX.Y.Z
---

### Added

- ...
```

`unreleased.md` holds notes that are in no release yet; it has no date.
Notes come from published tags only, and the site never fetches release
data in the visitor's browser.

## Deploy

Cloudflare Pages builds this repository:

| Setting | Value |
| --- | --- |
| Pages project | `xunhen-front` |
| GitHub repository | `nuggocto/xunhen-front` |
| Production branch | `shrek` |
| Build command | `pnpm run build` |
| Build output directory | `dist` |
| Root directory | the repository root |
| Node.js version | from `.node-version` |
| pnpm version | `PNPM_VERSION=11.3.0` in production and preview environments |

Keep `PNPM_VERSION` in sync with `packageManager` in `package.json`.
The custom domain is `xunhen.org`; the Pages address is
<https://xunhen-front.pages.dev>.

Every other branch and pull request gets a preview deployment. Pages
applies `public/_headers`, which also keeps every `pages.dev` address out of
search results, so only `xunhen.org` is indexed. The site needs no adapter
and no Pages Functions.

`pnpm dlx wrangler pages dev dist` serves a build locally with those headers
applied.

## Credits

寻痕 is drawn from Ma Shan Zheng, outlined to paths in
`src/components/Brush.astro` and `public/favicon.svg`. Prose is set in
Newsreader and terminal text in IBM Plex Mono, served from this site through
Fontsource. All three typefaces are under the SIL Open Font License 1.1.

The site's code is under the MIT License; see `LICENSE`.
