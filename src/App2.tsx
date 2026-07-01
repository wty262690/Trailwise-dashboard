import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  CircleDot,
  Copy,
  FileCode,
  GitBranch,
  Grid2X2,
  LayoutDashboard,
  PanelsTopLeft,
  Play,
  Route,
  Search,
  Settings,
  Square,
} from "lucide-react";

const icon18 = { size: 18, strokeWidth: 1.75 };
const icon20 = { size: 20, strokeWidth: 1.75 };

const runbookText = `1  # Expense approval runbook
2  1. Open expenses list
3  2. Click Create request
4  3. Enter amount and approver
5  4. Submit approval request
6  5. Wait for success confirmation
7  6. Capture result state`;

const traceEvents = [
  {
    step: 1,
    action: "Open http://localhost:5173/expenses",
    state: "Done",
    stateClass: "done",
    time: "10:24:12",
    selector: "location.href",
    result: "expenses page loaded",
  },
  {
    step: 2,
    action: "Click Create request",
    state: "Done",
    stateClass: "done",
    time: "10:24:18",
    selector: "button[data-action=create]",
    result: "request form opened",
  },
  {
    step: 3,
    action: "Enter amount and approver",
    state: "Done",
    stateClass: "done",
    time: "10:24:25",
    selector: "input[name=approval]",
    result: "approval fields populated",
  },
  {
    step: 4,
    action: "Submit approval request",
    state: "Done",
    stateClass: "done",
    time: "10:24:38",
    selector: "button[type=submit]",
    result: "waiting for success state",
  },
  {
    step: 5,
    action: "Wait for success confirmation",
    state: "Pending",
    stateClass: "pending",
    time: "--:--",
    selector: "[data-state=success]",
    result: "success confirmation pending",
  },
  {
    step: 6,
    action: "Capture result state",
    state: "Pending",
    stateClass: "pending",
    time: "--:--",
    selector: "[data-capture=result]",
    result: "result state not captured",
  },
];

const recordingSeed = [
  {
    id: "expense",
    title: "Expense approval",
    path: "localhost:5173/expenses",
    badge: "Awaiting",
    tone: "amber",
    actions: 14,
    duration: 138,
  },
  {
    id: "manager",
    title: "Manager review",
    path: "localhost:5173/review",
    badge: "Parsed",
    tone: "green",
    actions: 8,
    duration: 93,
  },
  {
    id: "invoice",
    title: "Invoice review",
    path: "localhost:5173/invoice...",
    badge: "Runbook",
    tone: "green",
    actions: 11,
    duration: 126,
  },
  {
    id: "policy",
    title: "Policy update",
    path: "localhost:5173/settings",
    badge: "Draft",
    tone: "amber",
    actions: 6,
    duration: 74,
  },
];

