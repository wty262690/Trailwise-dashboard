import React from "react";
import {
  Activity,
  BookOpen,
  CircleDot,
  Copy,
  Download,
  LayoutDashboard,
  PanelsTopLeft,
  Play,
  Radio,
  Route,
  Search,
  Settings,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type Tone = "neutral" | "dark" | "green" | "amber" | "blue";
type ViewKey = "trace" | "data" | "outputs";

type Status = {
  label: string;
  tone?: Tone;
};

type Metric = {
  label: string;
  value: string;
  tone?: Tone;
};

type TimelineRow = {
  step: string;
  action: string;
  state: string;
  output: string;
  tone?: Tone;
  selected?: boolean;
};

type InspectorSection = {
  title: string;
  tag?: Status;
  rows: Array<{ label: string; value: string; tone?: Tone }>;
};

type ViewConfig = {
  key: ViewKey;
  label: string;
  breadcrumb: string;
  title: string;
  statuses: Status[];
  activeTab: "Trace" | "Runbook";
  summary: {
    title: string;
    description: string;
    metrics: Metric[];
    action?: string;
  };
  timeline: {
    title: string;
    description: string;
    headers: [string, string, string, string];
    rows: TimelineRow[];
    mapTitle: string;
    mapItems: string[];
  };
  runbook: {
    title: string;
    description: string;
    action: string;
    tabs: string[];
    code: string[];
  };
  inspector: {
    eyebrow: string;
    title: string;
    tag: Status;
    subtitle: string;
    sections: InspectorSection[];
    action: string;
    artifacts: Array<{ title: string; meta: string; badge: string }>;
  };
};

const views: ViewConfig[] = [
  {
    key: "trace",
    label: "09A / Project Detail + Trace",
    breadcrumb: "Trailwise / Projects / Expense Approval / Trace detail",
    title: "Expense approval workflow",
    statuses: [
      { label: "Awaiting Mac", tone: "amber" },
      { label: "14 events" },
      { label: "Runbook draft" },
    ],
    activeTab: "Trace",
    summary: {
      title: "Ready to record Chrome workflow.",
      description:
        "Local helper has prepared the recording handoff. The browser will start only after local confirmation.",
      action: "Start",
      metrics: [
        { label: "Device", value: "Ready", tone: "green" },
        { label: "Extension", value: "Checked", tone: "green" },
        { label: "Screen", value: "Off" },
        { label: "Session", value: "Active" },
      ],
    },
    timeline: {
      title: "Trace timeline",
      description: "List-detail flow: selecting an event updates the inspector.",
      headers: ["Step", "Action", "State", "Time"],
      mapTitle: "Flow map",
      mapItems: ["Nav", "Input", "Submit", "Verify"],
      rows: [
        { step: "1", action: "Open http://localhost:5173/expenses", state: "Done", output: "10:24:12", tone: "green" },
        { step: "2", action: "Click Create request", state: "Done", output: "10:24:18", tone: "green" },
        { step: "3", action: "Enter amount and approver", state: "Done", output: "10:24:25", tone: "green" },
        {
          step: "4",
          action: "Submit approval request",
          state: "Selected",
          output: "10:24:38",
          tone: "dark",
          selected: true,
        },
        { step: "5", action: "Wait for success confirmation", state: "Pending", output: "--:--", tone: "amber" },
        { step: "6", action: "Capture result state", state: "Pending", output: "--:--", tone: "amber" },
      ],
    },
    runbook: {
      title: "Generated Runbook",
      description: "Structured output remains attached to this recording.",
      action: "Open draft",
      tabs: ["expense_runbook.md", "trace.json"],
      code: [
        "$ trailwise trace inspect expense-approval",
        "signed trace: 14 browser events",
        "secrets redacted: 3 fields",
        "runbook generated: expense_runbook.md",
        "validation target: Codex handoff",
      ],
    },
    inspector: {
      eyebrow: "TRACE INSPECTOR",
      title: "Submit approval request",
      tag: { label: "Selected" },
      subtitle: "Event 4 from the selected Expense approval recording.",
      action: "Confirm locally on the Mac",
      sections: [
        {
          title: "Event properties",
          rows: [
            { label: "Selector", value: "button[type=submit]" },
            { label: "Action", value: "click" },
            { label: "Result", value: "waiting for success state", tone: "amber" },
            { label: "Timestamp", value: "10:24:38" },
          ],
        },
        {
          title: "Local handoff",
          tag: { label: "Awaiting", tone: "amber" },
          rows: [
            { label: "Device", value: "Sun Junxiao MacBook Pro" },
            { label: "Target", value: "localhost:5173" },
            { label: "Session", value: "sess_mr0re8sa_8u0xr4" },
          ],
        },
      ],
      artifacts: [
        { title: "Structured trace", meta: "14 parsed events", badge: "OK" },
        { title: "Runbook", meta: "draft available", badge: "1" },
        { title: "Trace bundle", meta: "signed and redacted", badge: "OK" },
      ],
    },
  },
  {
    key: "data",
    label: "09C / Data Visualization",
    breadcrumb: "Trailwise / Projects / Expense Approval / Data visualization",
    title: "Data Visualization",
    statuses: [
      { label: "Parsed", tone: "amber" },
      { label: "14 events" },
      { label: "3 redacted" },
    ],
    activeTab: "Trace",
    summary: {
      title: "Video and trace preview",
      description: "Inspect recorded video, browser events, and redacted inputs before generating artifacts.",
      metrics: [
        { label: "Duration", value: "02:18" },
        { label: "Events", value: "14" },
        { label: "Redacted", value: "3" },
        { label: "Artifacts", value: "2" },
      ],
    },
    timeline: {
      title: "Event table",
      description: "Video timeline and browser events stay linked to the selected row.",
      headers: ["Time", "Event", "Type", "State"],
      mapTitle: "Timeline",
      mapItems: ["nav", "click", "input", "assert"],
      rows: [
        { step: "00:03", action: "Opened https://demo.trailwise.app/expenses", state: "nav", output: "Done", tone: "green" },
        { step: "00:19", action: "Selected row: Quinn Medical reimbursement", state: "click", output: "Done", tone: "green" },
        { step: "00:31", action: "Typed approval note. Secret fields redacted.", state: "input", output: "Redacted", tone: "amber" },
        {
          step: "00:42",
          action: "Confirmation toast: Expense approved",
          state: "assert",
          output: "Selected",
          tone: "dark",
          selected: true,
        },
        { step: "", action: "Extension disconnect preserves last valid state.", state: "Fallback", output: "Fallback" },
        { step: "", action: "Passwords, tokens, card numbers, and private notes are masked.", state: "policy", output: "Active" },
      ],
    },
    runbook: {
      title: "Trace inventory and safeguards",
      description: "Recorded data is prepared for Codex analysis with privacy controls.",
      action: "Open data",
      tabs: ["trace_inventory.json", "policy.md"],
      code: [
        "Trace inventory",
        "1 video trace / 14 browser events",
        "3 redacted inputs / 2 artifacts",
        "0 unresolved selectors",
        "extension disconnect keeps the last valid project state",
      ],
    },
    inspector: {
      eyebrow: "TRACE CONTEXT",
      title: "Expense approval table",
      tag: { label: "Selected" },
      subtitle: "Click target row, open detail drawer, approve with note.",
      action: "View trace details",
      sections: [
        {
          title: "Trace inventory",
          rows: [
            { label: "Video", value: "1 trace / 02:18" },
            { label: "Events", value: "14 browser events" },
            { label: "Selectors", value: "0 unresolved", tone: "amber" },
            { label: "Timestamp", value: "10:24:38" },
          ],
        },
        {
          title: "Redaction policy",
          tag: { label: "Awaiting", tone: "amber" },
          rows: [
            { label: "Masked", value: "tokens, cards, private notes" },
            { label: "Manual", value: "users may mark extra fields" },
            { label: "Fallback", value: "last valid state preserved" },
          ],
        },
      ],
      artifacts: [
        { title: "Structured trace", meta: "14 parsed events", badge: "OK" },
        { title: "Runbook", meta: "draft available", badge: "1" },
        { title: "Trace bundle", meta: "signed and redacted", badge: "OK" },
      ],
    },
  },
  {
    key: "outputs",
    label: "09D / Generated Outputs",
    breadcrumb: "Trailwise / Projects / Expense Approval / Generated outputs",
    title: "Generated Outputs",
    statuses: [
      { label: "Ready", tone: "amber" },
      { label: "Runbook" },
      { label: "Markdown" },
    ],
    activeTab: "Runbook",
    summary: {
      title: "Runbook artifact",
      description: "Review the generated Runbook output and export it as markdown.",
      action: "Regenerate",
      metrics: [
        { label: "Generated", value: "20h ago" },
        { label: "Confidence", value: "High", tone: "green" },
        { label: "Risk", value: "Low", tone: "green" },
        { label: "Source", value: "0626 trace" },
      ],
    },
    timeline: {
      title: "Operator path",
      description: "The generated Runbook keeps workflow steps and validation notes attached.",
      headers: ["Step", "Runbook action", "State", "Output"],
      mapTitle: "Outputs",
      mapItems: ["Runbook", "Notes", "Export", "History"],
      rows: [
        { step: "1", action: "Sign in as finance operator", state: "Done", output: "Runbook", tone: "green" },
        { step: "2", action: "Filter pending approval rows", state: "Done", output: "Runbook", tone: "green" },
        { step: "3", action: "Approve Quinn Medical with policy note", state: "Done", output: "Runbook", tone: "green" },
        {
          step: "4",
          action: "Confirm toast, audit event, Approved status",
          state: "Selected",
          output: "Runbook",
          tone: "dark",
          selected: true,
        },
        { step: "5", action: "Export Runbook with trace metadata", state: "Ready", output: "Export" },
        { step: "6", action: "Keep validation notes in project history", state: "Ready", output: "Notes" },
      ],
    },
    runbook: {
      title: "Structured Runbook Preview",
      description: "Generated markdown remains attached to the project trace.",
      action: "Preview",
      tabs: ["expense_runbook.md", "notes.md"],
      code: [
        "## Expense approval runbook",
        "1. Sign in as finance operator.",
        "2. Filter pending approval rows.",
        "3. Approve Quinn Medical with policy note.",
        "4. Confirm toast, audit event, and Approved status.",
        "5. Export Runbook with trace metadata.",
      ],
    },
    inspector: {
      eyebrow: "ARTIFACT CONTEXT",
      title: "Generated Runbook",
      tag: { label: "Selected" },
      subtitle: "Runbook output and export preparation.",
      action: "Export Runbook",
      sections: [
        {
          title: "Generation metadata",
          rows: [
            { label: "Generated", value: "20 hours ago" },
            { label: "Trace", value: "expense-approval-0626" },
            { label: "Confidence", value: "high / low missing risk", tone: "amber" },
            { label: "Timestamp", value: "10:24:38" },
          ],
        },
        {
          title: "Export options",
          tag: { label: "Awaiting", tone: "amber" },
          rows: [
            { label: "Download", value: "markdown Runbook" },
            { label: "Repo", value: "send to repo or history" },
            { label: "Web MVP", value: "Slack is not required" },
          ],
        },
      ],
      artifacts: [
        { title: "Structured trace", meta: "14 parsed events", badge: "OK" },
        { title: "Runbook", meta: "draft available", badge: "1" },
        { title: "Trace bundle", meta: "signed and redacted", badge: "OK" },
      ],
    },
  },
];

const projects = [
  { title: "Expense Approval", meta: "Project detail", count: "14", active: true },
  { title: "Onboarding Flow", meta: "2 recordings", count: "2" },
  { title: "Checkout QA", meta: "Runbook ready", count: "1", green: true },
];

const recordings = [
  { title: "Expense approval", url: "localhost:5173/expenses", state: "Awaiting", tone: "amber", active: true },
  { title: "Manager review", url: "localhost:5173/review", state: "Parsed", tone: "green" },
  { title: "Invoice review", url: "localhost:5173/invoice-review", state: "Runbook" },
  { title: "Policy update", url: "localhost:5173/settings", state: "Draft" },
];

export type TrailwiseLinearConsoleProps = {
  mode?: "board" | ViewKey;
  logoSrc?: string;
};

export default function TrailwiseLinearConsole({
  mode = "board",
  logoSrc = "./assets/trailwise-logo.png",
}: TrailwiseLinearConsoleProps) {
  const selectedViews = mode === "board" ? views : views.filter((view) => view.key === mode);

  return (
    <div className="tlc-root">
      <TlcStyles />
      {mode === "board" && (
        <header className="tlc-board-header">
          <h1>Trailwise 09 Console</h1>
          <p>Grid-aligned developer SaaS console exported from the latest Figma direction.</p>
        </header>
      )}
      <main className={mode === "board" ? "tlc-board" : "tlc-single"}>
        {selectedViews.map((view) => (
          <section className="tlc-screen-wrap" key={view.key}>
            {mode === "board" && (
              <div className="tlc-screen-label">
                <strong>{view.label}</strong>
                <span>80px rail / 256px sidebar / 24px content grid.</span>
              </div>
            )}
            <Screen logoSrc={logoSrc} view={view} />
          </section>
        ))}
      </main>
    </div>
  );
}

function Screen({ view, logoSrc }: { view: ViewConfig; logoSrc: string }) {
  return (
    <div className={`tlc-screen is-${view.key}`}>
      <TopBar logoSrc={logoSrc} />
      <IconRail />
      <Sidebar />
      <div className="tlc-workspace">
        <div className="tlc-header-surface" />
        <div className="tlc-header-grid" />
        <div className="tlc-breadcrumb">{view.breadcrumb}</div>
        <div className="tlc-title-icon">
          <Workflow size={21} strokeWidth={1.75} />
        </div>
        <div className="tlc-title-row">
          <h2>{view.title}</h2>
          <div className="tlc-status-row">
            {view.statuses.map((status) => (
              <Pill key={status.label} {...status} />
            ))}
          </div>
        </div>
        <div className="tlc-header-actions">
          <button className="tlc-button tlc-button-light">Cancel</button>
          <Button tone="dark" icon={Radio} label="Confirm locally" />
        </div>
        <Tabs active={view.activeTab} />
        <div className="tlc-columns">
          <div className="tlc-primary">
            <SummaryCard view={view} />
            <TimelineCard timeline={view.timeline} />
            <RunbookCard runbook={view.runbook} />
          </div>
          <Inspector inspector={view.inspector} />
        </div>
      </div>
    </div>
  );
}

function TopBar({ logoSrc }: { logoSrc: string }) {
  return (
    <div className="tlc-topbar">
      <img className="tlc-logo" src={logoSrc} alt="Trailwise" />
      <div className="tlc-search">
        <Search className="tlc-search-lucide" size={16} strokeWidth={1.75} />
        <span>Search recordings, runbooks, actions...</span>
        <kbd>Cmd K</kbd>
      </div>
      <nav className="tlc-nav" aria-label="Trailwise sections">
        <span>Product</span>
        <span>Runs</span>
        <span>Data</span>
        <span>Docs</span>
      </nav>
      <Pill label="Helper ready" />
      <Button icon={Activity} label="New run" />
      <Button tone="dark" icon={Play} label="Start" />
    </div>
  );
}

function IconRail() {
  const items = [
    { label: "Workspace", top: 112, icon: PanelsTopLeft },
    { label: "Dashboard", top: 176, icon: LayoutDashboard },
    { label: "Trace", top: 240, icon: Route },
    { label: "Runbook", top: 304, icon: BookOpen },
  ];

  return (
    <aside className="tlc-rail">
      <div className="tlc-account" title="Account">
        <span>AK</span>
      </div>
      <div className="tlc-rail-rule" />
      <div className="tlc-orbit" />
      {items.map((item, index) => (
        <div
          className={`tlc-rail-item ${index === 0 ? "is-active" : ""}`}
          key={item.label}
          style={{ top: item.top }}
          title={item.label}
        >
          <item.icon size={18} strokeWidth={1.75} />
        </div>
      ))}
      <div className="tlc-rail-item tlc-rail-settings" title="Settings">
        <Settings size={18} strokeWidth={1.75} />
      </div>
      <div className="tlc-rail-brand">
        <strong>TW</strong>
        <span>Trailwise</span>
        <small>v1.0.0</small>
      </div>
    </aside>
  );
}

function Sidebar() {
  return (
    <aside className="tlc-sidebar">
      <div className="tlc-workspace-name">ACME WORKSPACE</div>
      <div className="tlc-workspace-meta">4 projects / local helper on</div>
      <Button block tone="dark" icon={Play} label="New recording" />
      <SectionLabel>Projects</SectionLabel>
      <div className="tlc-list">
        {projects.map((project) => (
          <SidebarRow key={project.title} {...project} />
        ))}
      </div>
      <SectionLabel>Recent recordings</SectionLabel>
      <div className="tlc-recordings">
        {recordings.map((recording) => (
          <RecordingRow key={recording.title} {...recording} />
        ))}
      </div>
      <div className="tlc-sidebar-divider" />
      <div className="tlc-helper-card">
        <div className="tlc-helper-head">
          <strong>Local helper</strong>
          <Pill label="Ready" tone="green" />
        </div>
        <p>Mac confirmation is required before the browser recording starts.</p>
        <div className="tlc-progress">
          <span />
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="tlc-section-label">{children}</div>;
}

function SidebarRow(props: { title: string; meta: string; count: string; active?: boolean; green?: boolean }) {
  return (
    <div className={`tlc-sidebar-row ${props.active ? "is-active" : ""}`}>
      <div>
        <strong>{props.title}</strong>
        <span>{props.meta}</span>
      </div>
      <Pill label={props.count} tone={props.green ? "green" : props.active ? "blue" : "neutral"} />
    </div>
  );
}

function RecordingRow(props: { title: string; url: string; state: string; tone?: Tone; active?: boolean }) {
  return (
    <div className={`tlc-recording-row ${props.active ? "is-active" : ""}`}>
      <CircleDot className={`tlc-recording-icon tlc-recording-icon-${props.tone || "blue"}`} size={12} strokeWidth={1.9} />
      <div>
        <strong>{props.title}</strong>
        <span>{props.url}</span>
      </div>
      <Pill label={props.state} tone={props.tone} />
    </div>
  );
}

function Tabs({ active }: { active: "Trace" | "Runbook" }) {
  return (
    <div className="tlc-tabs">
      {["Overview", "Trace", "Runbook"].map((tab) => (
        <button className={tab === active ? "is-active" : ""} key={tab}>
          {tab}
        </button>
      ))}
    </div>
  );
}

function SummaryCard({ view }: { view: ViewConfig }) {
  return (
    <Card className="tlc-summary">
      <div className="tlc-card-copy">
        <h3>{view.summary.title}</h3>
        <p>{view.summary.description}</p>
      </div>
      <div className="tlc-metrics">
        {view.summary.metrics.map((metric) => (
          <div className="tlc-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong className={metric.tone ? `tone-text-${metric.tone}` : ""}>{metric.value}</strong>
          </div>
        ))}
        {view.summary.action && <Button tone="dark" icon={Play} label={view.summary.action} />}
      </div>
      <div className="tlc-trust-strip">
        <span>Signed trace</span>
        <span>Secrets redacted</span>
        <span>Localhost target</span>
      </div>
    </Card>
  );
}

function TimelineCard({ timeline }: { timeline: ViewConfig["timeline"] }) {
  const isEventTable = timeline.headers[0] === "Time";

  return (
    <Card className={`tlc-timeline-card ${isEventTable ? "is-event-table" : ""}`}>
      <div className="tlc-card-copy">
        <h3>{timeline.title}</h3>
        <p>{timeline.description}</p>
      </div>
      <div className="tlc-table-wrap">
        <div className={`tlc-table ${isEventTable ? "is-event-table" : ""}`}>
          <div className="tlc-table-head">
            {timeline.headers.map((header) => (
              <span key={header}>{header}</span>
            ))}
          </div>
          {timeline.rows.map((row, index) => (
            <div className={`tlc-table-row ${row.selected ? "is-selected" : ""}`} key={`${row.action}-${index}`}>
              <span>{row.step}</span>
              <strong>{row.action}</strong>
              <Pill label={row.state} tone={row.tone} />
          <span>{row.output}</span>
        </div>
      ))}
        </div>
        <div className="tlc-flow-map">
          <span>{timeline.mapTitle}</span>
          {timeline.mapItems.map((item, index) => (
            <Pill key={item} label={item} tone={index === 2 ? "dark" : "neutral"} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function RunbookCard({ runbook }: { runbook: ViewConfig["runbook"] }) {
  return (
    <Card className="tlc-runbook-card">
      <div className="tlc-runbook-head">
        <div className="tlc-card-copy">
          <h3>{runbook.title}</h3>
          <p>{runbook.description}</p>
        </div>
        <Button icon={BookOpen} label={runbook.action} />
      </div>
      <div className="tlc-code-panel">
        <div className="tlc-code-tabs">
          {runbook.tabs.map((tab, index) => (
            <span className={index === 0 ? "is-active" : ""} key={tab}>
              {tab}
            </span>
          ))}
          <button aria-label="Copy preview">
            <Copy size={13} strokeWidth={1.75} />
          </button>
        </div>
        <pre>{runbook.code.join("\n")}</pre>
      </div>
    </Card>
  );
}

function Inspector({ inspector }: { inspector: ViewConfig["inspector"] }) {
  const ActionIcon = inspector.action.toLowerCase().includes("export")
    ? Download
    : inspector.action.toLowerCase().includes("view")
      ? Route
      : Radio;

  return (
    <aside className="tlc-inspector">
      <div className="tlc-eyebrow">{inspector.eyebrow}</div>
      <div className="tlc-inspector-title">
        <h3>{inspector.title}</h3>
        <Pill {...inspector.tag} />
      </div>
      <p>{inspector.subtitle}</p>
      {inspector.sections.map((section) => (
        <div className="tlc-inspector-section" key={section.title}>
          <div className="tlc-section-head">
            <strong>{section.title}</strong>
            {section.tag && <Pill {...section.tag} />}
          </div>
          {section.rows.map((row) => (
            <div className="tlc-prop-row" key={`${section.title}-${row.label}`}>
              <span>{row.label}</span>
              <strong className={row.tone ? `tone-text-${row.tone}` : ""}>{row.value}</strong>
            </div>
          ))}
        </div>
      ))}
      <Button block tone="dark" icon={ActionIcon} label={inspector.action} />
      <div className="tlc-inspector-section">
        <div className="tlc-section-head">
          <strong>Artifacts</strong>
          <Pill label="Draft" />
        </div>
        {inspector.artifacts.map((artifact) => (
          <div className="tlc-artifact-row" key={artifact.title}>
            <div>
              <strong>{artifact.title}</strong>
              <span>{artifact.meta}</span>
            </div>
            <Pill label={artifact.badge} />
          </div>
        ))}
      </div>
    </aside>
  );
}

function Button({
  label,
  icon,
  tone = "light",
  block = false,
}: {
  label: string;
  icon?: LucideIcon;
  tone?: "light" | "dark";
  block?: boolean;
}) {
  const Icon = icon;
  return (
    <button className={`tlc-button tlc-button-${tone} ${block ? "is-block" : ""}`}>
      <span>{label}</span>
      {Icon && <Icon className="tlc-button-icon" size={14} strokeWidth={1.75} />}
    </button>
  );
}

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`tlc-card ${className}`}>{children}</section>;
}

function Pill({ label, tone = "neutral" }: Status) {
  return <span className={`tlc-pill tone-${tone}`}>{label}</span>;
}

function TlcStyles() {
  return (
    <style>{`
      .tlc-root {
        --bg: #f4f5f7;
        --surface: #ffffff;
        --surface-soft: #fafafa;
        --ink: #07111f;
        --muted: #657184;
        --faint: #8a94a6;
        --line: #dfe5ee;
        --line-soft: #edf1f6;
        --navy: #071426;
        --navy-2: #0b1f37;
        --accent: #2f74ff;
        --red: #ff3347;
        --green: #119b68;
        --amber: #9a6500;
        color: var(--ink);
        background: var(--bg);
        font-family: Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        min-height: 100vh;
        padding: 32px;
      }
      .tlc-root * { box-sizing: border-box; }
      .tlc-board-header { margin: 0 0 24px; }
      .tlc-board-header h1 { margin: 0 0 6px; font-size: 30px; line-height: 36px; letter-spacing: 0; }
      .tlc-board-header p,
      .tlc-screen-label span { margin: 0; color: var(--muted); font-size: 12px; line-height: 18px; }
      .tlc-board {
        display: grid;
        grid-template-columns: repeat(2, 1600px);
        gap: 72px 80px;
        transform-origin: top left;
      }
      .tlc-single { display: block; }
      .tlc-screen-label { display: grid; gap: 4px; margin: 0 0 12px; }
      .tlc-screen-label strong { font-size: 15px; line-height: 20px; }
      .tlc-screen {
        position: relative;
        width: 1600px;
        height: 1160px;
        overflow: hidden;
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 14px;
        box-shadow: 0 28px 84px rgba(15, 23, 42, 0.08);
      }
      .tlc-screen.is-data { height: 1260px; }
      .tlc-screen.is-data .tlc-rail { height: 1260px; }
      .tlc-screen.is-data .tlc-sidebar,
      .tlc-screen.is-data .tlc-workspace { height: 1204px; }
      .tlc-topbar {
        position: absolute;
        inset: 0 0 auto 0;
        height: 56px;
        border-bottom: 1px solid var(--line);
        background: rgba(255,255,255,.96);
      }
      .tlc-logo {
        position: absolute;
        left: 104px;
        top: 18px;
        width: 150px;
        height: 22px;
        object-fit: contain;
      }
      .tlc-search {
        position: absolute;
        left: 328px;
        top: 12px;
        width: 520px;
        height: 36px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        color: var(--muted);
        font-size: 13px;
      }
      .tlc-search-lucide { flex: 0 0 auto; color: #526070; }
      .tlc-search kbd { margin-left: auto; color: #99a3b3; font-size: 11px; font-family: inherit; }
      .tlc-nav {
        position: absolute;
        left: 888px;
        top: 0;
        height: 56px;
        display: flex;
        align-items: center;
        gap: 34px;
        color: #1f2937;
        font-size: 13px;
        font-weight: 650;
      }
      .tlc-topbar > .tlc-pill { position: absolute; left: 1216px; top: 14px; width: 110px; height: 28px; }
      .tlc-topbar > .tlc-button:nth-of-type(1) { position: absolute; left: 1344px; top: 12px; width: 112px; }
      .tlc-topbar > .tlc-button:nth-of-type(2) { position: absolute; left: 1472px; top: 12px; width: 102px; }
      .tlc-rail {
        position: absolute;
        left: 0;
        top: 0;
        width: 80px;
        height: 1160px;
        overflow: hidden;
        background:
          radial-gradient(circle at 72px 120px, rgba(95, 139, 196, .28), transparent 120px),
          linear-gradient(180deg, #071426 0%, #071120 100%);
        color: #d9e7ff;
      }
      .tlc-account {
        position: absolute;
        left: 23px;
        top: 16px;
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        border: 1px solid rgba(150, 176, 213, .36);
        background: #061126;
        box-shadow: 0 0 0 5px rgba(47, 116, 255, .05);
        font-size: 12px;
        font-weight: 800;
      }
      .tlc-rail-rule {
        position: absolute;
        left: 16px;
        top: 64px;
        width: 48px;
        height: 1px;
        background: rgba(156, 181, 215, .22);
      }
      .tlc-orbit {
        position: absolute;
        left: 10px;
        top: 82px;
        width: 60px;
        height: 60px;
        border: 1px solid rgba(124, 154, 198, .24);
        border-radius: 50%;
      }
      .tlc-rail-item {
        position: absolute;
        left: 21px;
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        color: #c6d6ee;
        font-size: 12px;
        font-weight: 800;
      }
      .tlc-rail-item svg { color: currentColor; }
      .tlc-rail-item.is-active {
        border: 1px solid rgba(130, 168, 224, .42);
        background: rgba(255,255,255,.08);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.12);
      }
      .tlc-rail-settings { top: 1040px; }
      .tlc-rail-brand {
        position: absolute;
        left: 0;
        bottom: 16px;
        width: 80px;
        display: grid;
        justify-items: center;
        gap: 4px;
        color: #b5c7e2;
      }
      .tlc-rail-brand strong {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #061126;
        color: #fff;
        font-size: 12px;
      }
      .tlc-rail-brand span { font-size: 11px; }
      .tlc-rail-brand small { font-size: 10px; color: #8093ad; }
      .tlc-sidebar {
        position: absolute;
        left: 80px;
        top: 56px;
        width: 256px;
        height: 1104px;
        padding: 16px;
        border-right: 1px solid var(--line);
        background: #fafafa;
      }
      .tlc-workspace-name { font-size: 12px; line-height: 18px; font-weight: 800; text-transform: uppercase; }
      .tlc-workspace-meta { margin-top: 4px; color: var(--muted); font-size: 11px; line-height: 16px; }
      .tlc-sidebar > .tlc-button { margin: 16px 0 24px; }
      .tlc-section-label {
        margin: 0 0 8px;
        color: #8b94a4;
        font-size: 10px;
        line-height: 14px;
        font-weight: 800;
        text-transform: uppercase;
      }
      .tlc-list,
      .tlc-recordings { display: grid; gap: 8px; margin-bottom: 24px; }
      .tlc-sidebar-row,
      .tlc-recording-row {
        position: relative;
        width: 224px;
        border: 1px solid var(--line-soft);
        border-radius: 8px;
        background: #fff;
      }
      .tlc-sidebar-row {
        min-height: 50px;
        padding: 8px 48px 8px 14px;
      }
      .tlc-sidebar-row.is-active,
      .tlc-recording-row.is-active {
        border-color: #b9d1ff;
        background: #f7faff;
      }
      .tlc-sidebar-row.is-active:before,
      .tlc-recording-row.is-active:before {
        content: "";
        position: absolute;
        left: 0;
        top: 8px;
        width: 3px;
        height: calc(100% - 16px);
        border-radius: 3px;
        background: var(--accent);
      }
      .tlc-sidebar-row > .tlc-pill {
        position: absolute;
        right: 14px;
        top: 14px;
        min-width: 32px;
        height: 22px;
        padding: 0 8px;
      }
      .tlc-sidebar-row strong,
      .tlc-recording-row strong,
      .tlc-artifact-row strong {
        display: block;
        color: var(--ink);
        font-size: 13px;
        line-height: 18px;
      }
      .tlc-sidebar-row span,
      .tlc-recording-row span,
      .tlc-artifact-row span {
        display: block;
        color: var(--muted);
        font-size: 11px;
        line-height: 15px;
      }
      .tlc-recording-row {
        min-height: 74px;
        padding: 14px 76px 12px 32px;
      }
      .tlc-recording-row > .tlc-pill {
        position: absolute;
        right: 10px;
        top: 17px;
        width: 68px;
        height: 22px;
      }
      .tlc-recording-icon {
        position: absolute;
        left: 13px;
        top: 17px;
        color: var(--accent);
      }
      .tlc-recording-row.is-active .tlc-recording-icon { color: var(--red); }
      .tlc-recording-icon-amber { color: var(--amber); }
      .tlc-recording-icon-green { color: var(--green); }
      .tlc-sidebar-divider { width: 224px; height: 1px; margin: 8px 0 24px; background: var(--line); }
      .tlc-helper-card {
        width: 224px;
        min-height: 130px;
        padding: 16px 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fff;
      }
      .tlc-helper-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .tlc-helper-head strong { font-size: 14px; line-height: 18px; }
      .tlc-helper-card p { margin: 10px 0 14px; color: #2f3745; font-size: 13px; line-height: 20px; }
      .tlc-progress { height: 6px; overflow: hidden; border-radius: 999px; background: #e7ebf0; }
      .tlc-progress span { display: block; width: 78%; height: 100%; background: var(--green); }
      .tlc-workspace {
        position: absolute;
        left: 336px;
        top: 56px;
        width: 1264px;
        height: 1104px;
        background: #fff;
      }
      .tlc-header-surface {
        position: absolute;
        left: 24px;
        top: 16px;
        width: 1216px;
        height: 132px;
        overflow: hidden;
        border-radius: 12px;
        background:
          linear-gradient(90deg, rgba(255,255,255,.94), rgba(255,255,255,.8)),
          radial-gradient(circle at 70% 42%, rgba(47, 116, 255, .11), transparent 260px);
      }
      .tlc-header-grid {
        position: absolute;
        left: 24px;
        top: 16px;
        width: 1216px;
        height: 132px;
        opacity: .38;
        background-image:
          linear-gradient(rgba(7,20,38,.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(7,20,38,.07) 1px, transparent 1px);
        background-size: 32px 32px;
        mask-image: linear-gradient(90deg, transparent, #000 42%, transparent);
      }
      .tlc-breadcrumb {
        position: absolute;
        left: 32px;
        top: 24px;
        width: 480px;
        color: var(--muted);
        font-size: 12px;
        line-height: 16px;
      }
      .tlc-title-icon {
        position: absolute;
        left: 32px;
        top: 48px;
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border: 1px solid var(--line);
        border-radius: 10px;
        background: #fff;
        color: var(--navy);
      }
      .tlc-title-icon svg { color: var(--navy); }
      .tlc-title-row {
        position: absolute;
        left: 88px;
        top: 48px;
        display: flex;
        align-items: center;
        gap: 36px;
      }
      .tlc-title-row h2 { margin: 0; width: 460px; font-size: 32px; line-height: 42px; letter-spacing: 0; }
      .tlc-status-row,
      .tlc-header-actions,
      .tlc-metrics,
      .tlc-code-tabs { display: flex; align-items: center; gap: 10px; }
      .tlc-header-actions {
        position: absolute;
        right: 2px;
        top: 40px;
      }
      .tlc-tabs {
        position: absolute;
        left: 24px;
        top: 104px;
        width: 1216px;
        height: 40px;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 6px 8px;
        border: 1px solid var(--line-soft);
        border-radius: 8px;
        background: rgba(255,255,255,.74);
      }
      .tlc-tabs button {
        width: 116px;
        height: 28px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #526070;
        font-size: 12px;
        font-weight: 700;
      }
      .tlc-tabs button.is-active { background: #000; color: #fff; }
      .tlc-columns {
        position: absolute;
        left: 24px;
        top: 168px;
        display: grid;
        grid-template-columns: 760px 412px;
        gap: 24px;
      }
      .tlc-primary { display: grid; gap: 20px; width: 760px; }
      .tlc-card,
      .tlc-inspector {
        border: 1px solid var(--line);
        border-radius: 10px;
        background: #fff;
      }
      .tlc-summary {
        min-height: 192px;
        padding: 20px 18px 18px;
        border-color: #bed6ff;
        box-shadow: 0 18px 44px rgba(47, 116, 255, .08);
      }
      .tlc-card-copy h3 { margin: 0 0 6px; font-size: 18px; line-height: 24px; }
      .tlc-card-copy p { margin: 0; max-width: 500px; color: var(--muted); font-size: 12px; line-height: 18px; }
      .tlc-summary .tlc-metrics { margin-top: 18px; align-items: stretch; }
      .tlc-metric {
        width: 138px;
        height: 62px;
        padding: 10px 14px;
        border: 1px solid #c7ddff;
        border-radius: 8px;
        background: #fbfdff;
      }
      .tlc-metric span { color: #607086; font-size: 11px; line-height: 16px; }
      .tlc-metric strong { display: block; margin-top: 3px; font-size: 18px; line-height: 26px; }
      .tlc-summary .tlc-metrics > .tlc-button { width: 92px; align-self: center; }
      .tlc-trust-strip {
        height: 26px;
        margin-top: 12px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: center;
        border: 1px solid #c7ddff;
        border-radius: 7px;
        background: #f8fbff;
        color: #3b4a5f;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
      }
      .tlc-timeline-card { min-height: 414px; padding: 18px; }
      .tlc-timeline-card.is-event-table { min-height: 470px; }
      .tlc-table-wrap { display: grid; grid-template-columns: 596px 98px; gap: 24px; margin-top: 14px; }
      .tlc-timeline-card.is-event-table .tlc-table-wrap { grid-template-columns: 620px 86px; }
      .tlc-table-head,
      .tlc-table-row {
        display: grid;
        grid-template-columns: 54px 324px 108px 76px;
        align-items: center;
        column-gap: 0;
      }
      .tlc-table.is-event-table .tlc-table-head,
      .tlc-table.is-event-table .tlc-table-row {
        grid-template-columns: 58px 318px 78px 76px;
      }
      .tlc-table-head {
        height: 40px;
        padding: 0 20px;
        border: 1px solid var(--line-soft);
        border-radius: 8px;
        background: #fafafa;
        color: var(--muted);
        font-size: 12px;
        font-weight: 650;
      }
      .tlc-table-row {
        position: relative;
        height: 44px;
        padding: 0 20px;
        border-bottom: 1px solid #edf1f6;
        color: #526070;
        font-size: 12px;
      }
      .tlc-table.is-event-table .tlc-table-row { height: 52px; }
      .tlc-table-row strong {
        color: #222a37;
        font-weight: 520;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tlc-table-row > span:first-child { white-space: nowrap; }
      .tlc-table-row > span:last-child { text-align: center; }
      .tlc-table-row.is-selected {
        background: #f5f8ff;
        border: 1px solid #7aa8ff;
        border-radius: 7px;
      }
      .tlc-table-row.is-selected:before {
        content: "";
        position: absolute;
        left: 0;
        top: 8px;
        width: 3px;
        height: calc(100% - 16px);
        border-radius: 2px;
        background: var(--accent);
      }
      .tlc-flow-map {
        min-height: 318px;
        padding: 12px;
        display: grid;
        align-content: start;
        gap: 18px;
        border: 1px solid var(--line-soft);
        border-radius: 8px;
        background: #fafafa;
        text-align: center;
      }
      .tlc-flow-map > span { color: var(--muted); font-size: 11px; text-align: left; }
      .tlc-runbook-card { min-height: 292px; padding: 18px 18px 22px; }
      .tlc-runbook-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
      .tlc-code-panel {
        height: 176px;
        overflow: hidden;
        border: 1px solid rgba(90, 132, 190, .32);
        border-radius: 8px;
        background: linear-gradient(180deg, #0b1f37 0%, #06101f 100%);
        color: #eaf2ff;
        padding: 12px 20px 24px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.09);
      }
      .tlc-code-tabs {
        height: 28px;
        gap: 8px;
        margin-bottom: 12px;
        border-bottom: 1px solid rgba(160, 185, 222, .14);
      }
      .tlc-code-tabs span,
      .tlc-code-tabs button {
        height: 22px;
        min-width: 104px;
        padding: 4px 10px;
        border: 1px solid rgba(121, 158, 212, .28);
        border-radius: 5px;
        background: rgba(255,255,255,.03);
        color: #b8cae6;
        font-size: 11px;
        line-height: 13px;
        font-family: inherit;
      }
      .tlc-code-tabs span.is-active { color: #fff; border-color: rgba(92, 150, 255, .58); background: rgba(47,116,255,.12); }
      .tlc-code-tabs button { margin-left: auto; min-width: 54px; cursor: default; }
      .tlc-code-panel pre {
        margin: 0;
        font-family: "Geist Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 12px;
        line-height: 17px;
        white-space: pre-wrap;
      }
      .tlc-inspector {
        width: 412px;
        height: 932px;
        padding: 18px;
        background: #fbfbfc;
      }
      .tlc-eyebrow { color: #7a8494; font-size: 10px; line-height: 14px; font-weight: 800; margin-bottom: 14px; }
      .tlc-inspector-title { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 8px; }
      .tlc-inspector-title h3 { margin: 0; font-size: 20px; line-height: 26px; }
      .tlc-inspector > p { margin: 0 0 20px; color: var(--muted); font-size: 12px; line-height: 18px; }
      .tlc-inspector-section {
        border-top: 1px solid var(--line);
        padding-top: 16px;
        margin-top: 16px;
      }
      .tlc-section-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
      .tlc-section-head strong { font-size: 13px; line-height: 18px; }
      .tlc-prop-row {
        display: grid;
        grid-template-columns: 116px 1fr;
        gap: 12px;
        min-height: 32px;
        align-items: center;
        font-size: 12px;
      }
      .tlc-prop-row span { color: var(--muted); font-size: 11px; }
      .tlc-prop-row strong { font-weight: 520; }
      .tlc-inspector > .tlc-button { margin-top: 14px; }
      .tlc-artifact-row {
        min-height: 52px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        border: 1px solid var(--line-soft);
        border-radius: 7px;
        background: #fff;
      }
      .tlc-artifact-row + .tlc-artifact-row { margin-top: 10px; }
      .tlc-button {
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid var(--line);
        border-radius: 7px;
        padding: 0 14px;
        background: #fff;
        color: var(--ink);
        font-size: 12px;
        font-weight: 750;
        font-family: inherit;
        line-height: 16px;
        white-space: nowrap;
        cursor: default;
      }
      .tlc-button.is-block { width: 100%; }
      .tlc-button-dark {
        border-color: #071426;
        background: linear-gradient(180deg, #0b1f37 0%, #071426 100%);
        color: #fff;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.16), 0 10px 24px rgba(7,20,38,.12);
      }
      .tlc-button-light { background: #fff; }
      .tlc-button-icon { flex: 0 0 auto; color: currentColor; }
      .tlc-pill {
        min-width: 52px;
        height: 22px;
        display: inline-grid;
        place-items: center;
        padding: 0 12px;
        border: 1px solid #e4e8ef;
        border-radius: 6px;
        background: #f6f7f9;
        color: #233044;
        font-size: 11px;
        font-weight: 750;
        line-height: 1;
        white-space: nowrap;
      }
      .tone-dark { background: #071426 !important; border-color: #071426 !important; color: #fff !important; }
      .tone-green { background: #eefbf4 !important; border-color: #d9f3e5 !important; color: #0f7b52 !important; }
      .tone-amber { background: #fff7e6 !important; border-color: #f2dfb9 !important; color: #8a5a00 !important; }
      .tone-blue { background: #eef5ff !important; border-color: #d8e8ff !important; color: #2764db !important; }
      .tone-text-green { color: #0f7b52 !important; }
      .tone-text-amber { color: #8a5a00 !important; }
      @media (max-width: 1800px) {
        .tlc-board {
          transform: scale(.72);
          width: 2250px;
        }
      }
    `}</style>
  );
}
