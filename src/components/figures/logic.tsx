import { Figure, GateShape, Graph, Label, Wire, ports, tone, type Edge, type Node } from "./kit";

// ───────────────────────── K-maps ─────────────────────────

type Group = { r: [number, number]; c: [number, number]; color: string; label: string };

function KMap({
  rowVar,
  colVar,
  rows,
  cols,
  ones,
  groups,
  title,
  caption,
}: {
  rowVar: string;
  colVar: string;
  rows: string[];
  cols: string[];
  ones: number[];
  groups: Group[];
  title: string;
  caption: string;
}) {
  const cell = 58;
  const ox = 90;
  const oy = 60;
  const w = ox + cols.length * cell + 200;
  const h = oy + rows.length * cell + 24;
  return (
    <Figure w={w} h={h} title={title} caption={caption}>
      {() => (
        <g>
          <line x1={ox - 46} y1={oy - 42} x2={ox} y2={oy} stroke="var(--muted)" />
          <Label x={ox - 8} y={oy - 40} lines={colVar} size={13} weight={700} anchor="end" color="var(--brand)" />
          <Label x={ox - 40} y={oy - 10} lines={rowVar} size={13} weight={700} color="var(--brand)" />
          {cols.map((c, j) => (
            <Label key={c} x={ox + j * cell + cell / 2} y={oy - 14} lines={c} size={13} weight={700} />
          ))}
          {rows.map((r, i) => (
            <g key={r}>
              <Label x={ox - 18} y={oy + i * cell + cell / 2} lines={r} size={13} weight={700} />
              {cols.map((c, j) => {
                const m = parseInt(r + c, 2);
                const on = ones.includes(m);
                return (
                  <g key={c}>
                    <rect
                      x={ox + j * cell}
                      y={oy + i * cell}
                      width={cell}
                      height={cell}
                      fill={on ? "var(--brand-soft)" : "var(--surface)"}
                      stroke="var(--line)"
                      strokeWidth={1.4}
                    />
                    <Label x={ox + j * cell + cell / 2} y={oy + i * cell + cell / 2 + 2} lines={on ? "1" : "0"} size={17} weight={on ? 700 : 400} color={on ? "var(--heading)" : "var(--muted)"} />
                    <Label x={ox + j * cell + cell - 6} y={oy + i * cell + 10} lines={`m${m}`} size={9} anchor="end" color="var(--muted)" />
                  </g>
                );
              })}
            </g>
          ))}
          {groups.map((g, k) => {
            const inset = 5 + k * 3;
            return (
              <rect
                key={g.label}
                x={ox + g.c[0] * cell + inset}
                y={oy + g.r[0] * cell + inset}
                width={(g.c[1] - g.c[0] + 1) * cell - inset * 2}
                height={(g.r[1] - g.r[0] + 1) * cell - inset * 2}
                rx={14}
                fill="none"
                stroke={g.color}
                strokeWidth={2.6}
              />
            );
          })}
          {groups.map((g, k) => (
            <g key={g.label}>
              <rect x={ox + cols.length * cell + 26} y={oy + 6 + k * 32} width={18} height={18} rx={5} fill="none" stroke={g.color} strokeWidth={2.6} />
              <Label x={ox + cols.length * cell + 54} y={oy + 15 + k * 32} lines={g.label} size={13} weight={600} anchor="start" />
            </g>
          ))}
        </g>
      )}
    </Figure>
  );
}

const RED = "#e5484d";
const BLUE = "#3b82f6";
const GOLD = "var(--gold)";

export function KMap3() {
  return (
    <KMap
      rowVar="A"
      colVar="BC"
      rows={["0", "1"]}
      cols={["00", "01", "11", "10"]}
      ones={[2, 6, 7]}
      groups={[
        { r: [1, 1], c: [2, 3], color: GOLD, label: "m6 + m7 → AB" },
        { r: [0, 1], c: [3, 3], color: RED, label: "m2 + m6 → BC′" },
      ]}
      title="Three-variable K-map for F = Σm(2, 6, 7)"
      caption="Columns follow Gray code (00, 01, 11, 10), so neighbours differ in one bit. Two pairs cover all three 1s: F = AB + BC′."
    />
  );
}

