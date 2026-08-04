"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

import type { TraitGraph } from "@/lib/graph";

/* ============================================================================
 * Ambient background.
 *
 * This is the graph a regularised Ising model learned over 50 personality
 * survey items in CS 179, drifting behind the page at low opacity. It is
 * texture, not a figure: no border, no labels, no interaction. The Big Five
 * card in Selected Work is where it gets explained.
 *
 * "Fading" an edge blends it toward the page background rather than making it
 * transparent, which on an opaque background looks identical and costs one
 * lerp instead of a depth sort.
 * ==========================================================================*/

const NODE_RADIUS = 1.6;
const CAMERA_Z = 190; /* lower pushes the graph past the viewport edges */

function readVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function ProjectGraph({ graph }: { graph: TraitGraph }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<(() => void) | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const visibleEdges = graph.edges.filter((edge) => Math.abs(edge.w) >= 0.15);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 1, 3000);
    camera.position.set(0, 0, CAMERA_Z);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return; /* no WebGL: the page just has a plain background */
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const group = new THREE.Group();
    scene.add(group);

    /* ---- edges ---------------------------------------------------------- */
    const vertices = new Float32Array(visibleEdges.length * 6);
    const colours = new Float32Array(visibleEdges.length * 6);

    visibleEdges.forEach((e, i) => {
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
    const sphere = new THREE.SphereGeometry(NODE_RADIUS, 10, 10);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: reduced ? 1 : 0,
    });
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

      visibleEdges.forEach((e, i) => {
        const fade = 1 - Math.min(Math.abs(e.w), 1) * 0.85;
        const from = e.w < 0 ? negative : (traitColour.get(graph.nodes[e.a].trait) ?? "#888888");
        scratch.setStyle(from).lerp(background, fade);
        colours.set([scratch.r, scratch.g, scratch.b], i * 6);
        const to = e.w < 0 ? negative : (traitColour.get(graph.nodes[e.b].trait) ?? "#888888");
        scratch.setStyle(to).lerp(background, fade);
        colours.set([scratch.r, scratch.g, scratch.b], i * 6 + 3);
      });
      edgeGeometry.attributes.color.needsUpdate = true;
    };
    paintRef.current();

    /* ---- sizing --------------------------------------------------------- */
    const resize = () => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 720 ? CAMERA_Z * 1.6 : CAMERA_Z;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();

    /* ---- motion --------------------------------------------------------- */
    const spin = reduced ? 0 : 0.0007;
    let intro = reduced ? 1 : 0;
    let visible = true;
    let frame = 0;

    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;

      if (intro < 1) {
        intro = Math.min(1, intro + 0.008);
        const eased = 1 - Math.pow(1 - intro, 3);
        group.scale.setScalar(0.9 + eased * 0.1);
        edgeMaterial.opacity = eased;
        nodeMaterial.opacity = eased;
      } else if (spin) {
        group.rotation.y += spin;
        group.rotation.x = Math.sin(Date.now() * 0.00004) * 0.18;
      }

      renderer.render(scene, camera);
    };

    if (reduced) group.scale.setScalar(1);
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
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
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-screen opacity-[0.22]" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
