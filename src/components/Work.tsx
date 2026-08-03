import { Chip, Section } from "@/components/Section";
import { DOMAINS, profile, projects } from "@/content/profile";

export default function Work() {
  return (
    <Section
      id="work"
      title="Selected work"
    >
      <div className="space-y-6">
        {projects.map((project) => (
          <article
            key={project.id}
            id={`project-${project.id}`}
            className="scroll-mt-24 rounded-xl border border-rule bg-panel/35 p-6 transition-colors hover:border-muted/50 md:p-8"
          >
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em]"
                style={{ color: `var(${DOMAINS[project.domain].cssVar})` }}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ background: `var(${DOMAINS[project.domain].cssVar})` }}
                />
                {DOMAINS[project.domain].label}
              </span>
              <span aria-hidden="true" className="text-rule">·</span>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">{project.dates}</span>
              {project.status ? (
                <span className="rounded border border-accent/35 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent">
                  {project.status}
                </span>
              ) : null}
            </div>

            <h3 className="font-display-tight text-[clamp(1.35rem,2.4vw,1.8rem)] leading-tight">
              {project.repo ? (
                <a
                  href={
                    project.repo.startsWith("http")
                      ? project.repo
                      : `https://github.com/${profile.github}/${project.repo}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="decoration-rule underline-offset-4 hover:underline hover:decoration-current"
                >
                  {project.title} <span className="text-muted">↗</span>
                </a>
              ) : (
                project.title
              )}
            </h3>
            <p className="mt-1 text-sm text-muted">{project.subtitle}</p>

            <p className="mt-5 max-w-[62ch] text-[1.02rem] font-medium leading-relaxed">{project.lead}</p>

            {project.impact.length > 0 ? (
              <div className="mt-6 rounded-lg border border-rule-soft bg-bg/60 p-5">
                <p className="label mb-3 text-muted">Impact</p>
                <ul className="space-y-2">
                  {project.impact.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <ul className="mt-6 space-y-2">
              {project.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-2">
                  <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-rule" />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <Chip key={tool}>{tool}</Chip>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