export function KMap4() {
  return (
    <KMap
      rowVar="AB"
      colVar="CD"
      rows={["00", "01", "11", "10"]}
      cols={["00", "01", "11", "10"]}
      ones={[9, 10, 11, 12, 13, 14, 15]}
      groups={[
        { r: [2, 2], c: [0, 3], color: GOLD, label: "row AB = 11 → AB" },
        { r: [2, 3], c: [1, 2], color: BLUE, label: "A = 1, D = 1 → AD" },
        { r: [2, 3], c: [2, 3], color: RED, label: "A = 1, C = 1 → AC" },
      ]}
      title="Four-variable K-map for F = Σm(9–15)"
      caption="Three overlapping quads: F = AB + AC + AD = A(B + C + D)."
    />
  );
}

// ───────────────────────── Circuits ─────────────────────────

const txt = (x: number, y: number, s: string, anchor: "start" | "middle" | "end" = "start", color = "var(--ink)") => (
  <Label x={x} y={y} lines={s} size={13} weight={600} anchor={anchor} color={color} />
);

// ── 4.3 Full adder built from two half adders and an OR gate.
export function FullAdder() {
  const x1 = ports("xor", 150, 48);
  const a1 = ports("and", 150, 120);
  const x2 = ports("xor", 330, 80);
  const a2 = ports("and", 330, 160);
  const o = ports("or", 470, 200);
  return (
    <Figure w={700} h={290} title="Full adder from two half adders" caption="Half adder 1 adds A and B; half adder 2 adds that sum to Cin. Either half adder's carry makes Cout, so they meet in an OR gate.">
      {() => (
        <g>
          <rect x={128} y={34} width={102} height={142} rx={12} fill="none" stroke="var(--gold)" strokeDasharray="6 4" />
          <rect x={308} y={66} width={102} height={150} rx={12} fill="none" stroke="var(--gold)" strokeDasharray="6 4" />
          {txt(179, 24, "Half adder 1", "middle", "var(--warn-ink)")}
          {txt(359, 56, "Half adder 2", "middle", "var(--warn-ink)")}
          {txt(20, 60, "A", "start")}
          {txt(20, 100, "B", "start")}
          {txt(20, 230, "Cin", "start")}
          <Wire pts={[[40, 60], x1.a]} />
          <Wire pts={[[40, 100], [110, 100], [110, x1.b[1]], x1.b]} />
          <Wire pts={[[90, 60], [90, a1.a[1]], a1.a]} dot={[[90, 60]]} />
          <Wire pts={[[110, 100], [110, a1.b[1]], a1.b]} dot={[[110, 100]]} />
          {/* S1 = A xor B */}
          <Wire pts={[x1.out, [280, x1.out[1]], [280, x2.a[1]], x2.a]} />
          <Wire pts={[[280, x2.a[1]], [280, a2.a[1]], a2.a]} dot={[[280, x2.a[1]]]} />
          {/* Cin */}
          <Wire pts={[[48, 230], [300, 230], [300, x2.b[1]], x2.b]} />
          <Wire pts={[[300, a2.b[1]], a2.b]} dot={[[300, a2.b[1]]]} />
          {/* carries into the OR */}
          <Wire pts={[a2.out, [440, a2.out[1]], [440, o.a[1]], o.a]} />
          <Wire pts={[a1.out, [250, a1.out[1]], [250, 268], [450, 268], [450, o.b[1]], o.b]} />
          <Wire pts={[x2.out, [580, x2.out[1]]]} />
          <Wire pts={[o.out, [580, o.out[1]]]} />
          <GateShape kind="xor" x={150} y={48} />
          <GateShape kind="and" x={150} y={120} />
          <GateShape kind="xor" x={330} y={80} />
          <GateShape kind="and" x={330} y={160} />
          <GateShape kind="or" x={470} y={200} />
          {txt(212, x1.out[1] - 12, "S1 = A⊕B")}
          {txt(212, a1.out[1] - 12, "C1 = AB")}
          {txt(392, a2.out[1] - 12, "C2 = S1·Cin")}
          {txt(584, x2.out[1], "Sum = A⊕B⊕Cin")}
          {txt(584, o.out[1], "Cout")}
        </g>
      )}
    </Figure>
  );
}

