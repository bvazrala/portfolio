"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

function Icon({ name }: { name: string }) {
  const common = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "light") {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (name === "dark") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <rect x="2.5" y="4" width="19" height="13" rx="1.5" />
      <path d="M8.5 20.5h7" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  /* The server has no idea which theme is stored, so the active state can only
     be trusted after hydration. This reports false on the server and true in
     the browser without an effect, so the markup always matches. */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <div>
      <p className="label mb-2 text-muted">Theme</p>
      <div
        role="radiogroup"
        aria-label="Colour theme"
        className="inline-flex items-center gap-px overflow-hidden rounded-md border border-rule bg-panel/60 p-px"
      >
        {OPTIONS.map((option) => {
          const active = mounted && theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={option.label}
              title={option.label}
              onClick={() => setTheme(option.value)}
              className={[
                "flex h-7 w-8 items-center justify-center rounded-[5px] transition-colors",
                active ? "bg-bg text-accent shadow-sm" : "text-muted hover:text-ink",
              ].join(" ")}
            >
              <Icon name={option.value} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
