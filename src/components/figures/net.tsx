import { Figure, Graph, Label, type Edge, type Node, type Tone } from "./kit";

// ── 5.2 The seven OSI layers with their protocols and data unit.
export function OsiStack() {
  const layers: [string, string, string, Tone][] = [
    ["7 · Application", "HTTP, SMTP, FTP, DNS", "Data", "gold"],
    ["6 · Presentation", "encryption, compression, format", "Data", "gold"],
    ["5 · Session", "open / keep / close dialogue", "Data", "gold"],
    ["4 · Transport", "TCP, UDP, ports", "Segment", "brand"],
    ["3 · Network", "IP, routing, routers", "Packet", "brand"],
    ["2 · Data link", "MAC, frames, switches", "Frame", "plain"],
    ["1 · Physical", "bits, cables, signals, hubs", "Bits", "plain"],
  ];
  const nodes: Node[] = layers.flatMap(([name, what, pdu, tone], i) => [
    { id: `l${i}`, x: 250, y: 46 + i * 48, w: 400, h: 40, label: `${name} — ${what}`, size: 13, tone },
    { id: `p${i}`, x: 540, y: 46 + i * 48, w: 100, h: 32, shape: "pill" as const, label: pdu, size: 12, tone: "muted" as const },
  ]);
  return (
    <Figure w={610} h={390} title="OSI model: seven layers" caption="Memory aid from layer 7 down: All People Seem To Need Data Processing.">
      {(a) => (
        <Graph nodes={nodes} edges={[]} arrowId={a}>
          <Label x={250} y={14} lines="Layer — what it does" size={12} weight={700} color="var(--muted)" />
          <Label x={540} y={14} lines="Data unit" size={12} weight={700} color="var(--muted)" />
        </Graph>
      )}
    </Figure>
  );
}

// ── 5.5 What it takes to put customer data on a website.
export function WebStack() {
  const nodes: Node[] = [
    { id: "u", x: 70, y: 60, w: 120, h: 50, label: "Customer\n(browser)", tone: "plain" },
    { id: "dns", x: 215, y: 60, w: 120, h: 50, label: "Domain\n+ DNS", tone: "brand" },
    { id: "fw", x: 360, y: 60, w: 120, h: 50, label: "Firewall\n+ SSL/TLS", tone: "brand" },
    { id: "web", x: 505, y: 60, w: 120, h: 50, label: "Web server\nNginx / Apache", size: 12, tone: "brand" },
    { id: "app", x: 650, y: 60, w: 120, h: 50, label: "Application\n(PHP / Java)", size: 12, tone: "deep" },
    { id: "db", x: 650, y: 190, w: 120, h: 50, label: "Database\n(MySQL / PgSQL)", size: 12, tone: "gold" },
    { id: "bk", x: 470, y: 190, w: 120, h: 50, label: "Backup +\nmonitoring", size: 12, tone: "plain" },
    { id: "gw", x: 260, y: 190, w: 170, h: 50, label: "SMS · email ·\npayment gateway", size: 12, tone: "plain" },
  ];
  const edges: Edge[] = [
    { from: "u", to: "dns" },
    { from: "dns", to: "fw" },
    { from: "fw", to: "web" },
    { from: "web", to: "app" },
    { from: "app", to: "db" },
    { from: "db", to: "bk" },
    { from: "app", to: "gw", fromAt: [610, 85], via: [[610, 130], [260, 130]] },
  ];
  return (
    <Figure w={720} h={230} title="Software and services behind a customer-information website">
      {(a) => <Graph nodes={nodes} edges={edges} arrowId={a} />}
    </Figure>
  );
}

