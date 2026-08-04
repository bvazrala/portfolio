import { Section } from "@/components/Section";
import { coursework, education } from "@/content/profile";

export default function Education() {
  return (
    <Section id="education" title="Education">
      <div className="space-y-6">
        {education.map((entry) => (
          <div
            key={entry.school}
            className="grid gap-x-8 gap-y-1 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
          >
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
              {entry.dates}
            </p>

            <div>
              <h3 className="font-display-tight text-[1.05rem]">
                {entry.school}
              </h3>
              <p className="mt-0.5 text-[0.93rem] text-ink-2">
                {entry.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-rule pt-10">
        <h3 className="label mb-6 text-muted">Coursework</h3>

        <div className="space-y-5">
          {coursework.map((group) => (
            <div
              key={group.group}
              className="grid gap-x-8 gap-y-2 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
            >
              <p className="label text-muted">{group.group}</p>
              <p className="text-[0.93rem] leading-relaxed text-ink-2">
                {group.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
