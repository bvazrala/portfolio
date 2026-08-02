import { Section } from "@/components/Section";
import { DOMAINS } from "@/content/profile";
import type { RepoResult } from "@/lib/github";
import { repoAnchor } from "@/lib/graph";

function relative(iso: string) {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30.4);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export default function Repositories({ repos, live }: RepoResult) {
  return (
    <Section
      id="repositories"
      title="Repositories"
      lede="Pulled from the GitHub API on the server and cached for an hour, so anything I push shows up here on its own. Forks are left out."
    >
      <ul className="border-t border-rule">
        {repos.map((repo) => (
          <li key={repo.name} id={repoAnchor(repo.name)} className="scroll-mt-24 border-b border-rule-soft">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="grid gap-x-6 gap-y-1.5 px-1 py-5 transition-colors hover:bg-panel/50 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] md:items-baseline"
            >
              <span className="flex items-center gap-2.5 font-mono text-[0.85rem] font-medium">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: `var(${DOMAINS[repo.domain].cssVar})` }}
                />
                {repo.name}
              </span>
              <span className="text-[0.92rem] leading-relaxed text-ink-2">
                {repo.description || <span className="text-muted">No description on GitHub yet.</span>}
              </span>
              <span className="whitespace-nowrap font-mono text-[0.72rem] text-muted">
                {repo.language ?? "—"}
                {repo.stars > 0 ? ` · ★ ${repo.stars}` : ""} · {relative(repo.pushedAt)}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-5 flex items-center gap-2.5 font-mono text-[0.72rem] text-muted">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: live ? "var(--c-device)" : "var(--accent)" }}
        />
        {live
          ? `${repos.length} public repositories, refreshed hourly from GitHub.`
          : "GitHub didn't answer on the last rebuild — showing the saved snapshot."}
      </p>
    </Section>
  );
}
