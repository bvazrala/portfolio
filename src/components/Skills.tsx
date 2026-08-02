import { Chip, Section } from "@/components/Section";
import { skills } from "@/content/profile";

export default function Skills() {
  return (
    <Section id="skills" title="Toolkit" lede="Ordered by how often it ends up in a repository, not by how it looks on a list.">
      <dl className="border-t border-rule">
        {skills.map((group) => (
          <div
            key={group.group}
            className="grid gap-x-8 gap-y-3 border-b border-rule-soft py-5 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]"
          >
            <dt className="label pt-1.5 text-muted">{group.group}</dt>
            <dd className="m-0 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