// ── 4.4 AND + OR → NOT → OR → NOT.
export function GateCircuit() {
  const and = ports("and", 130, 40);
  const or1 = ports("or", 130, 130);
  const not1 = ports("not", 214, 130);
  const or2 = ports("or", 310, 80);
  const not2 = ports("not", 390, 80);
  return (
    <Figure w={520} h={220} title="Logic circuit: F = (AB + (A + B)′)′" caption="The circuit is an XOR: F = 1 exactly when A ≠ B.">
      {() => (
        <g>
          {txt(40, 14, "A", "middle")}
          {txt(70, 14, "B", "middle")}
          <Wire pts={[[40, 26], [40, 200]]} />
          <Wire pts={[[70, 26], [70, 200]]} />
          <Wire pts={[[40, and.a[1]], and.a]} dot={[[40, and.a[1]]]} />
          <Wire pts={[[70, and.b[1]], and.b]} dot={[[70, and.b[1]]]} />
          <Wire pts={[[40, or1.a[1]], or1.a]} dot={[[40, or1.a[1]]]} />
          <Wire pts={[[70, or1.b[1]], or1.b]} dot={[[70, or1.b[1]]]} />
          <Wire pts={[or1.out, not1.in]} />
          <Wire pts={[and.out, [270, and.out[1]], [270, or2.a[1]], or2.a]} />
          <Wire pts={[not1.out, [290, not1.out[1]], [290, or2.b[1]], or2.b]} />
          <Wire pts={[or2.out, not2.in]} />
          <Wire pts={[not2.out, [490, not2.out[1]]]} />
          <GateShape kind="and" x={130} y={40} />
          <GateShape kind="or" x={130} y={130} />
          <GateShape kind="not" x={214} y={130} />
          <GateShape kind="or" x={310} y={80} />
          <GateShape kind="not" x={390} y={80} />
          {txt(192, and.out[1] - 12, "AB")}
          {txt(250, not1.out[1] + 18, "(A+B)′")}
          {txt(494, not2.out[1], "F", "start", "var(--brand)")}
        </g>
      )}
    </Figure>
  );
}

// ── 4.6 2-to-1 multiplexer from basic gates.
export function Mux2() {
  const a1 = ports("and", 210, 40);
  const a2 = ports("and", 210, 150);
  const n = ports("not", 120, 70);
  const o = ports("or", 320, 95);
  return (
    <Figure w={460} h={250} title="2-to-1 multiplexer: f = S′·x1 + S·x2" caption="S = 0 lets x1 through the top AND gate; S = 1 lets x2 through the bottom one.">
      {() => (
        <g>
          {txt(16, a1.a[1], "x1")}
          {txt(16, a2.a[1], "x2")}
          {txt(80, 238, "S", "middle")}
          <Wire pts={[[38, a1.a[1]], a1.a]} />
          <Wire pts={[[38, a2.a[1]], a2.a]} />
          <Wire pts={[[80, 226], [80, a2.b[1]], a2.b]} />
          <Wire pts={[[80, a2.b[1]], [80, n.in[1]], n.in]} dot={[[80, a2.b[1]]]} />
          <Wire pts={[n.out, [190, n.out[1]], [190, a1.b[1]], a1.b]} />
          <Wire pts={[a1.out, [290, a1.out[1]], [290, o.a[1]], o.a]} />
          <Wire pts={[a2.out, [290, a2.out[1]], [290, o.b[1]], o.b]} />
          <Wire pts={[o.out, [420, o.out[1]]]} />
          <GateShape kind="not" x={120} y={70} />
          <GateShape kind="and" x={210} y={40} />
          <GateShape kind="and" x={210} y={150} />
          <GateShape kind="or" x={320} y={95} />
          {txt(160, n.out[1] - 16, "S′")}
          {txt(424, o.out[1], "f", "start", "var(--brand)")}
        </g>
      )}
    </Figure>
  );
}

