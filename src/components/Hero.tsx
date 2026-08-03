import { profile } from "@/content/profile";
import GraphMount from "@/components/GraphMount";
import { TRAIT_NAMES, type TraitGraph } from "@/lib/graph";

export default function Hero({ graph }: { graph: TraitGraph }) {
  return (
    <section id="intro" className="scroll-mt-24 py-14 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:gap-14">
        <div>
          <p className="label rise mb-6 flex flex-wrap gap-x-3 gap-y-1 text-muted">
            <span>{profile.role}</span>
            <span aria-hidden="true" className="text-rule">/</span>
            <span>Class of 2027</span>
            <span aria-hidden="true" className="text-rule">/</span>
            <span>{profile.location}</span>
          </p>

          <h2 className="font-display rise mb-7 text-[clamp(2.3rem,5.2vw,4rem)] leading-[0.95]" style={{ animationDelay: "0.08s" }}>
            {profile.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="rise mb-8 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink-2" style={{ animationDelay: "0.16s" }}>
            {profile.intro}
          </p>

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
              href="#work"
              className="rounded-md bg-ink px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-bg transition-opacity hover:opacity-85"
            >
              See the work
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
        <figure className="rise m-0" style={{ animationDelay: "0.2s" }}>
          <GraphMount graph={graph} />
          <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[0.68rem] text-muted">
            <span>
              <span className="text-ink-2">Fig. 1</span> 50 personality survey items and the dependencies a
              regularised Ising model learned between them. Colour marks the five communities it recovered.
            </span>
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              {graph.counts.map((c) => (
                <span key={c.trait} className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: `var(--trait-${c.trait})` }}
                  />
                  {TRAIT_NAMES[c.trait]}
                </span>
              ))}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