type Panel = "overview" | "trace" | "runbook";
type RecordingPhase = "ready" | "recording" | "completed";
type WorkflowStage = "prepare" | "record" | "review" | "generate";
type LoadingAction = "test" | "runbook" | null;
type Toast = { id: number; message: string; tone?: "error" | "default" };

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>("overview");
  const [selectedRecordingId, setSelectedRecordingId] = useState("expense");
  const [selectedStep, setSelectedStep] = useState(4);
  const [recordingPhase, setRecordingPhase] = useState<RecordingPhase>("ready");
  const [durationSeconds, setDurationSeconds] = useState(recordingSeed[0].duration);
  const [actionsCaptured, setActionsCaptured] = useState(recordingSeed[0].actions);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [generatedArtifacts, setGeneratedArtifacts] = useState({ test: false, runbook: false });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState("http://localhost:5173");
  const summaryRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const runbookRef = useRef<HTMLElement>(null);

  const selectedRecording =
    recordingSeed.find((recording) => recording.id === selectedRecordingId) ?? recordingSeed[0];
  const selectedEvent = traceEvents.find((event) => event.step === selectedStep) ?? traceEvents[3];
  const isRecording = recordingPhase === "recording";
  const isCompleted = recordingPhase === "completed";
  const statusLabel =
    recordingPhase === "recording" ? "Recording" : recordingPhase === "completed" ? "Completed" : "Ready";
  const hasGeneratedArtifact = generatedArtifacts.test || generatedArtifacts.runbook;
  const workflowStage: WorkflowStage = isRecording
    ? "record"
    : hasGeneratedArtifact
      ? "generate"
      : isCompleted
        ? "review"
        : "prepare";
  const stageCopy: Record<WorkflowStage, { eyebrow: string; title: string; body: string; status: string }> = {
    prepare: {
      eyebrow: "Step 1 / Prepare",
      title: "Prepare Chrome workflow recording.",
      body: "Confirm the local helper, target URL, and handoff status before the browser capture begins.",
      status: "Ready for local confirmation",
    },
    record: {
      eyebrow: "Step 2 / Record",
      title: "Recording browser workflow.",
      body: "Capture the user path with a running duration, event count, and live trace updates.",
      status: "Recording in progress",
    },
    review: {
      eyebrow: "Step 3 / Review",
      title: "Review captured trace.",
      body: "Inspect the selected event and verify the structured trace before generating outputs.",
      status: "Trace ready for outputs",
    },
    generate: {
      eyebrow: "Step 4 / Generate",
      title: "Generate reusable artifacts.",
      body: "Create Test Case or Runbook outputs from the verified recording and keep them attached to the run.",
      status: "Output workspace ready",
    },
  };
  const workflowSteps: Array<{ id: WorkflowStage; label: string; detail: string }> = [
    { id: "prepare", label: "Prepare", detail: "helper and target" },
    { id: "record", label: "Record", detail: "capture actions" },
    { id: "review", label: "Review", detail: "inspect trace" },
    { id: "generate", label: "Generate", detail: "create outputs" },
  ];
  const workflowStageIndex = workflowSteps.findIndex((step) => step.id === workflowStage);

  useEffect(() => {
    if (!isRecording) return undefined;

    const intervalId = window.setInterval(() => {
      setDurationSeconds((current) => current + 1);
      setActionsCaptured((current) => Math.min(current + 1, 99));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRecording]);

  const showToast = (message: string, tone: Toast["tone"] = "default") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, tone === "error" ? 3200 : 1800);
  };

  const jumpTo = (panel: Panel) => {
    const target = {
      overview: summaryRef,
      trace: timelineRef,
      runbook: runbookRef,
    }[panel];

    setActivePanel(panel);
    window.setTimeout(() => target.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const selectRecording = (recordingId: string) => {
    const recording = recordingSeed.find((item) => item.id === recordingId) ?? recordingSeed[0];
    setSelectedRecordingId(recording.id);
    setSelectedStep(4);
    setRecordingPhase(recording.tone === "green" ? "completed" : "ready");
    setDurationSeconds(recording.duration);
    setActionsCaptured(recording.actions);
    setGeneratedArtifacts({ test: false, runbook: false });
    setSidebarOpen(false);
    jumpTo("overview");
    showToast(`${recording.title} selected`);
  };

  const beginRecording = () => {
    if (isRecording) return;
    setRecordingPhase("recording");
    setDurationSeconds(0);
    setActionsCaptured(0);
    setSelectedStep(1);
    setGeneratedArtifacts({ test: false, runbook: false });
    jumpTo("overview");
    showToast("Recording started");
    window.setTimeout(() => {
      showToast("Chrome handoff error: local confirmation is still waiting on the Mac.", "error");
    }, 350);
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setRecordingPhase("completed");
    setSelectedStep(4);
    jumpTo("overview");
    showToast("Recording completed");
  };

  const checkStatus = () => {
    showToast(`${statusLabel}: ${formatDuration(durationSeconds)} / ${actionsCaptured} actions captured`);
  };

  const openWorkspace = () => {
    setSidebarOpen(false);
    jumpTo("overview");
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    showToast("Workspace sidebar opened");
  };

  const openSettings = () => {
    showToast("Settings are not connected in this prototype");
  };

  const generateArtifact = (kind: Exclude<LoadingAction, null>) => {
    if (!isCompleted || loadingAction) return;

    setLoadingAction(kind);
    window.setTimeout(() => {
      setGeneratedArtifacts((current) => ({ ...current, [kind]: true }));
      setLoadingAction(null);
      showToast(kind === "test" ? "Test Case generated successfully" : "Runbook generated successfully");
      if (kind === "runbook") jumpTo("runbook");
    }, 900);
  };

  const copyRunbook = async () => {
    try {
      await navigator.clipboard.writeText(runbookText);
    } catch {
      // The visual acknowledgement still helps when clipboard access is blocked.
    }

    setCopied(true);
    showToast("Runbook copied");
    window.setTimeout(() => setCopied(false), 1200);
  };

  const visibleEventState = (event: (typeof traceEvents)[number]) => {
    if (selectedStep === event.step) return "Selected";
    if (isRecording && event.step > Math.max(1, Math.min(actionsCaptured, 6))) return "Pending";
    if (isCompleted && event.step <= 6) return "Done";
    return event.state;
  };

  const visibleEventClass = (event: (typeof traceEvents)[number]) => {
    if (selectedStep === event.step) return "";
    if (visibleEventState(event) === "Done") return "done";
    if (visibleEventState(event) === "Pending") return "pending";
    return event.stateClass;
  };

  return (
    <main className="screen-shell" aria-label="Trailwise 09 console preview">
      <section className={`console-screen ${sidebarOpen ? "sidebar-open" : ""}`}>
        <aside className="mission-rail" aria-label="Primary navigation">
          <div className="account-avatar">AK</div>
          <div className="rail-rule" />
          <div className="orbit" />

          <button className="rail-item active" aria-label="Workspace" onClick={openWorkspace}>
            <LayoutDashboard {...icon20} aria-hidden="true" />
          </button>
          <button className="rail-item item-2" aria-label="Open sidebar" onClick={openSidebar}>
            <Grid2X2 {...icon20} aria-hidden="true" />
          </button>
          <button className="rail-item item-3" aria-label="Trace" onClick={() => jumpTo("trace")}>
            <Route {...icon20} aria-hidden="true" />
          </button>
          <button className="rail-item item-4" aria-label="Runbook" onClick={() => jumpTo("runbook")}>
            <BookOpen {...icon20} aria-hidden="true" />
          </button>
          <button className="rail-item settings" aria-label="Settings" onClick={openSettings}>
            <Settings {...icon20} aria-hidden="true" />
          </button>

          <div className="rail-brand">
            <strong>TW</strong>
            <span>Trailwise</span>
            <small>v1.0.0</small>
          </div>
        </aside>

        <header className="topbar">
          <button className="mobile-sidebar-toggle" aria-label="Open workspace sidebar" onClick={openSidebar}>
            <PanelsTopLeft {...icon18} aria-hidden="true" />
          </button>
          <img className="brand-logo" src="/assets/trailwise-logo-exact.svg" alt="Trailwise" />
          <label className="search-box">
            <Search {...icon18} aria-hidden="true" />
            <span>Search recordings, runbooks, actions...</span>
            <kbd>Cmd K</kbd>
          </label>
          <nav className="top-nav" aria-label="Top navigation">
            <a href="#">Product</a>
            <a href="#">Runs</a>
            <a href="#">Data</a>
            <a href="#">Docs</a>
          </nav>
          <span className="pill">Helper ready</span>
        </header>

        <button
          className="sidebar-backdrop"
          aria-label="Close workspace sidebar"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
        <aside className="context-sidebar">
          <div className="workspace-title">ACME WORKSPACE</div>
          <div className="workspace-meta">4 projects / local helper on</div>

          <div className="section-label">Projects</div>
          <div className="project-row active">
            <FileCode className="project-icon" {...icon18} aria-hidden="true" />
            <strong>Expense Approval</strong>
            <span>Project detail</span>
            <em>{actionsCaptured}</em>
          </div>
          <div className="project-row">
            <PanelsTopLeft className="project-icon" {...icon18} aria-hidden="true" />
            <strong>Onboarding Flow</strong>
            <span>2 recordings</span>
            <em>2</em>
          </div>
          <div className="project-row">
            <BookOpen className="project-icon" {...icon18} aria-hidden="true" />
            <strong>Checkout QA</strong>
            <span>Runbook ready</span>
            <em className="green">1</em>
          </div>

          <div className="section-label recordings-title">Recent recordings</div>
          {recordingSeed.map((recording) => {
            const isSelected = recording.id === selectedRecordingId;
            const badge =
              isSelected && isRecording ? "Recording" : isSelected && isCompleted ? "Completed" : recording.badge;

            return (
              <button
                className={isSelected ? "recording-row active" : "recording-row"}
                key={recording.id}
                onClick={() => selectRecording(recording.id)}
              >
                <CircleDot
                  className={
                    isSelected
                      ? `status-icon red ${isRecording ? "recording-pulse" : ""}`
                      : `status-icon ${recording.tone}`
                  }
                  {...icon18}
                  aria-hidden="true"
                />
                <strong>{recording.title}</strong>
                <span>{recording.path}</span>
                <em className={isSelected && isRecording ? "red" : recording.tone}>{badge}</em>
              </button>
            );
          })}

          <div className="sidebar-divider" />
          <div className="helper-card">
            <div>
              <strong>Local helper</strong>
              <span className="pill green">Ready</span>
            </div>
            <p>Mac confirmation is required before the browser recording starts.</p>
            <span className="progress">
              <i />
            </span>
          </div>
        </aside>

        <section className="workspace">
          <div className="header-surface" />
          <div className="header-grid" />
          <div className="breadcrumb">Trailwise / Projects / Expense Approval / Trace detail</div>
          <div className="title-icon">
            <GitBranch {...icon20} aria-hidden="true" />
          </div>
          <div className="title-row">
            <h1>{selectedRecording.title} workflow</h1>
            <span className={isRecording ? "pill red" : isCompleted ? "pill green" : "pill amber"}>
              {statusLabel}
            </span>
            <span className="pill">{actionsCaptured} events</span>
            <span className={isCompleted ? "pill green" : "pill amber"}>
              {isCompleted ? "Artifacts ready" : "Runbook draft"}
            </span>
          </div>
          <label className="target-url-row">
            <span>Target URL</span>
            <input
              aria-label="Target URL"
              value={targetUrl}
              onChange={(event) => setTargetUrl(event.target.value)}
              placeholder="http://localhost:5173"
            />
          </label>
          <div className="tabs">
            <button className={activePanel === "overview" ? "active" : ""} onClick={() => jumpTo("overview")}>
              <LayoutDashboard {...icon18} aria-hidden="true" />
              <span>Overview</span>
            </button>
            <button className={activePanel === "trace" ? "active" : ""} onClick={() => jumpTo("trace")}>
              <Route {...icon18} aria-hidden="true" />
              <span>Trace</span>
            </button>
            <button className={activePanel === "runbook" ? "active" : ""} onClick={() => jumpTo("runbook")}>
              <BookOpen {...icon18} aria-hidden="true" />
              <span>Runbook</span>
            </button>
          </div>

          <div className={`content-grid panel-${activePanel}`}>
            <div className="primary-column">
              <article className={`summary-card stage-${workflowStage} ${isRecording ? "is-live" : ""}`} ref={summaryRef}>
                <div className="phase-strip" aria-label="Workflow progress">
                  {workflowSteps.map((step, index) => {
                    const stepState =
                      index < workflowStageIndex ? "complete" : index === workflowStageIndex ? "active" : "future";
                    return (
                      <button
                        className={`phase-step ${stepState}`}
                        disabled={stepState === "future"}
                        key={step.id}
                        onClick={() => {
                          if (step.id === "prepare") jumpTo("overview");
                          if (step.id === "record") jumpTo("overview");
                          if (step.id === "review") jumpTo("trace");
                          if (step.id === "generate") jumpTo("runbook");
                        }}
                        type="button"
                      >
                        <span>{index + 1}</span>
                        <strong>{step.label}</strong>
                        <em>{step.detail}</em>
                      </button>
                    );
                  })}
                </div>
                <div className="stage-header">
                  <div>
                    <span className="stage-eyebrow">{stageCopy[workflowStage].eyebrow}</span>
                    <h2>{stageCopy[workflowStage].title}</h2>
                    <p>{stageCopy[workflowStage].body}</p>
                  </div>
                  <span className={`stage-status ${isRecording ? "red recording-pulse" : isCompleted ? "green" : ""}`}>
                    <CircleDot {...icon18} aria-hidden="true" />
                    {stageCopy[workflowStage].status}
                  </span>
                </div>
                <div className="metrics">
                  <div>
                    <span>Status</span>
                    <strong className={isRecording ? "red-text" : isCompleted ? "green-text" : ""}>
                      {statusLabel}
                    </strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{formatDuration(durationSeconds)}</strong>
                  </div>
                  <div>
                    <span>Actions captured</span>
                    <strong>{actionsCaptured}</strong>
                  </div>
                  <div>
                    <span>Session</span>
                    <strong>Active</strong>
                  </div>
                </div>
                <div className="stage-action-bar">
                  {workflowStage === "prepare" && (
                    <>
                      <button className="btn dark primary-action" onClick={beginRecording}>
                        Start recording <Play {...icon18} aria-hidden="true" />
                      </button>
                      <button className="btn light" onClick={checkStatus}>
                        Check status <Activity {...icon18} aria-hidden="true" />
                      </button>
                    </>
                  )}
                  {workflowStage === "record" && (
                    <>
                      <button className="btn dark primary-action" onClick={stopRecording}>
                        Stop recording <Square {...icon18} aria-hidden="true" />
                      </button>
                      <button className="btn light" onClick={checkStatus}>
                        Live status <Activity {...icon18} aria-hidden="true" />
                      </button>
                    </>
                  )}
                  {workflowStage === "review" && (
                    <>
                      <button className="btn dark primary-action" onClick={() => jumpTo("trace")}>
                        Inspect trace <Route {...icon18} aria-hidden="true" />
                      </button>
                      <button
                        className={loadingAction === "test" ? "btn light loading" : "btn light"}
                        disabled={loadingAction !== null}
                        onClick={() => generateArtifact("test")}
                      >
                        Generate Test <FileCode {...icon18} aria-hidden="true" />
                      </button>
                      <button
                        className={loadingAction === "runbook" ? "btn light loading" : "btn light"}
                        disabled={loadingAction !== null}
                        onClick={() => generateArtifact("runbook")}
                      >
                        Generate Runbook <BookOpen {...icon18} aria-hidden="true" />
                      </button>
                      <button className="btn light" onClick={checkStatus}>
                        Status <Activity {...icon18} aria-hidden="true" />
                      </button>
                    </>
                  )}
                  {workflowStage === "generate" && (
                    <>
                      <button className="btn dark primary-action" onClick={() => jumpTo("runbook")}>
                        Open output <BookOpen {...icon18} aria-hidden="true" />
                      </button>
                      <button className="btn light" onClick={copyRunbook}>
                        Copy runbook <Copy {...icon18} aria-hidden="true" />
                      </button>
                      <button className="btn light" onClick={checkStatus}>
                        Status <Activity {...icon18} aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
                <div className="trust-strip">
                  <span>Signed trace</span>
                  <span>Secrets redacted</span>
                  <span>Localhost target</span>
                </div>
              </article>

              {activePanel === "trace" && (
                <article
                  className={`timeline-card ${
                    workflowStage === "record" || workflowStage === "review" ? "is-emphasized" : "is-secondary"
                  }`}
                  ref={timelineRef}
                >
                  <h2>Trace timeline</h2>
                  <p>List-detail flow: selecting an event updates the inspector.</p>
                  <div className="timeline-layout">
                    <div className="table">
                      <div className="table-head">
                        <span>Step</span>
                        <span>Action</span>
                        <span>State</span>
                        <span>Time</span>
                      </div>
                      {traceEvents.map((event) => (
                        <button
                          className={selectedStep === event.step ? "table-row selected" : "table-row"}
                          key={event.step}
                          onClick={() => setSelectedStep(event.step)}
                        >
                          <span>{event.step}</span>
                          <strong>{event.action}</strong>
                          <em className={visibleEventClass(event)}>{visibleEventState(event)}</em>
                          <span>{event.time}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flow-map">
                      <span>Flow map</span>
                      <em className={selectedStep === 1 ? "active" : ""}>Nav</em>
                      <em className={selectedStep === 3 ? "active" : ""}>Input</em>
                      <em className={selectedStep === 4 ? "active" : ""}>Submit</em>
                      <em className={selectedStep >= 5 ? "active" : ""}>Verify</em>
                    </div>
                  </div>
                </article>
              )}

              {activePanel === "runbook" && (
                <article
                  className={`runbook-card ${workflowStage === "generate" ? "is-emphasized" : "is-secondary"}`}
                  ref={runbookRef}
                >
                  <div className="card-head">
                    <div>
                      <h2>Generated Runbook</h2>
                      <p>Structured output remains attached to this recording.</p>
                    </div>
                    <button className="btn light" disabled={!isCompleted} onClick={() => jumpTo("runbook")}>
                      Open draft <BookOpen {...icon18} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="code-panel">
                    <div className="code-tabs">
                      <span>expense_runbook.md</span>
                      <span>trace.json</span>
                      <button aria-label="Copy" className={copied ? "copied" : ""} onClick={copyRunbook}>
                        <Copy {...icon18} aria-hidden="true" />
                      </button>
                    </div>
                    <pre>{runbookText}</pre>
                  </div>
                </article>
              )}
            </div>

            {activePanel === "trace" && (
            <aside className={`inspector ${workflowStage === "prepare" ? "is-secondary" : ""}`}>
              <div className="eyebrow">TRACE INSPECTOR</div>
              <div className="inspector-content" key={`${selectedRecordingId}-${selectedStep}`}>
                <div className="inspector-title">
                  <h2>{selectedEvent.action}</h2>
                  <span className="pill">Selected</span>
                </div>
                <p>Event {selectedEvent.step} from the selected {selectedRecording.title} recording.</p>

                <div className="inspector-section">
                  <h3>Event properties</h3>
                  <dl>
                    <dt>Selector</dt>
                    <dd>{selectedEvent.selector}</dd>
                    <dt>Action</dt>
                    <dd>click</dd>
                    <dt>Result</dt>
                    <dd>{selectedEvent.result}</dd>
                    <dt>Timestamp</dt>
                    <dd>{selectedEvent.time}</dd>
                  </dl>
                </div>

                <div className="inspector-section">
                  <div className="section-head">
                    <h3>Local handoff</h3>
                    <span className={isRecording ? "pill red" : "pill amber"}>
                      {isRecording ? "Recording" : "Awaiting"}
                    </span>
                  </div>
                  <dl>
                    <dt>Device</dt>
                    <dd>Sun Junxiao MacBook Pro</dd>
                    <dt>Target</dt>
                    <dd>{targetUrl}</dd>
                    <dt>Session</dt>
                    <dd>sess_mr0re8sa_8u0xr4</dd>
                  </dl>
                </div>
              </div>

              <button className="btn dark block" disabled={isRecording} onClick={beginRecording}>
                Confirm locally on the Mac <Play {...icon18} aria-hidden="true" />
              </button>

              <div className="inspector-section artifacts-section">
                <div className="section-head">
                  <h3>Artifacts</h3>
                  <span className={isCompleted ? "pill green" : "pill"}>{isCompleted ? "Ready" : "Draft"}</span>
                </div>
                <div className="artifact-row">
                  <strong>
                    Structured trace<span>{actionsCaptured} parsed events</span>
                  </strong>
                  <em>{isCompleted ? "OK" : "--"}</em>
                </div>
                <div className="artifact-row">
                  <strong>
                    Runbook<span>{isCompleted ? "draft available" : "waiting for completed trace"}</span>
                  </strong>
                  <em>{isCompleted ? "1" : "--"}</em>
                </div>
                <div className="artifact-row">
                  <strong>
                    Trace bundle<span>{isCompleted ? "signed and redacted" : "capture pending"}</span>
                  </strong>
                  <em>{isCompleted ? "OK" : "--"}</em>
                </div>
              </div>
            </aside>
            )}
          </div>
        </section>
      </section>

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div className={toast.tone === "error" ? "toast error" : "toast"} key={toast.id}>
            {toast.message}
          </div>
        ))}
      </div>
    </main>
  );
}
