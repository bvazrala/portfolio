"use client";

import dynamic from "next/dynamic";

import type { Graph } from "@/lib/graph";

/* three.js is ~150 KB gzipped, which has no business blocking first paint on a
   page whose job is to be read. Loading it after hydration keeps the initial
   bundle small; the placeholder holds the exact frame size so nothing shifts
   when it arrives. */
const ProjectGraph = dynamic(() => import("@/components/ProjectGraph"), {
  ssr: false,
  loading: () => (
    <div
      className="aspect-[1/0.78] min-h-[320px] w-full rounded-lg border border-rule bg-panel/40 surface-grid"
      aria-hidden="true"
    />
  ),
});

export default function GraphMount({ graph }: { graph: Graph }) {
  return <ProjectGraph graph={graph} />;
}
