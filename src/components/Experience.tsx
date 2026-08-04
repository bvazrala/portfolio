import { Section } from "@/components/Section";
import { experience } from "@/content/profile";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="space-y-12">
        {experience.map((role) => (
          <article key={`${role.org}-${role.title}`} className="grid gap-x-8 gap-y-3 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
              <p className="text-ink-2">{role.dates}</p>
              <p className="mt-1">{role.location}</p>
            </div>
            <div>
              <h3 className="font-display-tight text-[1.15rem] leading-snug">
                {role.title} <span className="text-muted">·</span>{" "}
                <span className="text-accent">{role.org}</span>
              </h3>
              <ul className="mt-3 space-y-2">
                {role.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-2">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-rule" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
