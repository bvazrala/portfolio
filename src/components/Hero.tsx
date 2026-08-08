import { profile } from "@/content/profile";

export default function Hero() {
  return (
    <section id="intro" className="scroll-mt-24 py-14 md:pb-20 md:pt-36">
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
              className="rounded-md border border-accent bg-accent px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-bg shadow-lg shadow-accent/15 transition-all hover:-translate-y-0.5 hover:bg-accent-bright hover:shadow-xl hover:shadow-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              View projects
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-accent/40 bg-accent/10 px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Résumé ↗
            </a>
          </div>
        </div>
        <a
          href="#projects"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-panel/80 px-3.5 py-2 font-mono text-[0.72rem] tracking-[0.08em] text-ink-2 backdrop-blur-md transition-colors hover:border-accent/60 hover:text-ink"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          Background graph from my Big Five graphical-model project
        </a>

      </div>
    </section>
  );
}
