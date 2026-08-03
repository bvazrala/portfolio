import data from "@/content/big-five-graph.json";

/* ============================================================================
 * The hero figure.
 *
 * 50 personality survey items and the dependencies a regularised Ising model
 * learned between them, fit for CS 179. Running community detection on that
 * learned graph recovered all five traits exactly, which is what the colours
 * mark. Edge weight carries its sign: positive means two items reinforce each
 * other, negative means they pull apart.
 *
 * Layout comes from a small force simulation seeded with a fixed number, so it
 * runs once on the server and every visitor sees the same arrangement.
 * ==========================================================================*/

export const TRAITS = ["e", "n", "a", "c", "o"] as const;
export type TraitKey = (typeof TRAITS)[number];

export const TRAIT_NAMES: Record<TraitKey, string> = {
  e: "Extraversion",
  n: "Neuroticism",
  a: "Agreeableness",
  c: "Conscientiousness",
  o: "Openness",
};

export type TraitNode = {
  id: number;
  label: string;
  trait: TraitKey;
  position: [number, number, number];
};

export type TraitEdge = { a: number; b: number; w: number };

export type TraitGraph = {
  nodes: TraitNode[];
  edges: TraitEdge[];
  counts: { trait: TraitKey; name: string; count: number }[];
};

export function buildTraitGraph(): TraitGraph {
  const edges: TraitEdge[] = data.edges;

  const positions = solve(
    data.nodes.length,
    edges,
    edges.map((e) => Math.abs(e.w)),
  );

  const nodes: TraitNode[] = data.nodes.map((n, i) => ({
    id: n.id,
    label: n.label,
    trait: TRAITS[n.community] ?? "o",
    position: positions[i],
  }));

  const counts = TRAITS.map((trait) => ({
    trait,
    name: TRAIT_NAMES[trait],
    count: nodes.filter((n) => n.trait === trait).length,
  })).filter((c) => c.count > 0);

  return { nodes, edges, counts };
}

/* Deterministic PRNG, so the layout is identical on every build. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function solve(
  count: number,
  edges: TraitEdge[],
  weights: number[],
): [number, number, number][] {
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

  for (let step = 0; step < 500; step++) {
    const force: number[][] = Array.from({ length: count }, () => [0, 0, 0]);

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i][0] - pos[j][0];
        const dy = pos[i][1] - pos[j][1];
        const dz = pos[i][2] - pos[j][2];
        const d2 = Math.max(dx * dx + dy * dy + dz * dz, 1);
        const d = Math.sqrt(d2);
        const rep = 1800 / d2;
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
