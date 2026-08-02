import { Chip, Section } from "@/components/Section";
import { profile } from "@/content/profile";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-5">
          {profile.about.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="max-w-[62ch] text-[1.02rem] leading-relaxed text-ink-2">
              {paragraph}
            </p>
          ))}
        </div>
        <div>
          <p className="label mb-4 text-muted">Focus areas</p>
          <div className="flex flex-wrap gap-2">
            {profile.focusAreas.map((area) => (
              <Chip key={area}>{area}</Chip>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
