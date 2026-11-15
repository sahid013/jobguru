import { useId, type ReactNode } from "react";

// A tiny SVG toolkit for the diagrams inside notes. Every colour comes from the site's
// tokens, so figures follow light and dark mode like the rest of the page.

export type Tone = "brand" | "gold" | "plain" | "muted" | "red" | "deep";

const TONES: Record<Tone, { fill: string; stroke: string; text: string }> = {
  brand: { fill: "var(--brand-soft)", stroke: "var(--brand-2)", text: "var(--heading)" },
  gold: { fill: "var(--gold-soft)", stroke: "var(--gold)", text: "var(--heading)" },
  plain: { fill: "var(--surface)", stroke: "var(--muted)", text: "var(--ink)" },
  muted: { fill: "var(--surface-2)", stroke: "var(--line)", text: "var(--muted)" },
  red: { fill: "color-mix(in srgb, #e5484d 13%, var(--surface))", stroke: "#e5484d", text: "var(--ink)" },
  deep: { fill: "var(--brand)", stroke: "var(--brand)", text: "#fff" },
};
export const tone = (t: Tone = "brand") => TONES[t];

/** Outer frame: scales down on phones, never up past its drawn size. */
export function Figure({
  w,
  h,
  title,
  caption,
  children,
}: {
  w: number;
  h: number;
  title: string;
  caption?: ReactNode;
  children: (arrowId: string) => ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <figure className="diagram">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title} style={{ maxWidth: w }}>
        <defs>
          <marker id={`a${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="var(--ink)" />
          </marker>
        </defs>
        {children(`url(#a${id})`)}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Multi-line centred text. */
export function Label({
  x,
  y,
  lines,
  size = 13,
  weight,
  color = "var(--ink)",
  anchor = "middle",
  italic,
}: {
  x: number;
  y: number;
  lines: string | string[];
  size?: number;
  weight?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  italic?: boolean;
}) {
  const list = Array.isArray(lines) ? lines : lines.split("\n");
  const lh = size * 1.25;
  const top = y - ((list.length - 1) * lh) / 2;
  return (
    <text
      x={x}
      textAnchor={anchor}
      dominantBaseline="central"
      fontSize={size}
      fontWeight={weight}
      fontStyle={italic ? "italic" : undefined}
      fill={color}
    >
      {list.map((l, i) => (
        <tspan key={i} x={x} y={top + i * lh}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

// ───────────────────────── Node + edge diagrams ─────────────────────────

export type Shape = "circle" | "rect" | "round" | "pill" | "diamond" | "para" | "ellipse" | "group";

export type Node = {
  id: string;
  x: number; // centre
  y: number;
  label?: string;
  shape?: Shape;
  w?: number;
  h?: number;
  r?: number;
  tone?: Tone;
  dashed?: boolean;
  size?: number;
  bold?: boolean;
  underline?: boolean;
};

export type Edge = {
  from: string;
  to: string;
  label?: string;
  /** Waypoints for elbow routes. */
  via?: [number, number][];
  /** Pin an end to an exact point (for side-entry ports) instead of aiming at the centre. */
  fromAt?: [number, number];
  toAt?: [number, number];
  /** Curve the edge sideways by this many px. */
  bend?: number;
  arrow?: boolean;
  dashed?: boolean;
  labelDx?: number;
  labelDy?: number;
};

type Pt = [number, number];

function half(n: Node): Pt {
  if (n.shape === "circle") return [n.r ?? 22, n.r ?? 22];
  return [(n.w ?? 120) / 2, (n.h ?? 44) / 2];
}

/** Where a ray from the node's centre towards `p` leaves the node's outline. */
function boundary(n: Node, p: Pt): Pt {
  const dx = p[0] - n.x;
  const dy = p[1] - n.y;
  const len = Math.hypot(dx, dy) || 1;
  const [hw, hh] = half(n);
  let t: number;
  switch (n.shape) {
    case "circle":
      t = (n.r ?? 22) / len;
      break;
    case "diamond":
      t = 1 / (Math.abs(dx) / hw + Math.abs(dy) / hh);
      break;
    case "ellipse":
      t = 1 / Math.sqrt((dx / hw) ** 2 + (dy / hh) ** 2);
      break;
    default:
      t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  }
  return [n.x + dx * t, n.y + dy * t];
}

function NodeShape({ n }: { n: Node }) {
  const c = tone(n.tone);
  const [hw, hh] = half(n);
  const common = {
    fill: n.shape === "group" ? "none" : c.fill,
    stroke: c.stroke,
    strokeWidth: n.shape === "group" ? 1.5 : 1.6,
    strokeDasharray: n.dashed || n.shape === "group" ? "6 4" : undefined,
  };
  let shape: ReactNode;
  switch (n.shape) {
    case "circle":
      shape = <circle cx={n.x} cy={n.y} r={n.r ?? 22} {...common} />;
      break;
    case "diamond":
      shape = <path d={`M${n.x} ${n.y - hh}L${n.x + hw} ${n.y}L${n.x} ${n.y + hh}L${n.x - hw} ${n.y}Z`} {...common} />;
      break;
    case "para": {
      const k = 14;
      shape = (
        <path
          d={`M${n.x - hw + k} ${n.y - hh}H${n.x + hw}L${n.x + hw - k} ${n.y + hh}H${n.x - hw}Z`}
          {...common}
        />
      );
      break;
    }
    case "ellipse":
      shape = <ellipse cx={n.x} cy={n.y} rx={hw} ry={hh} {...common} />;
      break;
    default: {
      const rx = n.shape === "pill" ? hh : n.shape === "rect" ? 4 : n.shape === "group" ? 14 : 10;
      shape = <rect x={n.x - hw} y={n.y - hh} width={hw * 2} height={hh * 2} rx={rx} {...common} />;
    }
  }
  const isGroup = n.shape === "group";
  return (
    <g>
      {shape}
      {n.label && (
        <g textDecoration={n.underline ? "underline" : undefined}>
          <Label
            x={isGroup ? n.x - hw + 12 : n.x}
            y={isGroup ? n.y - hh + 16 : n.y}
            anchor={isGroup ? "start" : "middle"}
            lines={n.label}
            size={n.size ?? (n.shape === "circle" ? 16 : 13)}
            weight={n.bold || isGroup ? 700 : 500}
            color={isGroup ? c.stroke : c.text}
          />
        </g>
      )}
    </g>
  );
}

function EdgePath({ e, nodes, arrowId }: { e: Edge; nodes: Map<string, Node>; arrowId: string }) {
  const a = nodes.get(e.from)!;
  const b = nodes.get(e.to)!;
  const marker = e.arrow === false ? undefined : arrowId;
  const style = {
    fill: "none",
    stroke: "var(--ink)",
    strokeOpacity: 0.75,
    strokeWidth: 1.5,
    strokeDasharray: e.dashed ? "5 4" : undefined,
    markerEnd: marker,
  };
  let d: string;
  let mid: Pt;
  if (e.bend) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const c: Pt = [mx - ((b.y - a.y) / len) * e.bend, my + ((b.x - a.x) / len) * e.bend];
    const p0 = boundary(a, c);
    const p1 = boundary(b, c);
    d = `M${p0[0]} ${p0[1]}Q${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`;
    mid = [0.25 * p0[0] + 0.5 * c[0] + 0.25 * p1[0], 0.25 * p0[1] + 0.5 * c[1] + 0.25 * p1[1]];
  } else {
    const via = e.via ?? [];
    const p0 = e.fromAt ?? boundary(a, via[0] ?? e.toAt ?? [b.x, b.y]);
    const p1 = e.toAt ?? boundary(b, via[via.length - 1] ?? e.fromAt ?? [a.x, a.y]);
    const pts = [p0, ...via, p1];
    d = "M" + pts.map((p) => `${p[0]} ${p[1]}`).join("L");
    const m = Math.floor((pts.length - 1) / 2);
    mid = [(pts[m][0] + pts[m + 1][0]) / 2, (pts[m][1] + pts[m + 1][1]) / 2];
  }
  return (
    <g>
      <path d={d} {...style} />
      {e.label && (
        <EdgeLabel x={mid[0] + (e.labelDx ?? 0)} y={mid[1] + (e.labelDy ?? 0)} text={e.label} />
      )}
    </g>
  );
}

export function EdgeLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 6.6 + 10;
  return (
    <g>
      <rect x={x - w / 2} y={y - 10} width={w} height={20} rx={5} fill="var(--gold-soft)" />
      <Label x={x} y={y} lines={text} size={12} weight={600} color="var(--warn-ink)" />
    </g>
  );
}

/** Draws nodes and the edges between them; extra SVG can be passed as children. */
export function Graph({ nodes, edges, arrowId, children }: { nodes: Node[]; edges: Edge[]; arrowId: string; children?: ReactNode }) {
  const map = new Map(nodes.map((n) => [n.id, n]));
  // Groups go underneath everything else.
  const groups = nodes.filter((n) => n.shape === "group");
  const rest = nodes.filter((n) => n.shape !== "group");
  return (
    <g>
      {groups.map((n) => (
        <NodeShape key={n.id} n={n} />
      ))}
      {edges.map((e, i) => (
        <EdgePath key={i} e={e} nodes={map} arrowId={arrowId} />
      ))}
      {rest.map((n) => (
        <NodeShape key={n.id} n={n} />
      ))}
      {children}
    </g>
  );
}

/** Tree helper: give each node a level and a horizontal slot, get circles + edges back. */
export function treeNodes(spec: [id: string, label: string, col: number, row: number][], dx = 70, dy = 80, ox = 40, oy = 36): Node[] {
  return spec.map(([id, label, col, row]) => ({ id, label, x: ox + col * dx, y: oy + row * dy, shape: "circle", r: 22 }));
}

// ───────────────────────── Logic gates ─────────────────────────
// Each gate is drawn with its body from (x, y) to (x + 56, y + 40); inputs on the left, output on the right.

export const GW = 56;
export const GH = 40;
const gateStyle = { fill: "var(--brand-soft)", stroke: "var(--brand-2)", strokeWidth: 1.8 };

export type Gate = "and" | "or" | "xor" | "not" | "nand" | "nor";

export function GateShape({ kind, x, y, label }: { kind: Gate; x: number; y: number; label?: string }) {
  const body =
    kind === "and" || kind === "nand" ? (
      <path d={`M${x} ${y}H${x + GW / 2}A${GH / 2} ${GH / 2} 0 0 1 ${x + GW / 2} ${y + GH}H${x}Z`} {...gateStyle} />
    ) : kind === "not" ? (
      <path d={`M${x} ${y + 4}L${x + GW - 12} ${y + GH / 2}L${x} ${y + GH - 4}Z`} {...gateStyle} />
    ) : (
      <path
        d={`M${x} ${y}Q${x + GW * 0.62} ${y} ${x + GW} ${y + GH / 2}Q${x + GW * 0.62} ${y + GH} ${x} ${y + GH}Q${x + 14} ${y + GH / 2} ${x} ${y}Z`}
        {...gateStyle}
      />
    );
  const bubble = kind === "not" || kind === "nand" || kind === "nor";
  const bx = kind === "not" ? x + GW - 7 : x + GW + 5;
  return (
    <g>
      {kind === "xor" && <path d={`M${x - 7} ${y}Q${x + 7} ${y + GH / 2} ${x - 7} ${y + GH}`} fill="none" stroke="var(--brand-2)" strokeWidth={1.8} />}
      {body}
      {bubble && <circle cx={bx} cy={y + GH / 2} r={5} fill="var(--surface)" stroke="var(--brand-2)" strokeWidth={1.8} />}
      {label && <Label x={x + (kind === "not" ? 18 : 24)} y={y + GH / 2} lines={label} size={10} weight={700} color="var(--brand)" />}
    </g>
  );
}

/** Port positions for a gate drawn at (x, y). */
export function ports(kind: Gate, x: number, y: number) {
  const inset = kind === "or" || kind === "xor" || kind === "nor" ? 7 : 0;
  const out = kind === "not" ? x + GW - 2 : kind === "nand" || kind === "nor" ? x + GW + 10 : x + GW;
  return {
    a: [x + inset, y + 12] as Pt,
    b: [x + inset, y + GH - 12] as Pt,
    in: [x, y + GH / 2] as Pt,
    out: [out, y + GH / 2] as Pt,
  };
}

export function Wire({ pts, dot }: { pts: Pt[]; dot?: Pt[] }) {
  return (
    <g>
      <path d={"M" + pts.map((p) => p.join(" ")).join("L")} fill="none" stroke="var(--ink)" strokeWidth={1.6} strokeLinejoin="round" />
      {dot?.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3.2} fill="var(--ink)" />)}
    </g>
  );
}
