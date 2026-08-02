import { sections } from "@/content/profile";

/* Section numbering is real navigation, not decoration: the sidebar lists
   these in order and the reader moves through them as a sequence. */
export function Section({
  id,
  title,
  lede,
  children,
  className = "",
}: {
  id: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const index = sections.findIndex((s) => s.id === id);

  return (
    <section id={id} className={`scroll-mt-24 border-t border-rule py-16 md:py-24 ${className}`}>
      <div className="mb-10 flex items-baseline gap-5 md:mb-14">
        <span className="font-mono text-[0.7rem] text-muted">{String(index + 1).padStart(2, "0")}</span>
        <h2 className="font-display-tight text-[clamp(1.6rem,3.2vw,2.3rem)] leading-none">{title}</h2>
        <span aria-hidden="true" className="h-px flex-1 translate-y-[-0.35em] bg-rule" />
      </div>
      {lede ? <p className="mb-10 max-w-[58ch] text-[1.02rem] leading-relaxed text-ink-2">{lede}</p> : null}
      {children}
    </section>
  );
}

export function Chip({ children, tone = "quiet" }: { children: React.ReactNode; tone?: "quiet" | "accent" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[0.72rem]",
        tone === "accent"
          ? "border-accent/35 text-accent"
          : "border-rule bg-panel/50 text-ink-2",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
