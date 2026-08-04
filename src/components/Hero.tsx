import { profile } from "@/content/profile";

export default function Hero() {
  return (
    <section id="intro" className="scroll-mt-24 py-14 md:py-20">
      <div className="grid items-center gap-10">
        <div>

          <h2 className="font-display rise mb-7 text-[clamp(2.3rem,5.2vw,4rem)] leading-[0.95]" style={{ animationDelay: "0.08s" }}>
            {profile.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          {profile.status ? (
            <p className="rise mb-8 inline-flex items-center gap-2.5 font-mono text-[0.78rem] text-ink-2" style={{ animationDelay: "0.24s" }}>
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-bright opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
              </span>
              {profile.status}
            </p>
          ) : null}

          <div className="rise flex flex-wrap gap-3" style={{ animationDelay: "0.32s" }}>
            <a
              href="#projects"
              className="rounded-md bg-ink px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-bg transition-opacity hover:opacity-85"
            >
              View projects
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-rule px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink"
            >
              Résumé ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
