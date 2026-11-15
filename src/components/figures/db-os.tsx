import { Figure, Graph, Label, type Edge, type Node } from "./kit";

// ── 6.6 ER diagram for the gas company: Customer with two subtypes, and a 1:1 meter.
export function ErGas() {
  const attr = (id: string, x: number, y: number, label: string, extra: Partial<Node> = {}): Node => ({
    id,
    x,
    y,
    w: 128,
    h: 38,
    shape: "ellipse",
    label,
    size: 12,
    tone: "plain",
    ...extra,
  });
  const nodes: Node[] = [
    { id: "c", x: 330, y: 130, w: 150, h: 46, shape: "rect", label: "Customer", bold: true, tone: "brand" },
    attr("cid", 115, 62, "Customer_ID", { underline: true }),
    attr("name", 105, 130, "Name"),
    attr("dob", 115, 198, "DOB"),
    attr("age", 330, 36, "Age", { dashed: true }),
    { id: "gen", x: 190, y: 322, w: 150, h: 46, shape: "rect", label: "General", bold: true, tone: "brand" },
    { id: "ind", x: 470, y: 322, w: 150, h: 46, shape: "rect", label: "Industrial", bold: true, tone: "brand" },
    attr("tax", 670, 322, "Tax_No"),
    { id: "has", x: 570, y: 130, w: 120, h: 64, shape: "diamond", label: "has", bold: true, tone: "gold" },
    { id: "m", x: 760, y: 130, w: 130, h: 46, shape: "rect", label: "Meter", bold: true, tone: "brand" },
    attr("model", 700, 40, "Model"),
    attr("prod", 790, 220, "Producer_Name", { w: 150 }),
  ];
  const line = (from: string, to: string): Edge => ({ from, to, arrow: false });
  const edges = [line("c", "cid"), line("c", "name"), line("c", "dob"), line("c", "age"), line("ind", "tax"), line("c", "has"), line("has", "m"), line("m", "model"), line("m", "prod")];
  return (
    <Figure w={880} h={360} title="ER diagram: Customer (General / Industrial) has one Meter" caption="Age is derived from DOB (dashed oval). The ISA triangle is a disjoint, total specialisation: every customer is exactly one of the two types.">
      {(a) => (
        <Graph nodes={nodes} edges={edges} arrowId={a}>
          <path d="M330 153V205" stroke="var(--ink)" strokeOpacity={0.75} strokeWidth={1.5} />
          <path d="M330 205L288 252H372Z" fill="var(--gold-soft)" stroke="var(--gold)" strokeWidth={1.6} />
          <Label x={330} y={235} lines="ISA" size={12} weight={700} color="var(--warn-ink)" />
          <path d="M330 252V272M190 299V272H470V299" fill="none" stroke="var(--ink)" strokeOpacity={0.75} strokeWidth={1.5} />
          <Label x={384} y={214} lines="disjoint, total" size={11} anchor="start" color="var(--muted)" italic />
          <Label x={418} y={118} lines="1" size={13} weight={700} color="var(--brand-2)" />
          <Label x={683} y={118} lines="1" size={13} weight={700} color="var(--brand-2)" />
        </Graph>
      )}
    </Figure>
  );
}

// ── 6.7 Crow's-foot ERD: employee — hire — equipment.
function Table({ x, y, w, title, rows }: { x: number; y: number; w: number; title: string; rows: [string, string, string?][] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={32 + rows.length * 28} rx={8} fill="var(--surface)" stroke="var(--brand-2)" strokeWidth={1.6} />
      <path d={`M${x} ${y + 8}a8 8 0 0 1 8 -8h${w - 16}a8 8 0 0 1 8 8v24h-${w}z`} fill="var(--brand)" />
      <Label x={x + w / 2} y={y + 16} lines={title} size={13} weight={700} color="#fff" />
      {rows.map(([type, name, key], i) => (
        <g key={name}>
          {i > 0 && <line x1={x} x2={x + w} y1={y + 32 + i * 28} y2={y + 32 + i * 28} stroke="var(--line)" />}
          <Label x={x + 12} y={y + 46 + i * 28} lines={type} size={12} anchor="start" color="var(--muted)" />
          <Label x={x + 66} y={y + 46 + i * 28} lines={name} size={13} anchor="start" />
          {key && <Label x={x + w - 12} y={y + 46 + i * 28} lines={key} size={11} weight={700} anchor="end" color="var(--warn-ink)" />}
        </g>
      ))}
    </g>
  );
}

export function ErdHire() {
  const s = { fill: "none", stroke: "var(--ink)", strokeWidth: 1.5 };
  return (
    <Figure w={720} h={310} title="ERD: employee and equipment linked through hire" caption="One employee hires zero or more items, and one item can be hired many times. That many-to-many relationship becomes the hire table, keyed by both foreign keys.">
      {() => (
        <g>
          <path d="M130 146V260H270" {...s} />
          <path d="M590 146V260H450" {...s} />
          {/* exactly one */}
          <path d="M120 156H140M120 163H140M580 156H600M580 163H600" {...s} />
          {/* zero or many */}
          <path d="M252 260L270 250M252 260L270 270M468 260L450 250M468 260L450 270" {...s} />
          <circle cx={244} cy={260} r={5} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.5} />
          <circle cx={476} cy={260} r={5} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.5} />
          <Label x={140} y={214} lines="hires" size={12} weight={600} anchor="start" color="var(--brand-2)" />
          <Label x={580} y={214} lines="is hired in" size={12} weight={600} anchor="end" color="var(--brand-2)" />
          <Table x={40} y={30} w={180} title="employee" rows={[["int", "id", "PK"], ["string", "name"], ["int", "salary"]]} />
          <Table x={500} y={30} w={180} title="equipment" rows={[["int", "id", "PK"], ["string", "name"], ["int", "price"]]} />
          <Table x={270} y={212} w={180} title="hire" rows={[["int", "employee_id", "FK"], ["int", "equipment_id", "FK"]]} />
        </g>
      )}
    </Figure>
  );
}

