"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

import { DOMAINS } from "@/content/profile";
import type { Graph } from "@/lib/graph";

/* ============================================================================
 * Edges are drawn in WebGL. Labels are real <button> elements layered over the
 * canvas and moved by the render loop, which means they stay selectable,
 * keyboard-reachable, and readable by a screen reader — none of which is true
 * of text baked into a canvas.
 *
 * "Fading" an edge is a blend toward the page background rather than an alpha
 * change: on an opaque background it looks identical and costs one lerp.
 * ==========================================================================*/

type Props = { graph: Graph };

function readVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function ProjectGraph({ graph }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<(() => void) | null>(null);
  const focusRef = useRef<number | null>(null);

  const [focused, setFocused] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();

  const neighbours = useCallback(
    (index: number | null) => {
      if (index === null) return null;
      const set = new Set<number>([index]);
      for (const e of graph.edges) {
        if (e.a === index) set.add(e.b);
        if (e.b === index) set.add(e.a);
      }
      return set;
    },
    [graph.edges],
  );

  useEffect(() => {
    focusRef.current = focused;
  }, [focused]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 1, 3000);
    camera.position.set(0, 0, 268);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return; /* no WebGL — the labels still render and still link out */
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const group = new THREE.Group();
    scene.add(group);

    const edgeCount = graph.edges.length;
    const vertices = new Float32Array(edgeCount * 6);
    const colours = new Float32Array(edgeCount * 6);
    graph.edges.forEach((e, i) => {
      const a = graph.nodes[e.a].position;
      const b = graph.nodes[e.b].position;
      vertices.set([a[0], a[1], a[2], b[0], b[1], b[2]], i * 6);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: reduced ? 1 : 0,
    });
    const lines = new THREE.LineSegments(geometry, material);
    group.add(lines);

    const scratch = new THREE.Color();
    const background = new THREE.Color();

    paintRef.current = () => {
      background.setStyle(readVar("--bg") || "#ffffff");
      const domainColour = new Map(
        Object.entries(DOMAINS).map(([key, meta]) => [key, readVar(meta.cssVar) || "#888888"]),
      );
      const focus = focusRef.current;

      graph.edges.forEach((e, i) => {
        const near = focus === null || e.a === focus || e.b === focus;
        const fade = focus === null ? 0.5 : near ? 0.02 : 0.85;
        [e.a, e.b].forEach((nodeIndex, side) => {
          scratch.setStyle(domainColour.get(graph.nodes[nodeIndex].domain) ?? "#888888");
          scratch.lerp(background, fade);
          colours.set([scratch.r, scratch.g, scratch.b], i * 6 + side * 3);
        });
      });
      geometry.attributes.color.needsUpdate = true;
    };
    paintRef.current();

    /* ---- sizing ------------------------------------------------------- */
    let width = 1;
    let height = 1;
    let bias = 0;
    const widths = new Array<number>(graph.nodes.length).fill(70);

    const measure = () => {
      labelRefs.current.forEach((el, i) => {
        if (el) widths[i] = el.offsetWidth || 70;
      });
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 520 ? 320 : 268;
      bias = Math.min(24, width * 0.03);
      camera.updateProjectionMatrix();
      measure();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();
    if (document.fonts?.ready) void document.fonts.ready.then(measure);

    /* ---- projection --------------------------------------------------- */
    const vector = new THREE.Vector3();
    const project = () => {
      for (let i = 0; i < graph.nodes.length; i++) {
        const el = labelRefs.current[i];
        if (!el) continue;
        const [x0, y0, z0] = graph.nodes[i].position;
        vector.set(x0, y0, z0).applyMatrix4(group.matrixWorld);
        const depth = vector.z;
        vector.project(camera);

        const x = (vector.x * 0.5 + 0.5) * width - bias;
        const y = (-vector.y * 0.5 + 0.5) * height;
        const t = Math.min(Math.max((depth + 70) / 140, 0), 1);

        const flip = x + widths[i] > width - 10;
        el.dataset.flip = flip ? "true" : "false";
        const tx = flip ? x - widths[i] + 6 : x - 6;

        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${(y - 8).toFixed(1)}px, 0) scale(${(
          0.86 +
          t * 0.2
        ).toFixed(3)})`;
        el.style.opacity = (0.42 + t * 0.58).toFixed(3);
        el.style.zIndex = String(Math.round(t * 100));
      }
    };

    /* ---- motion ------------------------------------------------------- */
    const spin = reduced ? 0 : 0.0016;
    let intro = reduced ? 1 : 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let drift = 0;
    let visible = true;
    let onScreen = true;
    let frame = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || intro < 1) return; /* never fight a touch scroll */
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      wrap.setPointerCapture(e.pointerId);
      wrap.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      drift = (e.clientX - lastX) * 0.005;
      group.rotation.y += drift;
      group.rotation.x = Math.max(-1.1, Math.min(1.1, group.rotation.x + (e.clientY - lastY) * 0.005));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const endDrag = () => {
      dragging = false;
      wrap.style.cursor = "";
    };

    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerup", endDrag);
    wrap.addEventListener("pointercancel", endDrag);

    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const inView = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    inView.observe(wrap);

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible || !onScreen) return;

      if (intro < 1) {
        intro = Math.min(1, intro + 0.014);
        const eased = 1 - Math.pow(1 - intro, 3);
        group.scale.setScalar(0.72 + eased * 0.28);
        group.rotation.y = (1 - eased) * -0.9;
        material.opacity = eased;
        if (intro >= 1 && overlayRef.current) overlayRef.current.style.opacity = "1";
      } else if (!dragging && spin && focusRef.current === null) {
        group.rotation.y += spin;
        if (Math.abs(drift) > 0.0001) {
          drift *= 0.94;
          group.rotation.y += drift;
        }
      }

      group.updateMatrixWorld();
      project();
      renderer.render(scene, camera);
    };

    if (reduced) {
      group.scale.setScalar(1);
      if (overlayRef.current) overlayRef.current.style.opacity = "1";
    }
    tick();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      inView.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", endDrag);
      wrap.removeEventListener("pointercancel", endDrag);
      paintRef.current = null;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [graph]);

  /* Repaint when the theme flips or the focused node changes. */
  useEffect(() => {
    paintRef.current?.();
  }, [resolvedTheme, focused]);

  const near = neighbours(focused);

  const jumpTo = (target: string) => {
    const el = document.querySelector(target);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove("flash");
    void (el as HTMLElement).offsetWidth;
    el.classList.add("flash");
  };

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[1/0.78] min-h-[320px] w-full overflow-hidden rounded-lg border border-rule bg-panel/40 surface-grid"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none", opacity: 0, transition: "opacity .5s ease" }}
      >
        {graph.nodes.map((node, i) => {
          const dim = near !== null && !near.has(i);
          return (
            <button
              key={node.id}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              type="button"
              onPointerEnter={() => setFocused(i)}
              onPointerLeave={() => setFocused(null)}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(null)}
              onClick={() => jumpTo(node.target)}
              aria-label={`${node.full} — ${DOMAINS[node.domain].label}`}
              style={
                {
                  "--nc": `var(${DOMAINS[node.domain].cssVar})`,
                  pointerEvents: "auto",
                  transformOrigin: "left center",
                  opacity: dim ? 0.28 : undefined,
                } as React.CSSProperties
              }
              className={[
                "group absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap",
                "font-mono text-[0.68rem] text-ink-2 transition-[opacity,color] duration-200",
                "data-[flip=true]:flex-row-reverse",
                "hover:text-ink focus-visible:text-ink",
              ].join(" ")}
            >
              <span
                className={[
                  "block shrink-0 rounded-full transition-all duration-200",
                  node.featured ? "h-3 w-3" : "h-2 w-2",
                  "group-hover:scale-110 group-focus-visible:scale-110",
                ].join(" ")}
                style={{
                  background: "var(--nc)",
                  boxShadow: focused === i ? "0 0 0 5px color-mix(in srgb, var(--nc) 22%, transparent)" : undefined,
                }}
              />
              <span className="rounded-sm bg-bg/75 px-1 py-px backdrop-blur-[2px]">{node.label}</span>
            </button>
          );
        })}
      </div>

      <span className="label pointer-events-none absolute bottom-3 left-3 bg-bg/70 px-1.5 py-0.5 text-[0.6rem] text-muted">
        Drag to rotate · click a node
      </span>
    </div>
  );
}
