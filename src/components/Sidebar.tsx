"use client";

import { useEffect, useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";
import { profile, sections } from "@/content/profile";

/* Tracks which section is on screen. The observer's root margin biases toward
   the upper third, so the nav flips over when a heading reaches reading
   position rather than when it barely clears the bottom edge. */
function useScrollSpy() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      title={label}
      className="text-muted transition-colors hover:text-ink"
    >
      {children}
    </a>
  );
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function Socials() {
  return (
    <div className="flex items-center gap-4">
      <Social href={`https://github.com/${profile.github}`} label="GitHub">
        <svg {...iconProps} fill="currentColor" stroke="none">
          <path d="M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7C6.7 19.9 6.1 18 6.1 18c-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
      </Social>
      <Social href={profile.linkedin} label="LinkedIn">
        <svg {...iconProps} fill="currentColor" stroke="none">
          <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.2-.02-2.75-1.68-2.75-1.68 0-1.94 1.31-1.94 2.66V21h-4z" />
        </svg>
      </Social>
      <Social href={`mailto:${profile.email}`} label="Email">
        <svg {...iconProps}>
          <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </Social>
    </div>
  );
}

function NavList({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Sections">
      <ul className="space-y-1">
        {sections.map((section, i) => {
          const current = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={onNavigate}
                aria-current={current ? "true" : undefined}
                className="group flex items-center gap-4 py-1.5"
              >
                <span
                  aria-hidden="true"
                  className={[
                    "block h-px transition-all duration-300",
                    current ? "w-14 bg-accent" : "w-6 bg-rule group-hover:w-10 group-hover:bg-muted",
                  ].join(" ")}
                />
                <span
                  className={[
                    "label transition-colors duration-200",
                    current ? "text-ink" : "text-muted group-hover:text-ink-2",
                  ].join(" ")}
                >
                  {section.label}
                </span>
                <span className="ml-auto font-mono text-[0.6rem] text-rule">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Sidebar() {
  const active = useScrollSpy();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[clamp(320px,30vw,420px)] flex-col justify-start gap-16 px-10 py-12 lg:flex xl:px-14">
      <div>
        <a href="#intro" className="block">
          <h1 className="font-display text-[clamp(2rem,2.6vw,2.75rem)] leading-[0.95]">{profile.name}</h1>
        </a>
        <p className="mt-3 text-[0.95rem] font-medium text-ink-2">{profile.role}</p>
        <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-muted">{profile.tagline}</p>
      </div>

      <div>
        <NavList active={active} />
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 flex items-center gap-4 py-1.5"
        >
          <span aria-hidden="true" className="block h-px w-6 bg-rule transition-all duration-300 group-hover:w-10 group-hover:bg-muted" />
          <span className="label text-muted transition-colors group-hover:text-ink">Résumé ↗</span>
        </a>
      </div>

      <div className="space-y-6">
        <ThemeToggle />
        <Socials />
      </div>
    </aside>
  );
}

export function MobileBar() {
  const active = useScrollSpy();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/85 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between px-5 py-3.5">
        <a href="#intro" className="font-display-tight text-lg">
          {profile.name}
        </a>
        <div className="flex items-center gap-3">
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="label text-muted hover:text-ink"
          >
            Résumé
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="label rounded-md border border-rule px-3 py-1.5 text-ink"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-rule px-5 py-6">
          <NavList active={active} onNavigate={() => setOpen(false)} />
          <div className="mt-8 flex items-center justify-between">
            <Socials />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
