# Portfolio

Next.js 16 · TypeScript · Tailwind 4 · three.js. Light and dark themes, project
data pulled from the GitHub API on the server.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run build` produces the production build; `npm run lint` and
`npx tsc --noEmit` both pass clean, so keep them that way.

The first build downloads Archivo and JetBrains Mono from Google and self-hosts
them, so it needs network access once.

## Deploy

Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new).
Vercel detects Next.js and needs no configuration. Every push to `main`
redeploys.

Two things to do after the first deploy:

1. Set `siteUrl` in `src/content/profile.ts` to your real URL. It drives the
   canonical link and the social preview tags.
2. Add `GITHUB_TOKEN` under **Settings → Environment Variables** (see below).
   Optional, but do it.

GitHub Pages can't host this — it only serves static files, and the GitHub fetch
runs on a server. If you want `bvazrala.github.io` to keep working, put a
one-line redirect there pointing at the Vercel URL.

## GITHUB_TOKEN

Anonymous GitHub API calls are capped at **60/hour per IP**. Fetching from the
browser means every visitor on the same campus NAT shares one bucket and it
empties fast. `src/lib/github.ts` runs on the server instead: one request per
hour for the entire site, cached by Next and served from the edge.

Without a token that request uses the anonymous limit, which one server barely
touches. With one you get 5,000/hour and it never comes up again.

Create a fine-grained token at
[github.com/settings/tokens](https://github.com/settings/tokens?type=beta) with
no permissions selected — public repository metadata is readable with an empty
scope set. Copy `.env.example` to `.env.local` and paste it in, then add the
same value in Vercel.

If GitHub is unreachable at build time the page falls back to the snapshot in
`src/lib/github.ts` and says so in the UI, so the section is never empty.

## Adding a project

**A new repo needs no code change.** The repositories section and the hero graph
both read `api.github.com/users/<you>/repos` when the page rebuilds. Push, wait
up to an hour, and it appears with its GitHub description and language.

Which means your repo descriptions are now public copy. Two of yours are empty
(`wine_quality_ml_project`, `cs171_sudokuProject`) and `mukya`'s is truncated —
worth fixing on GitHub directly.

Everything else lives in **`src/content/profile.ts`**, the only file you should
need to open:

| To change | Edit |
|---|---|
| Bio, headline, status line, links | `profile` |
| The four highlighted projects | `projects` |
| Jobs and clubs | `experience` |
| Degrees and coursework | `education`, `coursework` |
| Toolkit chips | `skills` |
| A repo's title or one-liner on the site | `REPO_NOTES` |
| Hide a repo | `HIDDEN_REPOS` |
| Sidebar nav and section order | `sections` |

When Briefly and the ASL project get public repos, set `repo: "..."` on those
entries — the card gains a GitHub link and the graph stops counting them twice.

## How the hero figure works

Nodes are projects, an edge means two share a language or a problem, and colour
marks community. The force simulation in `src/lib/graph.ts` is pure and seeded
with a fixed number, so it runs **once on the server** at build time and the
browser only draws the result — identical layout on every visit, no solver
shipped to the client.

`ProjectGraph.tsx` draws edges in WebGL and positions the labels as real
`<button>` elements over the canvas, so they stay selectable, keyboard-reachable
and readable by a screen reader. Fading an edge is a blend toward the page
background rather than an alpha change, which is why it costs nothing and works
in both themes.

three.js is ~150 KB gzipped, so `GraphMount.tsx` loads it after hydration
through `next/dynamic`. The placeholder holds the exact frame size, so nothing
shifts when it lands.

Drag to rotate with a mouse — touch is deliberately left alone so the page still
scrolls on a phone.

## Architecture notes

Everything is a server component except three files: `Sidebar` (scroll-spy and
the mobile menu), `ThemeToggle`, and `ProjectGraph`. That is the entire client
bundle besides React itself.

Colours are CSS custom properties defined once in `globals.css` and swapped by
the `.dark` class next-themes writes on `<html>`. Tailwind reads them through
`@theme inline`, so `bg-panel` and `text-ink` work in both modes without `dark:`
variants scattered through the components. The graph reads the same variables
via `getComputedStyle` and repaints when the theme flips.

Community colours are the Okabe–Ito categorical palette, which stays
distinguishable to colour-blind readers in either theme.

## Known noise

`npm audit` reports issues in `postcss` and `sharp`, both transitive
dependencies of Next itself. The suggested fix downgrades Next to version 9.
Ignore it — they are build-time dependencies with no runtime exposure here, and
they clear when Next bumps them.

## Still worth doing

- Add an OG preview image: `src/app/opengraph-image.tsx` using `next/og`, or a
  1200×630 PNG at `public/opengraph-image.png`.
- Run Lighthouse once deployed and fix anything under 95.
- `sitemap.ts` and `robots.ts` in `src/app/` are about ten lines each.
