import { sections } from "@/content/profile";

const graphChipColors = [
  "var(--trait-e)",
  "var(--trait-n)",
  "var(--trait-a)",
  "var(--trait-c)",
  "var(--trait-o)",
] as const;

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
  const index = sections.findIndex((section) => section.id === id);
  const number = String(index + 1).padStart(2, "0");

  return (
    <section
      id={id}
      className={`scroll-mt-24 py-6 md:py-10 ${className}`}
    >
      <div className="rounded-2xl border border-accent/30 bg-panel/90 px-5 py-10 shadow-[0_18px_70px_rgb(0_0_0/0.14)] ring-1 ring-inset ring-accent/10 backdrop-blur-md sm:px-7 md:px-10 md:py-14">
        <div className="mb-10 flex items-baseline gap-5 md:mb-14">
          <span className="font-mono text-[0.7rem] text-accent">
            {number}
          </span>

          <h2 className="font-display-tight text-[clamp(1.6rem,3.2vw,2.3rem)] leading-none">
            {title}
          </h2>

          <span
            aria-hidden="true"
            className="h-px flex-1 translate-y-[-0.35em] bg-accent/30"
          />
        </div>

        {lede ? (
          <p className="mb-10 max-w-[58ch] text-[1.02rem] leading-relaxed text-ink-2">
            {lede}
          </p>
        ) : null}

        {children}
      </div>
    </section>
  );
}

export function Chip({
  children,
  tone = "quiet",
  colorIndex,
}: {
  children: React.ReactNode;
  tone?: "quiet" | "accent";
  colorIndex?: number;
}) {
  const graphColor =
    colorIndex === undefined
      ? undefined
      : graphChipColors[colorIndex % graphChipColors.length];

  return (
    <span
      className={[
        "inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[0.72rem]",
        graphColor
          ? "text-ink"
          : tone === "accent"
            ? "border-accent/35 text-accent"
            : "border-rule bg-panel/50 text-ink-2",
      ].join(" ")}
      style={
        graphColor
          ? {
              borderColor: `color-mix(in srgb, ${graphColor} 55%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${graphColor} 12%, var(--panel))`,
              boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${graphColor} 10%, transparent)`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
