"use client";

import dynamic from "next/dynamic";

import type { TraitGraph } from "@/lib/graph";

/* three.js is ~150 KB gzipped and this is decoration, so it loads after
   hydration. Nothing shifts when it arrives because it sits behind the page. */
const ProjectGraph = dynamic(() => import("@/components/ProjectGraph"), { ssr: false });

export default function GraphMount({ graph }: { graph: TraitGraph }) {
  return <ProjectGraph graph={graph} />;
}