// ── 7.7 What happens on a page fault.
export function PageFault() {
  const nodes: Node[] = [
    { id: "r", x: 230, y: 30, w: 210, h: 40, label: "CPU references a page", tone: "plain" },
    { id: "d", x: 230, y: 112, w: 200, h: 80, shape: "diamond", label: "Page in RAM?\n(valid bit = 1)", size: 12, tone: "gold" },
    { id: "ok", x: 470, y: 112, w: 150, h: 46, label: "Access memory\n(no fault)", tone: "brand" },
    { id: "t", x: 230, y: 206, w: 230, h: 40, label: "Page fault → trap to the OS", tone: "red" },
    { id: "f", x: 230, y: 276, w: 230, h: 46, label: "Find the page on disk\n(swap space)", size: 12, tone: "plain" },
    { id: "v", x: 230, y: 350, w: 230, h: 46, label: "Take a free frame;\nif none, evict a victim page", size: 12, tone: "plain" },
    { id: "l", x: 230, y: 424, w: 230, h: 46, label: "Read the page into the frame\n(process waits on I/O)", size: 12, tone: "plain" },
    { id: "u", x: 230, y: 498, w: 230, h: 40, label: "Update the page table", tone: "plain" },
    { id: "x", x: 230, y: 566, w: 230, h: 40, label: "Restart the instruction", tone: "brand" },
  ];
  const edges: Edge[] = [
    { from: "r", to: "d" },
    { from: "d", to: "ok", label: "Yes" },
    { from: "d", to: "t", label: "No", labelDx: 18 },
    { from: "t", to: "f" },
    { from: "f", to: "v" },
    { from: "v", to: "l" },
    { from: "l", to: "u" },
    { from: "u", to: "x" },
    { from: "x", to: "d", via: [[60, 566], [60, 112]], dashed: true, label: "retry" },
  ];
  return (
    <Figure w={560} h={600} title="Page fault handling, step by step">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 7.8 Circular wait in a resource-allocation graph.
export function CircularWait() {
  const nodes: Node[] = [
    { id: "P1", x: 110, y: 70, shape: "circle", r: 30, label: "P1", tone: "brand" },
    { id: "P2", x: 370, y: 230, shape: "circle", r: 30, label: "P2", tone: "brand" },
    { id: "R1", x: 110, y: 230, w: 70, h: 50, label: "R1", tone: "gold", size: 15 },
    { id: "R2", x: 370, y: 70, w: 70, h: 50, label: "R2", tone: "gold", size: 15 },
  ];
  const edges: Edge[] = [
    { from: "P1", to: "R2", label: "requests" },
    { from: "R2", to: "P2", label: "assigned to" },
    { from: "P2", to: "R1", label: "requests" },
    { from: "R1", to: "P1", label: "assigned to" },
  ];
  return (
    <Figure w={480} h={300} title="Circular wait: P1 and P2 each hold what the other needs" caption="Circles are processes, boxes are resources. The arrows close a loop, so neither process can ever continue.">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 7.9 One CPU kept busy by three jobs.
export function Multiprogramming() {
  const x0 = 110;
  const u = 36;
  const color: Record<string, string> = { A: "var(--brand-2)", B: "var(--gold)", C: "#3b82f6" };
  const rows: [string, number, [string, number, number][]][] = [
    ["CPU", 50, [["A", 0, 3], ["B", 3, 6], ["C", 6, 8], ["A", 8, 11], ["B", 11, 12]]],
    ["I/O device", 104, [["A", 3, 8], ["B", 6, 11]]],
  ];
  return (
    <Figure w={580} h={200} title="Multiprogramming timeline: while one job waits for I/O, the CPU runs another" caption="The CPU bar has no gaps: every time a job starts I/O, the scheduler switches to a ready job.">
      {() => (
        <g>
          {rows.map(([name, y, segs]) => (
            <g key={name}>
              <Label x={x0 - 12} y={y + 15} lines={name} size={13} weight={700} anchor="end" />
              <rect x={x0} y={y} width={12 * u} height={30} rx={4} fill="var(--surface-2)" />
              {segs.map(([job, s, e], i) => {
                // I/O waits can overlap, so each job gets its own half-height lane there.
                const cpu = name === "CPU";
                const top = cpu ? y + 1 : y + 1 + (job === "A" ? 0 : 15);
                const h = cpu ? 28 : 13;
                return (
                  <g key={i}>
                    <rect x={x0 + s * u + 1} y={top} width={(e - s) * u - 2} height={h} rx={4} fill={color[job]} opacity={cpu ? 1 : 0.5} />
                    <Label x={x0 + ((s + e) / 2) * u} y={top + h / 2} lines={cpu ? `Job ${job}` : `${job} waits for I/O`} size={cpu ? 12 : 10} weight={700} color={cpu ? "#fff" : "var(--ink)"} />
                  </g>
                );
              })}
            </g>
          ))}
          {Array.from({ length: 13 }, (_, t) => (
            <g key={t}>
              <line x1={x0 + t * u} x2={x0 + t * u} y1={142} y2={148} stroke="var(--muted)" />
              <Label x={x0 + t * u} y={160} lines={String(t)} size={11} color="var(--muted)" />
            </g>
          ))}
          <Label x={x0 + 6 * u} y={184} lines="time →" size={11} color="var(--muted)" />
        </g>
      )}
    </Figure>
  );
}
