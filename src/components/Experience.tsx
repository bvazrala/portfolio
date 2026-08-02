import { Section } from "@/components/Section";
import { coursework, education, experience } from "@/content/profile";

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

      <div className="mt-16 border-t border-rule pt-10">
        <h3 className="label mb-6 text-muted">Education</h3>
        <div className="space-y-6">
          {education.map((entry) => (
            <div key={entry.school} className="grid gap-x-8 gap-y-1 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">{entry.dates}</p>
              <div>
                <h4 className="font-display-tight text-[1.05rem]">{entry.school}</h4>
                <p className="mt-0.5 text-[0.93rem] text-ink-2">{entry.detail}</p>
              </div>
            </div>
          ))}
          <div className="grid gap-x-8 gap-y-1 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">Coursework</p>
            <p className="text-[0.93rem] leading-relaxed text-ink-2">{coursework.join(" · ")}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
