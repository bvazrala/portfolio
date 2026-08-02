import "server-only";

import { HIDDEN_REPOS, REPO_NOTES, profile, type DomainKey } from "@/content/profile";

/* ============================================================================
 * Why this runs on the server
 *
 * Anonymous GitHub API calls are capped at 60/hour *per IP*. Fetching from the
 * browser means every visitor on the same campus NAT shares one bucket, and it
 * empties fast. Fetching here instead means one authenticated request per hour
 * for the whole site (5,000/hour ceiling), and the result is cached by Next and
 * served from the edge. Visitors never talk to GitHub at all.
 *
 * GITHUB_TOKEN is optional — without it this still works, just on the anonymous
 * limit, which one server burns through far more slowly than many browsers do.
 * ==========================================================================*/

export type Repo = {
  name: string;
  title: string;
  short: string;
  description: string;
  language: string | null;
  stars: number;
  pushedAt: string;
  url: string;
  domain: DomainKey;
  tags: string[];
};

type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  html_url: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
};

const LANGUAGE_DOMAIN: Record<string, DomainKey> = {
  "C++": "device",
  C: "device",
  Arduino: "device",
  Rust: "device",
  Python: "model",
  "Jupyter Notebook": "model",
  R: "model",
  JavaScript: "interface",
  TypeScript: "interface",
  HTML: "interface",
  CSS: "interface",
  Svelte: "interface",
  Vue: "interface",
  Swift: "interface",
};

function titleFromName(name: string) {
  const words = name.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function shorten(title: string) {
  return title.length > 18 ? title.slice(0, 17).trimEnd() + "…" : title;
}

function normalise(raw: GitHubRepo): Repo {
  const note = REPO_NOTES[raw.name] ?? {};
  const title = note.title ?? titleFromName(raw.name);
  return {
    name: raw.name,
    title,
    short: note.short ?? shorten(title),
    description: note.description ?? raw.description ?? "",
    language: raw.language,
    stars: raw.stargazers_count,
    pushedAt: raw.pushed_at,
    url: raw.html_url,
    domain: note.domain ?? (raw.language ? LANGUAGE_DOMAIN[raw.language] : undefined) ?? "practice",
    tags: note.tags ?? (raw.language ? [raw.language.toLowerCase()] : []),
  };
}

/* A snapshot, so a rate limit or an outage never renders an empty section.
   Refresh it occasionally by running `npm run snapshot`. */
const FALLBACK: GitHubRepo[] = [
  {
    name: "graphical_models_big5",
    description: "Fitting a pairwise/Ising graphical model over the openpsychometrics Big Five data.",
    language: "Python",
    stargazers_count: 0,
    pushed_at: "2026-08-01T15:05:30Z",
    html_url: "https://github.com/bvazrala/graphical_models_big5",
    fork: false,
    archived: false,
  },
  {
    name: "CS-147-Class-Activities",
    description: "Classwork from an Internet of Things class at UCI.",
    language: "C++",
    stargazers_count: 0,
    pushed_at: "2026-07-30T17:08:29Z",
    html_url: "https://github.com/bvazrala/CS-147-Class-Activities",
    fork: false,
    archived: false,
  },
  {
    name: "neetcode-submissions",
    description: "My NeetCode.io problem submissions.",
    language: null,
    stargazers_count: 0,
    pushed_at: "2026-07-09T17:30:22Z",
    html_url: "https://github.com/bvazrala/neetcode-submissions",
    fork: false,
    archived: false,
  },
  {
    name: "mukya",
    description: "Mukya means important in Sanskrit.",
    language: "JavaScript",
    stargazers_count: 0,
    pushed_at: "2026-06-22T04:17:59Z",
    html_url: "https://github.com/bvazrala/mukya",
    fork: false,
    archived: false,
  },
  {
    name: "cs171_sudokuProject",
    description: "",
    language: "Python",
    stargazers_count: 0,
    pushed_at: "2026-04-09T04:58:48Z",
    html_url: "https://github.com/bvazrala/cs171_sudokuProject",
    fork: false,
    archived: false,
  },
  {
    name: "perplexity_stock_pitch_comp",
    description: "Prompts, code, dashboard, and video for a stock pitch competition.",
    language: "JavaScript",
    stargazers_count: 0,
    pushed_at: "2026-04-08T05:06:40Z",
    html_url: "https://github.com/bvazrala/perplexity_stock_pitch_comp",
    fork: false,
    archived: false,
  },
  {
    name: "uci_datathon_2026_project",
    description: "UCI Datathon 2026 Project.",
    language: "HTML",
    stargazers_count: 0,
    pushed_at: "2026-04-05T17:01:48Z",
    html_url: "https://github.com/bvazrala/uci_datathon_2026_project",
    fork: false,
    archived: false,
  },
  {
    name: "wine_quality_ml_project",
    description: "",
    language: "Python",
    stargazers_count: 0,
    pushed_at: "2026-03-17T05:21:38Z",
    html_url: "https://github.com/bvazrala/wine_quality_ml_project",
    fork: false,
    archived: false,
  },
];

export type RepoResult = { repos: Repo[]; live: boolean };

export async function getRepos(): Promise<RepoResult> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  let raw: GitHubRepo[] = FALLBACK;
  let live = false;

  try {
    const res = await fetch(
      `https://api.github.com/users/${profile.github}/repos?sort=pushed&direction=desc&per_page=100`,
      { headers, next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data: unknown = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        raw = data as GitHubRepo[];
        live = true;
      }
    } else {
      console.warn(`[github] ${res.status} ${res.statusText} — serving the snapshot`);
    }
  } catch (error) {
    console.warn("[github] request failed, serving the snapshot:", error);
  }

  const repos = raw
    .filter((r) => !r.fork && !r.archived && !HIDDEN_REPOS.includes(r.name))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .map(normalise);

  return { repos, live };
}
