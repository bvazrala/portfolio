"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

import type { TraitGraph } from "@/lib/graph";

/* ============================================================================
 * Draws the learned Big Five graph.
 *
 * Nodes are instanced spheres coloured by the trait community they landed in.
 * Edges are a single LineSegments mesh with per-vertex colour, where "faded"
 * means blended toward the page background rather than made transparent. On an
 * opaque background that looks identical and costs one lerp instead of a sort.
 *
 * Positive edges take their trait colour, negative ones go grey, and weak
 * edges of either sign wash out toward the background.
 * ==========================================================================*/

const NODE_RADIUS = 1.9;

function readVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function ProjectGraph({ graph }: { graph: TraitGraph }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<(() => void) | null>(null);
  const { resolvedTheme } = useTheme();

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
      return; /* no WebGL: the frame just stays empty */
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const group = new THREE.Group();
    scene.add(group);

    /* ---- edges ---------------------------------------------------------- */
    const edgeCount = graph.edges.length;
    const vertices = new Float32Array(edgeCount * 6);
    const colours = new Float32Array(edgeCount * 6);

    graph.edges.forEach((e, i) => {
      const a = graph.nodes[e.a].position;
      const b = graph.nodes[e.b].position;
      vertices.set([a[0], a[1], a[2], b[0], b[1], b[2]], i * 6);
    });

    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    edgeGeometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
    const edgeMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: reduced ? 1 : 0,
    });
    group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));

    /* ---- nodes ---------------------------------------------------------- */
    const sphere = new THREE.SphereGeometry(NODE_RADIUS, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: reduced ? 1 : 0 });
    const nodes = new THREE.InstancedMesh(sphere, nodeMaterial, graph.nodes.length);
    const matrix = new THREE.Matrix4();
    graph.nodes.forEach((n, i) => {
      matrix.setPosition(n.position[0], n.position[1], n.position[2]);
      nodes.setMatrixAt(i, matrix);
    });
    nodes.instanceMatrix.needsUpdate = true;
    group.add(nodes);

    /* ---- colour, re-read whenever the theme flips ------------------------ */
    const scratch = new THREE.Color();
    const background = new THREE.Color();

    paintRef.current = () => {
      background.setStyle(readVar("--bg") || "#ffffff");
      const negative = readVar("--trait-neg") || "#888888";
      const traitColour = new Map(
        graph.counts.map((c) => [c.trait, readVar(`--trait-${c.trait}`) || "#888888"]),
      );

      graph.nodes.forEach((n, i) => {
        scratch.setStyle(traitColour.get(n.trait) ?? "#888888");
        nodes.setColorAt(i, scratch);
      });
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;

      graph.edges.forEach((e, i) => {
        const strength = Math.min(Math.abs(e.w), 1);
        const fade = 1 - strength * 0.85;
        const base = e.w < 0 ? negative : (traitColour.get(graph.nodes[e.a].trait) ?? "#888888");
        scratch.setStyle(base).lerp(background, fade);
        colours.set([scratch.r, scratch.g, scratch.b], i * 6);
        const other = e.w < 0 ? negative : (traitColour.get(graph.nodes[e.b].trait) ?? "#888888");
        scratch.setStyle(other).lerp(background, fade);
        colours.set([scratch.r, scratch.g, scratch.b], i * 6 + 3);
      });
      edgeGeometry.attributes.color.needsUpdate = true;
    };
    paintRef.current();

    /* ---- sizing --------------------------------------------------------- */
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 520 ? 330 : 268;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    /* ---- motion --------------------------------------------------------- */
    const spin = reduced ? 0 : 0.0013;
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
        intro = Math.min(1, intro + 0.012);
        const eased = 1 - Math.pow(1 - intro, 3);
        group.scale.setScalar(0.78 + eased * 0.22);
        group.rotation.y = (1 - eased) * -0.8;
        edgeMaterial.opacity = eased;
        nodeMaterial.opacity = eased;
      } else if (!dragging && spin) {
        group.rotation.y += spin;
        if (Math.abs(drift) > 0.0001) {
          drift *= 0.94;
          group.rotation.y += drift;
        }
      }

      renderer.render(scene, camera);
    };

    if (reduced) group.scale.setScalar(1);
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
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      sphere.dispose();
      nodeMaterial.dispose();
      renderer.dispose();
    };
  }, [graph]);

  useEffect(() => {
    paintRef.current?.();
  }, [resolvedTheme]);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[1/0.82] min-h-[340px] w-full overflow-hidden rounded-lg border border-rule bg-panel/30"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
