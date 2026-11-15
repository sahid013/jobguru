import { Figure, Graph, Label, type Edge, type Node } from "./kit";

const circle = (id: string, x: number, y: number, tone: Node["tone"] = "brand"): Node => ({ id, label: id, x, y, shape: "circle", r: 22, tone });

// ── 3.2 The directed graph from the question.
export function Digraph() {
  const nodes = [circle("A", 50, 130), circle("B", 160, 130), circle("C", 275, 130), circle("D", 400, 210), circle("E", 540, 60), circle("F", 540, 210)];
  const edges: Edge[] = [
    { from: "A", to: "B" },
    { from: "B", to: "C" },
    { from: "C", to: "D" },
    { from: "C", to: "E" },
    { from: "C", to: "F", bend: -26 },
    { from: "D", to: "E" },
    { from: "D", to: "F", bend: 16 },
    { from: "F", to: "D", bend: 16 },
    { from: "F", to: "E" },
  ];
  return (
    <Figure w={590} h={260} title="Directed graph with vertices A to F" caption="Edges: A→B, B→C, C→D, C→E, C→F, D→E, D→F, F→D, F→E.">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 3.2 The two spanning trees side by side.
export function BfsDfsTrees() {
  const bfs = [circle("A", 120, 70), circle("B", 120, 145), circle("C", 120, 220), circle("D", 50, 300), circle("E", 120, 300), circle("F", 190, 300)];
  const dfs = [circle("A", 400, 60), circle("B", 400, 122), circle("C", 400, 184), circle("D", 400, 246), circle("E", 350, 318), circle("F", 450, 318)].map((n) => ({
    ...n,
    id: `${n.id}2`,
    tone: "gold" as const,
  }));
  const chain = (ids: string[]) => ids.slice(1).map((id, i) => ({ from: ids[i], to: id }));
  const edges: Edge[] = [
    ...chain(["A", "B", "C"]),
    { from: "C", to: "D" },
    { from: "C", to: "E" },
    { from: "C", to: "F" },
    ...chain(["A2", "B2", "C2", "D2"]),
    { from: "D2", to: "E2" },
    { from: "D2", to: "F2" },
  ];
  return (
    <Figure w={520} h={350} title="BFS tree and DFS tree from A" caption="Both visit A B C D E F, but BFS hangs D, E, F under C while DFS goes deep and hangs E, F under D.">
      {(a) => (
        <Graph nodes={[...bfs, ...dfs]} edges={edges} arrowId={a}>
          <Label x={120} y={22} lines="BFS tree (queue)" size={14} weight={700} color="var(--brand)" />
          <Label x={400} y={18} lines="DFS tree (stack)" size={14} weight={700} color="var(--warn-ink)" />
        </Graph>
      )}
    </Figure>
  );
}

// ── 3.3 Binary tree 1–5.
export function BinaryTree() {
  const nodes = [circle("1", 170, 40), circle("2", 100, 120), circle("3", 240, 120), circle("4", 55, 200), circle("5", 145, 200)];
  const edges: Edge[] = [
    { from: "1", to: "2", arrow: false },
    { from: "1", to: "3", arrow: false },
    { from: "2", to: "4", arrow: false },
    { from: "2", to: "5", arrow: false },
  ];
  return (
    <Figure w={300} h={240} title="Binary tree: 1 is the root, 2 and 3 its children, 4 and 5 children of 2">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 3.7 One tree whose post-order is a b f c h d e g i, with array indices.
export function PostorderTree() {
  const spec: [string, number, number, number][] = [
    ["i", 260, 44, 1],
    ["d", 140, 120, 2],
    ["g", 380, 120, 3],
    ["f", 80, 196, 4],
    ["h", 200, 196, 5],
    ["e", 340, 196, 6],
    ["a", 40, 272, 8],
    ["b", 116, 272, 9],
    ["c", 178, 272, 10],
  ];
  const nodes = spec.map(([id, x, y]) => circle(id, x, y));
  const pairs = [
    ["i", "d"],
    ["i", "g"],
    ["d", "f"],
    ["d", "h"],
    ["g", "e"],
    ["f", "a"],
    ["f", "b"],
    ["h", "c"],
  ];
  return (
    <Figure w={430} h={310} title="Binary tree with post-order a b f c h d e g i" caption="Small numbers are the array indices (root at 1, left child 2k, right child 2k + 1). Index 7 stays empty.">
      {(a) => (
        <Graph nodes={nodes} edges={pairs.map(([from, to]) => ({ from, to, arrow: false }))} arrowId={a}>
          {spec.map(([id, x, y, idx]) => (
            <Label key={id} x={x + 27} y={y - 22} lines={String(idx)} size={11} weight={700} color="var(--warn-ink)" anchor="start" />
          ))}
        </Graph>
      )}
    </Figure>
  );
}