// ── 4.7 Traffic-light FSM and its 5-bit counter.
export function TrafficFsm() {
  const nodes: Node[] = [
    { id: "G", x: 110, y: 150, shape: "circle", r: 44, label: "GREEN\n14 states", size: 13, tone: "brand" },
    { id: "Y", x: 310, y: 60, shape: "circle", r: 40, label: "YELLOW\n1 state", size: 13, tone: "gold" },
    { id: "R", x: 310, y: 250, shape: "circle", r: 44, label: "RED\n15 states", size: 13, tone: "red" },
    { id: "clk", x: 560, y: 36, w: 150, h: 34, shape: "pill", label: "clock: one tick / 5 s", size: 12, tone: "plain" },
    { id: "cnt", x: 560, y: 120, w: 170, h: 56, label: "5-bit counter\ncounts 0 … 29", tone: "deep" },
    { id: "o1", x: 560, y: 200, w: 170, h: 30, label: "0 – 13 → GREEN", size: 12, tone: "brand" },
    { id: "o2", x: 560, y: 238, w: 170, h: 30, label: "14 → YELLOW", size: 12, tone: "gold" },
    { id: "o3", x: 560, y: 276, w: 170, h: 30, label: "15 – 29 → RED", size: 12, tone: "red" },
  ];
  const edges: Edge[] = [
    { from: "G", to: "Y", label: "after 14 ticks (70 s)", bend: -20 },
    { from: "Y", to: "R", label: "after 1 tick (5 s)" },
    { from: "R", to: "G", label: "after 15 ticks (75 s)", bend: -20 },
    { from: "clk", to: "cnt" },
    { from: "cnt", to: "o1" },
  ];
  return (
    <Figure w={680} h={310} title="Traffic light as a finite state machine" caption="30 ticks per cycle means 30 states; 2⁴ = 16 is too few, 2⁵ = 32 is enough, so 5 flip-flops.">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 4.8 Three resistors in parallel across one source.
function Resistor({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const n = 6;
  const step = (y2 - y1) / n;
  const pts = Array.from({ length: n + 1 }, (_, i) => `${i === 0 || i === n ? x : x + (i % 2 ? 9 : -9)} ${y1 + i * step}`);
  return <path d={`M${pts.join("L")}`} fill="none" stroke="var(--brand-2)" strokeWidth={2} strokeLinejoin="round" />;
}

export function ParallelCircuit() {
  const top = 50;
  const bot = 210;
  const xs = [220, 340, 460];
  const labels = [
    ["6 Ω", "I1 = 2 A"],
    ["9 Ω", "I2 = ?"],
    ["R = ?", "P = 12 W"],
  ];
  return (
    <Figure w={560} h={250} title="Source E across three parallel branches: 6 Ω, 9 Ω and R" caption="Every branch sees the same voltage; the source current is the sum of the branch currents.">
      {(a) => (
        <g>
          <Wire pts={[[70, 110], [70, top], [500, top]]} />
          <Wire pts={[[70, 140], [70, bot], [500, bot]]} />
          <line x1={50} x2={90} y1={110} y2={110} stroke="var(--ink)" strokeWidth={2.4} />
          <line x1={60} x2={80} y1={124} y2={124} stroke="var(--ink)" strokeWidth={4} />
          <line x1={70} x2={70} y1={124} y2={140} stroke="var(--ink)" strokeWidth={1.6} />
          {txt(40, 117, "E", "end")}
          <path d={`M120 ${top}H160`} stroke="var(--brand)" strokeWidth={2} markerEnd={a} />
          {txt(140, top - 14, "I", "middle", "var(--brand)")}
          {xs.map((x, i) => (
            <g key={x}>
              <Wire pts={[[x, top], [x, 100]]} dot={[[x, top]]} />
              <Resistor x={x} y1={100} y2={160} />
              <Wire pts={[[x, 160], [x, bot]]} dot={[[x, bot]]} />
              <path d={`M${x - 22} 74V96`} stroke="var(--brand)" strokeWidth={2} markerEnd={a} />
              {txt(x + 16, 120, labels[i][0])}
              {txt(x + 16, 140, labels[i][1], "start", "var(--muted)")}
            </g>
          ))}
        </g>
      )}
    </Figure>
  );
}

// ── 4.9 Two-bit flash ADC.
export function FlashAdc() {
  const taps = [
    { y: 100, label: "¾ Vref", c: "C3" },
    { y: 170, label: "½ Vref", c: "C2" },
    { y: 240, label: "¼ Vref", c: "C1" },
  ];
  const t = tone("brand");
  return (
    <Figure w={580} h={340} title="2-bit flash ADC: resistor ladder, three comparators, priority encoder" caption="Each comparator outputs 1 when Vin is above its tap voltage; the encoder turns the 0001/0011/0111 pattern into two bits.">
      {() => (
        <g>
          {txt(80, 18, "Vref", "middle")}
          <Wire pts={[[80, 28], [80, 40]]} />
          {[40, 110, 180, 250].map((y) => (
            <Resistor key={y} x={80} y1={y} y2={y + 50} />
          ))}
          <Wire pts={[[80, 90], [80, 110]]} />
          <Wire pts={[[80, 160], [80, 180]]} />
          <Wire pts={[[80, 230], [80, 250]]} />
          <Wire pts={[[80, 300], [80, 312]]} />
          <path d="M66 312H94M71 318H89M76 324H84" stroke="var(--ink)" strokeWidth={1.6} />
          {txt(150, 18, "Vin", "middle", "var(--brand)")}
          <Wire pts={[[150, 28], [150, taps[2].y - 10]]} />
          {taps.map(({ y, label, c }) => (
            <g key={c}>
              {txt(74, y, label, "end", "var(--muted)")}
              <Wire pts={[[80, y + 4], [190, y + 4], [190, y + 10], [230, y + 10]]} dot={[[80, y + 4]]} />
              <Wire pts={[[150, y - 10], [230, y - 10]]} dot={[[150, y - 10]]} />
              <path d={`M230 ${y - 26}L290 ${y}L230 ${y + 26}Z`} fill={t.fill} stroke={t.stroke} strokeWidth={1.8} />
              {txt(236, y - 10, "+")}
              {txt(236, y + 10, "−")}
              <Wire pts={[[290, y], [350, y]]} />
              {txt(300, y - 10, c, "start", "var(--brand)")}
            </g>
          ))}
          <rect x={350} y={76} width={120} height={188} rx={10} fill="var(--gold-soft)" stroke="var(--gold)" strokeWidth={1.6} />
          <Label x={410} y={170} lines={"Priority\nencoder\n(3 → 2)"} size={13} weight={700} color="var(--heading)" />
          <Wire pts={[[470, 140], [530, 140]]} />
          <Wire pts={[[470, 200], [530, 200]]} />
          {txt(534, 140, "B1")}
          {txt(534, 200, "B0")}
        </g>
      )}
    </Figure>
  );
}

// ── 4.10 Sending 10110010 serially vs in parallel.
export function SerialParallel() {
  const byte = "10110010"; // D7 … D0
  const box = (x: number, y: number, h: number, s: string) => (
    <g>
      <rect x={x} y={y} width={70} height={h} rx={8} fill="var(--brand-soft)" stroke="var(--brand-2)" />
      <Label x={x + 35} y={y + h / 2} lines={s} size={13} weight={700} color="var(--heading)" />
    </g>
  );
  return (
    <Figure w={600} h={350} title="Parallel and serial transmission of the byte 10110010" caption="Parallel: eight wires, one clock. Serial: one wire, eight clocks.">
      {(a) => (
        <g>
          {txt(300, 14, "Parallel — 8 wires, all bits in one clock", "middle", "var(--brand)")}
          {box(20, 30, 176, "TX")}
          {box(510, 30, 176, "RX")}
          {Array.from({ length: 8 }, (_, i) => {
            const y = 42 + i * 21;
            return (
              <g key={i}>
                <path d={`M90 ${y}H508`} stroke="var(--ink)" strokeOpacity={0.7} strokeWidth={1.4} markerEnd={a} />
                {txt(100, y - 7, `D${i}`, "start", "var(--muted)")}
                <Label x={300} y={y - 7} lines={byte[7 - i]} size={13} weight={700} color="var(--brand)" />
              </g>
            );
          })}
          {txt(300, 236, "Serial — 1 wire, one bit per clock (MSB first)", "middle", "var(--brand)")}
          {box(20, 252, 60, "TX")}
          {box(510, 252, 60, "RX")}
          <path d="M90 282H508" stroke="var(--ink)" strokeOpacity={0.7} strokeWidth={1.4} markerEnd={a} />
          {byte.split("").map((b, i) => (
            <g key={i}>
              <rect x={128 + i * 44} y={264} width={34} height={22} rx={5} fill="var(--gold-soft)" stroke="var(--gold)" />
              <Label x={145 + i * 44} y={275} lines={b} size={13} weight={700} color="var(--heading)" />
              <Label x={145 + i * 44} y={302} lines={`t${i + 1}`} size={11} color="var(--muted)" />
            </g>
          ))}
        </g>
      )}
    </Figure>
  );
}

// ── 4.11 8086 internal architecture, parts lettered A–E.
export function Cpu8086() {
  const nodes: Node[] = [
    { id: "biu", x: 360, y: 105, w: 680, h: 170, shape: "group", label: "A · Bus Interface Unit (BIU) — fetches", tone: "brand" },
    { id: "eu", x: 360, y: 315, w: 680, h: 190, shape: "group", label: "B · Execution Unit (EU) — executes", tone: "gold" },
    { id: "seg", x: 130, y: 115, w: 180, h: 72, label: "Segment registers\nCS · DS · SS · ES\nIP (instruction pointer)", size: 12, tone: "plain" },
    { id: "add", x: 330, y: 115, w: 140, h: 56, label: "Σ Address adder\n20-bit physical", size: 12, tone: "plain" },
    { id: "bus", x: 560, y: 70, w: 170, h: 40, label: "Bus control → memory", size: 12, tone: "plain" },
    { id: "q", x: 560, y: 145, w: 190, h: 46, label: "D · Instruction queue\n6 bytes", size: 12, tone: "brand" },
    { id: "reg", x: 130, y: 315, w: 180, h: 76, label: "General registers\nAX BX CX DX\nSP BP SI DI", size: 12, tone: "plain" },
    { id: "alu", x: 350, y: 315, w: 130, h: 46, label: "C · ALU", tone: "gold" },
    { id: "flag", x: 350, y: 385, w: 130, h: 36, label: "Flag register", size: 12, tone: "plain" },
    { id: "cu", x: 560, y: 315, w: 180, h: 56, label: "E · Control unit\ndecode + timing", size: 12, tone: "gold" },
  ];
  const edges: Edge[] = [
    { from: "seg", to: "add" },
    { from: "add", to: "bus", via: [[460, 115], [460, 70]] },
    { from: "bus", to: "q", label: "prefetch" },
    { from: "q", to: "cu", label: "next instruction" },
    { from: "cu", to: "alu" },
    { from: "reg", to: "alu" },
    { from: "alu", to: "flag" },
  ];
  return (
    <Figure w={720} h={420} title="8086 block diagram: BIU and EU" caption="While the EU executes one instruction, the BIU is already fetching the next ones into the 6-byte queue (pipelining).">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 4.13 Gas-leak sensor to microcontroller.
export function GasSensor() {
  const nodes: Node[] = [
    { id: "s", x: 80, y: 125, w: 120, h: 56, label: "Gas sensor\n(e.g. MQ-6)", tone: "gold" },
    { id: "cmp", x: 170, y: 210, w: 116, h: 44, label: "Comparator\n(threshold)", size: 12, tone: "plain" },
    { id: "mcu", x: 400, y: 125, w: 140, h: 200, label: "Micro-\ncontroller", tone: "deep" },
    { id: "b", x: 610, y: 45, w: 130, h: 36, label: "Buzzer / alarm", size: 12, tone: "red" },
    { id: "l", x: 610, y: 98, w: 130, h: 36, label: "Warning LED", size: 12, tone: "plain" },
    { id: "g", x: 610, y: 151, w: 130, h: 36, label: "GSM → SMS", size: 12, tone: "plain" },
    { id: "v", x: 610, y: 204, w: 130, h: 36, label: "Valve shut-off", size: 12, tone: "plain" },
  ];
  const edges: Edge[] = [
    { from: "s", to: "mcu", label: "analog voltage → ADC pin" },
    { from: "s", to: "cmp", via: [[80, 210]] },
    { from: "cmp", to: "mcu", toAt: [330, 210], label: "HIGH → INT" },
    { from: "mcu", to: "b" },
    { from: "mcu", to: "l" },
    { from: "mcu", to: "g" },
    { from: "mcu", to: "v" },
  ];
  return (
    <Figure w={690} h={240} title="Gas-leak detector: sensor signals into a microcontroller" caption="The sensor's analog voltage goes to an ADC pin; a comparator can also raise a digital HIGH on an interrupt pin the moment the limit is crossed.">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

