import { Section } from "@/components/Section";
import { profile } from "@/content/profile";

const LINKS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "GitHub", value: `github.com/${profile.github}`, href: `https://github.com/${profile.github}` },
  { label: "LinkedIn", value: "in/bala-kausik-vazrala", href: profile.linkedin },
  { label: "Résumé", value: "PDF", href: profile.resume },
];

export default function Contact() {
  return (
    <Section id="contact" title="Get in touch">
      <p className="mb-10 max-w-[46ch] font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05]">
        Happy to chat about my work and collaborate.
      </p>

      <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:max-w-2xl">
        {LINKS.map((link) => (
          <div key={link.label} className="flex items-baseline justify-between gap-4 border-b border-rule-soft pb-3">
            <dt className="label text-muted">{link.label}</dt>
            <dd className="m-0">
              <a
                href={link.href}
                target={link.href.startsWith("http") || link.href.startsWith("/") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="font-mono text-[0.85rem] decoration-rule underline-offset-4 hover:underline hover:decoration-current"
              >
                {link.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-16 max-w-[62ch] font-mono text-[0.7rem] leading-relaxed text-muted">
        Built with Next.js, TypeScript, Tailwind, and three.js.
      </p>
    </Section>
  );
}
