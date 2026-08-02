import { DOMAINS, projects, type DomainKey } from "@/content/profile";
import type { Repo } from "@/lib/github";

/* ============================================================================
 * The hero figure.
 *
 * Nodes are projects. An edge means two projects share a language or a problem.
 * Positions come from a small force simulation — repulsion between every pair,
 * springs along edges, a weak pull toward the origin — seeded with a fixed
 * number so the layout is byte-identical on every render.
 *
 * All of this is pure, so it runs once on the server and the browser only has
 * to draw the result.
 * ==========================================================================*/

export const GRAPH_MAX_NODES = 16;

export type GraphNode = {
  id: string;
  label: string;
  full: string;
  domain: DomainKey;
  featured: boolean;
  /* Where clicking the node should take you. */
  target: string;
  position: [number, number, number];
};

export type GraphEdge = { a: number; b: number };

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  counts: { domain: DomainKey; label: string; count: number }[];
};

export function repoAnchor(name: string) {
  return "repo-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/* Deterministic PRNG — same layout on every build. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function buildGraph(repos: Repo[]): Graph {
  const nodes: Omit<GraphNode, "position">[] = [];
  const tagsOf: string[][] = [];
  const claimed = new Set<string>();

  for (const p of projects) {
    if (p.repo) claimed.add(p.repo);
    nodes.push({
      id: p.id,
      label: p.short,
      full: p.title,
      domain: p.domain,
      featured: true,
      target: `#project-${p.id}`,
    });
    tagsOf.push(p.tags);
  }

  for (const r of repos) {
    if (nodes.length >= GRAPH_MAX_NODES) break;
    if (claimed.has(r.name)) continue;
    nodes.push({
      id: r.name,
      label: r.short,
      full: r.title,
      domain: r.domain,
      featured: false,
      target: `#${repoAnchor(r.name)}`,
    });
    tagsOf.push(r.tags);
  }

  /* Weight every pair, keep the strongest, cap how many any one node carries. */
  const candidates: { a: number; b: number; w: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let w = nodes[i].domain === nodes[j].domain ? 1 : 0;
      for (const t of tagsOf[i]) if (tagsOf[j].includes(t)) w += 0.7;
      if (w >= 1) candidates.push({ a: i, b: j, w: Math.min(w, 2.4) });
    }
  }
  candidates.sort((x, y) => y.w - x.w);

  const degree = new Array<number>(nodes.length).fill(0);
  const cap = (i: number) => (nodes[i].featured ? 5 : 4);
  const edges: GraphEdge[] = [];
  const weights: number[] = [];

  for (const e of candidates) {
    if (degree[e.a] >= cap(e.a) || degree[e.b] >= cap(e.b)) continue;
    degree[e.a]++;
    degree[e.b]++;
    edges.push({ a: e.a, b: e.b });
    weights.push(e.w);
  }

  /* Nothing floats alone. */
  nodes.forEach((n, i) => {
    if (degree[i] > 0) return;
    let partner = nodes.findIndex((m, k) => k !== i && m.domain === n.domain);
    if (partner === -1) partner = i === 0 ? 1 : 0;
    if (partner < 0 || partner >= nodes.length) return;
    edges.push({ a: i, b: partner });
    weights.push(1);
    degree[i]++;
    degree[partner]++;
  });

  const positions = solve(nodes.length, edges, weights);

  const counts = (Object.keys(DOMAINS) as DomainKey[])
    .map((domain) => ({
      domain,
      label: DOMAINS[domain].label,
      count: nodes.filter((n) => n.domain === domain).length,
    }))
    .filter((c) => c.count > 0);

  return {
    nodes: nodes.map((n, i) => ({ ...n, position: positions[i] })),
    edges,
    counts,
  };
}

function solve(count: number, edges: GraphEdge[], weights: number[]): [number, number, number][] {
  const random = rng(20261102);
  const pos: number[][] = [];
  const vel: number[][] = [];

  for (let i = 0; i < count; i++) {
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const r = 62 * Math.cbrt(random() * 0.6 + 0.4);
    const s = Math.sqrt(1 - u * u);
    pos.push([r * s * Math.cos(theta), r * s * Math.sin(theta), r * u]);
    vel.push([0, 0, 0]);
  }

  for (let step = 0; step < 320; step++) {
    const force: number[][] = Array.from({ length: count }, () => [0, 0, 0]);

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i][0] - pos[j][0];
        const dy = pos[i][1] - pos[j][1];
        const dz = pos[i][2] - pos[j][2];
        const d2 = Math.max(dx * dx + dy * dy + dz * dz, 1);
        const d = Math.sqrt(d2);
        const rep = 5200 / d2;
        force[i][0] += (dx / d) * rep;
        force[i][1] += (dy / d) * rep;
        force[i][2] += (dz / d) * rep;
        force[j][0] -= (dx / d) * rep;
        force[j][1] -= (dy / d) * rep;
        force[j][2] -= (dz / d) * rep;
      }
    }

    edges.forEach((e, k) => {
      const dx = pos[e.b][0] - pos[e.a][0];
      const dy = pos[e.b][1] - pos[e.a][1];
      const dz = pos[e.b][2] - pos[e.a][2];
      const d = Math.max(Math.hypot(dx, dy, dz), 0.01);
      const rest = 74 - weights[k] * 12;
      const pull = 0.055 * (d - rest) * d * 0.5;
      force[e.a][0] += (dx / d) * pull;
      force[e.a][1] += (dy / d) * pull;
      force[e.a][2] += (dz / d) * pull;
      force[e.b][0] -= (dx / d) * pull;
      force[e.b][1] -= (dy / d) * pull;
      force[e.b][2] -= (dz / d) * pull;
    });

    for (let i = 0; i < count; i++) {
      force[i][0] -= pos[i][0] * 0.035;
      force[i][1] -= pos[i][1] * 0.035;
      force[i][2] -= pos[i][2] * 0.055;
      for (let k = 0; k < 3; k++) {
        vel[i][k] = (vel[i][k] + force[i][k] * 0.012) * 0.82;
        pos[i][k] += vel[i][k];
      }
    }
  }

  /* Fit to the plot frame: wide, shorter, shallow in depth. */
  const box = [1, 1, 1];
  for (const p of pos) {
    box[0] = Math.max(box[0], Math.abs(p[0]));
    box[1] = Math.max(box[1], Math.abs(p[1]));
    box[2] = Math.max(box[2], Math.abs(p[2]));
  }
  const target = [92, 66, 46];

  return pos.map(
    (p) =>
      [
        (p[0] * target[0]) / box[0],
        (p[1] * target[1]) / box[1],
        (p[2] * target[2]) / box[2],
      ] as [number, number, number],
  );
}
