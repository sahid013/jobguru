import { Figure, Graph, Label, tone, type Edge, type Node } from "./kit";

// ── 1.1 Waterfall: six phases as a staircase, each handing its output down to the next.
export function Waterfall() {
  const phases = [
    ["Requirements", "SRS document"],
    ["Design", "SDD: architecture, UI"],
    ["Implementation", "code + unit tests"],
    ["Testing", "test report, fixed build"],
    ["Deployment", "installed system"],
    ["Maintenance", "fixes & enhancements"],
  ];
  const nodes: Node[] = phases.map(([t, out], i) => ({
    id: `p${i}`,
    x: 90 + i * 105,
    y: 34 + i * 58,
    w: 170,
    h: 44,
    label: `${i + 1}. ${t}\n${out}`,
    size: 12,
    tone: i % 2 ? "gold" : "brand",
  }));
  const edges: Edge[] = phases.slice(1).map((_, i) => ({
    from: `p${i}`,
    to: `p${i + 1}`,
    // leave to the right, drop straight onto the next step
    via: [[90 + (i + 1) * 105, 34 + i * 58]],
  }));
  return (
    <Figure w={720} h={370} title="Waterfall model: six phases in strict order" caption="Each phase starts only after the one above is finished and signed off.">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 1.6 Library management: a class diagram drawn in UML notation.
type Cls = { x: number; y: number; name: string; attrs: string[]; ops: string[]; abstract?: boolean };
const CW = 196;
const clsH = (c: Cls) => 28 + c.attrs.length * 17 + 10 + c.ops.length * 17 + 10;

function ClassBox({ c }: { c: Cls }) {
  const h = clsH(c);
  const a = 28 + c.attrs.length * 17 + 10;
  const t = tone("brand");
  return (
    <g>
      <rect x={c.x} y={c.y} width={CW} height={h} rx={6} fill="var(--surface)" stroke={t.stroke} strokeWidth={1.6} />
      <path d={`M${c.x} ${c.y + 6}a6 6 0 0 1 6 -6h${CW - 12}a6 6 0 0 1 6 6v22h-${CW}z`} fill="var(--brand)" />
      <Label x={c.x + CW / 2} y={c.y + 14} lines={c.abstract ? `«abstract» ${c.name}` : c.name} size={13} weight={700} color="#fff" italic={c.abstract} />
      <line x1={c.x} x2={c.x + CW} y1={c.y + a} y2={c.y + a} stroke={t.stroke} />
      {c.attrs.map((s, i) => (
        <Label key={s} x={c.x + 10} y={c.y + 28 + 13 + i * 17} lines={s} size={12} anchor="start" />
      ))}
      {c.ops.map((s, i) => (
        <Label key={s} x={c.x + 10} y={c.y + a + 13 + i * 17} lines={s} size={12} anchor="start" />
      ))}
    </g>
  );
}

export function LibraryClasses() {
  const person: Cls = { x: 282, y: 14, name: "Person", attrs: ["- id: int", "- name: String", "- email: String"], ops: ["+ login(): bool"], abstract: true };
  const member: Cls = { x: 28, y: 180, name: "Member", attrs: ["- memberType: String", "- maxLoans: int"], ops: ["+ searchBook(q): List", "+ reserve(b: Book)"] };
  const lib: Cls = { x: 536, y: 180, name: "Librarian", attrs: ["- staffId: int"], ops: ["+ addBook(b: Book)", "+ issueBook(m, b): Loan", "+ receiveReturn(l: Loan)"] };
  const loan: Cls = { x: 282, y: 262, name: "Loan", attrs: ["- loanId: int", "- issueDate: Date", "- dueDate: Date", "- returnDate: Date"], ops: ["+ fine(): double"] };
  const book: Cls = { x: 282, y: 456, name: "Book", attrs: ["- isbn: String", "- title: String", "- author: String", "- status: String"], ops: ["+ isAvailable(): bool"] };
  const line = { fill: "none", stroke: "var(--ink)", strokeWidth: 1.5 };
  const px = person.x + CW / 2;
  const pBottom = person.y + clsH(person);
  const mx = member.x + CW / 2;
  const lx = lib.x + CW / 2;
  const loanTop = loan.y + 40;
  const loanBottom = loan.y + clsH(loan);
  const small = (x: number, y: number, s: string, anchor: "start" | "end" | "middle" = "middle") => (
    <Label x={x} y={y} lines={s} size={12} weight={700} color="var(--brand-2)" anchor={anchor} />
  );
  return (
    <Figure w={760} h={600} title="Library management system class diagram" caption="Member and Librarian inherit from Person. A Loan joins one Member, one Book and the Librarian who issued it.">
      {() => (
        <g>
          {/* inheritance: hollow triangle on the parent */}
          <path d={`M${px} ${pBottom + 16}V${pBottom + 26}M${mx} ${member.y}V${pBottom + 26}H${lx}V${lib.y}`} {...line} />
          <path d={`M${px} ${pBottom}l-9 16h18z`} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.5} />
          {/* associations */}
          <path d={`M${member.x + CW} ${member.y + 60}H${member.x + CW + 30}V${loanTop}H${loan.x}`} {...line} />
          <path d={`M${lib.x} ${lib.y + 60}H${lib.x - 30}V${loanTop}H${loan.x + CW}`} {...line} />
          <path d={`M${px} ${loanBottom}V${book.y}`} {...line} />
          {small(member.x + CW + 6, member.y + 50, "1", "start")}
          {small(loan.x - 6, loanTop - 10, "0..*", "end")}
          {small(member.x + CW + 34, loanTop - 50, "borrows", "start")}
          {small(lib.x - 6, lib.y + 50, "1", "end")}
          {small(loan.x + CW + 6, loanTop - 10, "0..*", "start")}
          {small(lib.x - 34, loanTop - 50, "issues", "end")}
          {small(px + 8, loanBottom + 14, "0..*", "start")}
          {small(px + 8, book.y - 12, "1", "start")}
          {small(px - 10, (loanBottom + book.y) / 2, "for", "end")}
          {[person, member, lib, loan, book].map((c) => (
            <ClassBox key={c.name} c={c} />
          ))}
        </g>
      )}
    </Figure>
  );
}

// ── 2.6 Prime check flowchart.
export function PrimeFlow() {
  const nodes: Node[] = [
    { id: "s", x: 200, y: 30, w: 110, h: 40, shape: "pill", label: "Start", tone: "deep" },
    { id: "in", x: 200, y: 98, w: 150, h: 42, shape: "para", label: "Input N", tone: "plain" },
    { id: "d1", x: 200, y: 182, w: 150, h: 70, shape: "diamond", label: "N ≤ 1 ?", tone: "gold" },
    { id: "i2", x: 200, y: 268, w: 120, h: 40, label: "i = 2", tone: "plain" },
    { id: "d2", x: 200, y: 356, w: 170, h: 76, shape: "diamond", label: "i × i ≤ N ?", tone: "gold" },
    { id: "d3", x: 200, y: 470, w: 180, h: 76, shape: "diamond", label: "N mod i = 0 ?", tone: "gold" },
    { id: "inc", x: 200, y: 566, w: 120, h: 40, label: "i = i + 1", tone: "plain" },
    { id: "np1", x: 440, y: 182, w: 150, h: 46, label: "Print\n“Not prime”", tone: "red" },
    { id: "p", x: 440, y: 356, w: 150, h: 46, label: "Print “Prime”", tone: "brand" },
    { id: "np2", x: 440, y: 470, w: 150, h: 46, label: "Print\n“Not prime”", tone: "red" },
    { id: "e", x: 440, y: 640, w: 110, h: 40, shape: "pill", label: "End", tone: "deep" },
  ];
  const edges: Edge[] = [
    { from: "s", to: "in" },
    { from: "in", to: "d1" },
    { from: "d1", to: "np1", label: "Yes" },
    { from: "d1", to: "i2", label: "No", labelDx: 18 },
    { from: "i2", to: "d2" },
    { from: "d2", to: "p", label: "No" },
    { from: "d2", to: "d3", label: "Yes", labelDx: 20 },
    { from: "d3", to: "np2", label: "Yes" },
    { from: "d3", to: "inc", label: "No", labelDx: 18 },
    { from: "inc", to: "d2", via: [[70, 566], [70, 356]] },
    { from: "np1", to: "e", via: [[620, 182], [620, 640]] },
    { from: "p", to: "e", via: [[580, 356], [580, 640]] },
    { from: "np2", to: "e" },
  ];
  return (
    <Figure w={660} h={676} title="Flowchart: is N a prime number?" caption="Trying divisors only up to √N is enough: if N = a × b, one of a and b is at most √N.">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 2.11 What the HTML form looks like in a browser (a live, disabled preview).
export function FormPreview() {
  const field = "w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-[0.95rem]";
  return (
    <figure className="diagram">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-[0_12px_32px_#034e3a1a]" lang="en">
        <p className="bg-gradient-to-r from-brand to-brand-2 px-5 py-3 font-semibold text-white">Registration form</p>
        <div className="grid gap-3 p-5 text-[0.95rem]">
          {(["Name", "Email", "Password"] as const).map((l) => (
            <label key={l} className="grid gap-1">
              <span className="font-medium">
                {l} <span className="text-[#e5484d]">*</span>
              </span>
              <input disabled className={field} placeholder={l === "Password" ? "••••••••" : `Enter your ${l.toLowerCase()}`} />
            </label>
          ))}
          <div className="flex items-center gap-4">
            <span className="font-medium">Gender:</span>
            <label className="flex items-center gap-1.5">
              <input type="radio" disabled defaultChecked name="g-demo" /> Male
            </label>
            <label className="flex items-center gap-1.5">
              <input type="radio" disabled name="g-demo" /> Female
            </label>
          </div>
          <label className="grid gap-1">
            <span className="font-medium">Department</span>
            <select disabled className={field}>
              <option>CSE</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="font-medium">Message</span>
            <textarea disabled rows={2} className={field} placeholder="Write your message…" />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" disabled /> I agree
          </label>
          <span className="rounded-lg bg-brand py-2 text-center font-semibold text-white">Submit</span>
        </div>
      </div>
      <figcaption>How the form above renders. Inputs are disabled here; it is only a preview.</figcaption>
    </figure>
  );
}
