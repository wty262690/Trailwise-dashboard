
import { startRecording, stopRecording } from "./api/trailwise";
import { deleteSession } from "./api/trailwise";
import ProjectDelete from "./component/ProjectDelete";
import MissionRail from "./component/MissionRail";
import TopBar from "./component/TopBar";
import WorkspaceSidebar from "./component/WorkspaceSidebar";
import WorkflowSummaryCard from "./component/WorkflowSummaryCard";
import TraceTimelineCard from "./component/TraceTimelineCard";
import TraceInspector from "./component/TraceInspector";
import RunbookCard from "./component/RunbookCard";
import Tabs from "./component/Tabs";
import { useEffect, useRef, useState } from "react";
import { GitBranch } from "lucide-react";

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
  const [url] = useState("http://localhost:5173");
  const [, setMessage] = useState("");
  const [projectName, setProjectName] = useState("CREATE YOUR PROJECT");
  const [currentSession, setCurrentSession] = useState<{ session_id: string; status?: string } | null>(null);
  const [sessions, setSessions] = useState<Array<{ session_id: string; status: string }>>([]);

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
  
    const checkStatus = () => {
      showToast(`${statusLabel}: ${formatDuration(durationSeconds)} / ${actionsCaptured} actions captured`);
    };
  
    const openWorkspace = () => {
      setSidebarOpen(false);
      jumpTo("overview");
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

  

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current);
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

  async function loadSessions() {
    const res = await fetch("http://localhost:3000/dev/sessions");
    const data = await res.json();

    setSessions(data.sessions.filter((s: { status: string }) => s.status !== "deleted"));
  }


   const beginRecording = async () => {
    if (isRecording) return;
    try {
          const result = await startRecording(url);
    
          console.log(result);
    
          setMessage(result.text ?? JSON.stringify(result));
    
          await loadSessions();
    
          const match = result.text?.match(/Session:\s*(\S+)/);
          const sessionId = match?.[1];
    
          if (sessionId) {
            const res = await fetch("http://localhost:3000/dev/sessions");
            const data = await res.json();
            const newSession = data.sessions.find(
              (s: { session_id: string }) => s.session_id === sessionId
            );
    
            if (newSession) {
              setCurrentSession(newSession);
              setProjectName(newSession.session_id);
            }

            setRecordingPhase("recording");
            setDurationSeconds(0);
            setActionsCaptured(0);
            setSelectedStep(1);
            jumpTo("overview");
            showToast("Recording started");
          }
    
          if (result.text?.[0] === "R") {
            window.open(url, "_blank");
          }
        } catch (err) {
          console.error(err);
          setMessage("Start failed");
        }
  };

  const handleStop = async () => {
    if (!isRecording || !currentSession) return;
    try {
        const result = await stopRecording(currentSession.session_id);

        console.log(result);
        setMessage(result.text ?? JSON.stringify(result));
        setRecordingPhase("completed");
        setSelectedStep(4);
        jumpTo("trace");
        showToast("Recording completed");
        await loadSessions();
      } catch (err) {
        console.error(err);
        setMessage("Stop failed");
      }
  };

  async function handleDelete(session: { session_id: string }) {
    if (!session) return;
    void handleStop();
    await deleteSession(session.session_id);
    await loadSessions();

    setCurrentSession(null);
    setProjectName("CREATE YOUR PROJECT");
  }

  return (
    <main className="screen-shell" aria-label="Trailwise 09 console preview">
      <section className={`console-screen ${sidebarOpen ? "sidebar-open" : ""}`}>
        <MissionRail
          activePanel={activePanel}
          sidebarOpen={sidebarOpen}
          onOpenWorkspace={openWorkspace}
          onToggleSidebar={toggleSidebar}
          onJumpTo={jumpTo}
          onOpenSettings={openSettings}
        />

        <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />


        <button
          className="sidebar-backdrop"
          aria-label="Close workspace sidebar"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
        <WorkspaceSidebar
          sessions={sessions}
          currentSession={currentSession}
          loadSessions={loadSessions}
          recordingSeed={recordingSeed}
          selectedRecordingId={selectedRecordingId}
          isRecording={isRecording}
          isCompleted={isCompleted}
          onSelectRecording={selectRecording}
          onOpenSession={(session) => {
            setCurrentSession(session);
            setProjectName(session.session_id);
          }}
        />

        <section className="workspace">
          <div className="header-surface" />
          <div className="header-grid" />
          <div className="breadcrumb">Trailwise / Projects / Expense Approval / Trace detail</div>
          <div className="title-icon">
            <GitBranch {...icon20} aria-hidden="true" />
          </div>

          <div style={{ display: "grid"}}>
            <div className="title-row">
              <h1>{projectName} {currentSession ? "workflow" : ""}</h1>
              <span className={isRecording ? "pill red" : isCompleted ? "pill green" : "pill amber"}>
                {statusLabel}
              </span>
              {/*<span className="pill">{actionsCaptured} events</span>*/}
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
          </div>

          <div className="tabs">
            <Tabs activePanel={activePanel} onJumpTo={jumpTo} />
            <ProjectDelete
              session={currentSession}
              onDelete={handleDelete}
            />        
          </div>
        
        
          <div className={`content-grid panel-${activePanel}`}>
            <div className="primary-column">
              <WorkflowSummaryCard
                ref={summaryRef}
                workflowStage={workflowStage}
                workflowSteps={workflowSteps}
                stageCopy={stageCopy}
                statusLabel={statusLabel}
                durationSeconds={durationSeconds}
                actionsCaptured={actionsCaptured}
                isRecording={isRecording}
                isCompleted={isCompleted}
                loadingAction={loadingAction}
                formatDuration={formatDuration}
                onBeginRecording={beginRecording}
                onCheckStatus={checkStatus}
                onStopRecording={handleStop}
                onGenerateArtifact={generateArtifact}
                onJumpTo={jumpTo}
                onCopyRunbook={copyRunbook}
              />

              {activePanel === "trace" && (
                <TraceTimelineCard
                  ref={timelineRef}
                  workflowStage={workflowStage}
                  traceEvents={traceEvents}
                  selectedStep={selectedStep}
                  isRecording={isRecording}
                  isCompleted={isCompleted}
                  onSelectStep={setSelectedStep}
                />
              )}

              {activePanel === "runbook" && (
                <RunbookCard
                  ref={runbookRef}
                  workflowStage={workflowStage}
                  runbookText={runbookText}
                  copied={copied}
                  isCompleted={isCompleted}
                  onCopyRunbook={copyRunbook}
                  onJumpTo={jumpTo}
                />
              )}
            </div>

            {activePanel === "trace" && (
              <TraceInspector
                workflowStage={workflowStage}
                selectedEvent={selectedEvent}
                selectedRecording={selectedRecording}
                targetUrl={targetUrl}
                isRecording={isRecording}
                isCompleted={isCompleted}
                actionsCaptured={actionsCaptured}
                onBeginRecording={beginRecording}
              />
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