// ── 5.7 TCP three-way handshake as a sequence diagram.
export function TcpHandshake() {
  const cx = 130;
  const sx = 450;
  const msg = (y: number, from: number, to: number, text: string, a: string) => (
    <g>
      <path d={`M${from} ${y}L${to} ${y + 24}`} stroke="var(--brand)" strokeWidth={1.8} markerEnd={a} />
      <Label x={(from + to) / 2} y={y - 6} lines={text} size={13} weight={600} color="var(--heading)" />
    </g>
  );
  const state = (x: number, y: number, s: string, anchor: "start" | "end") => (
    <Label x={x} y={y} lines={s} size={11} weight={700} color="var(--warn-ink)" anchor={anchor} />
  );
  return (
    <Figure w={580} h={300} title="TCP three-way handshake between client and server" caption="Each side picks a starting sequence number and confirms the other's (+1). Only then does data flow.">
      {(a) => (
        <g>
          {[
            [cx, "Client"],
            [sx, "Server"],
          ].map(([x, t]) => (
            <g key={t}>
              <rect x={(x as number) - 60} y={10} width={120} height={36} rx={10} fill="var(--brand)" />
              <Label x={x as number} y={28} lines={t as string} size={14} weight={700} color="#fff" />
              <line x1={x} x2={x} y1={46} y2={290} stroke="var(--muted)" strokeDasharray="5 5" />
            </g>
          ))}
          {msg(70, cx, sx, "① SYN  seq = x", a)}
          {msg(128, sx, cx, "② SYN-ACK  seq = y, ack = x + 1", a)}
          {msg(186, cx, sx, "③ ACK  ack = y + 1", a)}
          {state(cx - 8, 70, "SYN_SENT", "end")}
          {state(sx + 8, 64, "LISTEN", "start")}
          {state(sx + 8, 96, "SYN_RCVD", "start")}
          {state(cx - 8, 156, "ESTABLISHED", "end")}
          {state(sx + 8, 212, "ESTABLISHED", "start")}
          <rect x={cx + 20} y={238} width={sx - cx - 40} height={30} rx={8} fill="var(--gold-soft)" />
          <Label x={(cx + sx) / 2} y={253} lines="connection open — data can flow both ways" size={12} weight={600} color="var(--warn-ink)" />
        </g>
      )}
    </Figure>
  );
}

// ── 5.16 Scaling up vs scaling out.
function Server({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  const slots = Math.max(2, Math.round(h / 22));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="var(--deep)" />
      {Array.from({ length: slots }, (_, i) => (
        <g key={i}>
          <rect x={x + 6} y={y + 6 + i * ((h - 12) / slots)} width={w - 12} height={(h - 12) / slots - 4} rx={3} fill="#ffffff1f" />
          <circle cx={x + w - 14} cy={y + 6 + i * ((h - 12) / slots) + ((h - 12) / slots - 4) / 2} r={2.4} fill="var(--mint)" />
        </g>
      ))}
      <Label x={x + w / 2} y={y + h + 16} lines={label} size={12} weight={600} />
    </g>
  );
}

export function Scaling() {
  return (
    <Figure w={720} h={270} title="Vertical scaling (bigger server) vs horizontal scaling (more servers)" caption="Scale up: one machine gets more CPU and RAM. Scale out: a load balancer spreads requests over many machines.">
      {(a) => (
        <g>
          <Label x={160} y={16} lines="Vertical — scale up" size={14} weight={700} color="var(--brand)" />
          <Server x={30} y={110} w={70} h={60} label="4 vCPU · 8 GB" />
          <path d="M115 140H175" stroke="var(--gold)" strokeWidth={3} markerEnd={a} />
          <Server x={200} y={50} w={100} h={150} label="16 vCPU · 32 GB" />
          <line x1={350} x2={350} y1={20} y2={250} stroke="var(--line)" />
          <Label x={540} y={16} lines="Horizontal — scale out" size={14} weight={700} color="var(--brand)" />
          <Graph
            arrowId={a}
            nodes={[
              { id: "u", x: 540, y: 52, w: 130, h: 32, shape: "pill", label: "user requests", size: 12, tone: "plain" },
              { id: "lb", x: 540, y: 110, w: 150, h: 36, label: "Load balancer", size: 13, tone: "gold" },
            ]}
            edges={[
              { from: "u", to: "lb" },
            ]}
          />
          {[
            [490, 430],
            [540, 540],
            [590, 650],
          ].map(([x1, x2]) => (
            <path key={x2} d={`M${x1} 128L${x2} 172`} stroke="var(--ink)" strokeOpacity={0.75} strokeWidth={1.5} markerEnd={a} />
          ))}
          {[400, 510, 620].map((x, i) => (
            <Server key={x} x={x} y={176} w={60} h={50} label={`server ${i + 1}`} />
          ))}
        </g>
      )}
    </Figure>
  );
}
