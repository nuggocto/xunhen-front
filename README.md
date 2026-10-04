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

### When xunhen publishes a release

Update the site only after the release and each channel it names are
public and tested, in this order:

1. Add `src/content/changelog/X.Y.Z.md` with the tag's section of
   `CHANGELOG.md`, the date the GitHub release was published, and its
   release URL.
2. Remove those notes from `unreleased.md`, or delete the file when nothing
   remains unreleased.
3. On the home page, replace "No release has been published yet" and the
   build-from-clone fallback with the channels that are live: the release
   archive, the tagged Nix flake, and the AUR package once its recipe is
   published.
4. Use the released version in every command and link. Never write a date,
   version, or download that no published tag has.
5. Run `pnpm run build`, look at the branch's preview deployment, then push
   to `shrek`.

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
applied. GitHub Actions (`.github/workflows/ci.yml`) runs the same install
and build on every push and pull request.

### Domain

`xunhen.org` is a zone in the same Cloudflare account, on Cloudflare's
nameservers (`alfred.ns.cloudflare.com` and `dara.ns.cloudflare.com`). It is
attached to the Pages project as a custom domain, which created its DNS
record and its certificate; Cloudflare renews the certificate and redirects
HTTP to HTTPS. `www.xunhen.org` does not exist. To add it, attach it as a
second custom domain and redirect it to `https://xunhen.org` so the apex
stays the one canonical address.

### Roll back

A rollback serves an earlier production deployment again without a build.
In the dashboard: Workers & Pages, `xunhen-front`, Deployments, then
"Rollback to this deployment" on the one to restore. From a shell:

```sh
pnpm dlx wrangler pages deployment list --project-name xunhen-front
curl -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/xunhen-front/deployments/$DEPLOYMENT_ID/rollback"
```

The change is live within seconds; rolling forward is a rollback to the
newer deployment. A rollback does not change `shrek`, and the next push
deploys again, so fix the cause in git as well. Tested on 2026-10-04: back
from `b59e6a8` to `82fb750` and forward again, each live within 15 seconds.

### Correct a stale release link

Install links and release notes live in this repository, not in the
application's release. To correct a wrong version, link, or note, edit the
page or `src/content/changelog/`, check it with `pnpm run build`, and push
to `shrek`; the site updates without a new xunhen release. If a bad
deployment is already live, roll back first, then push the fix.

## Credits

寻痕 is drawn from Ma Shan Zheng, outlined to paths in
`src/components/Brush.astro` and `public/favicon.svg`. Prose is set in
Newsreader and terminal text in IBM Plex Mono, served from this site through
Fontsource. All three typefaces are under the SIL Open Font License 1.1.

The site's code is under the MIT License; see `LICENSE`.
