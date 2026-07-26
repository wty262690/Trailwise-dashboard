import { Activity, BookOpen, Bot, CircleDot, FileCode, Play, Route, Square } from "lucide-react";
import { type RefObject } from "react";
import { MovingBorderButton } from "./ui/MovingBorderButton";
import type { LoadingAction, Panel, ProjectSession, WorkflowStage } from "./types";

const icon18 = { size: 18, strokeWidth: 1.75 };

interface WorkflowOverviewPanelProps {
  workflowStage: WorkflowStage;
  isRecording: boolean;
  isCompleted: boolean;
  memoryConfirmed: boolean;
  statusLabel: string;
  durationSeconds: number;
  actionsCaptured: number;
  currentSession: ProjectSession | null;
  targetUrl: string;
  onTargetUrlChange: (value: string) => void;
  stageCopy: Record<WorkflowStage, { eyebrow: string; title: string; body: string; status: string }>;
  workflowSteps: Array<{ id: WorkflowStage; label: string; detail: string }>;
  workflowStageIndex: number;
  loadingAction: LoadingAction;
  generatedArtifacts: { test: boolean; runbook: boolean };
  panelRef?: RefObject<HTMLElement | null>;
  onJumpTo: (panel: Panel) => void;
  onStartRecording: () => void;
  onCheckStatus: () => void;
  onStopRecording: () => void;
  onConfirmMemory: () => void;
  onOpenTrace: () => void;
  onQueueAutomation: () => void;
  onGenerateRunbook: () => void;
  onGenerateArtifact: (kind: Exclude<LoadingAction, null>) => void;
  onOpenPanel: (panel: Panel) => void;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function WorkflowOverviewPanel(props: WorkflowOverviewPanelProps) {
  const {
    workflowStage,
    isRecording,
    isCompleted,
    memoryConfirmed,
    statusLabel,
    durationSeconds,
    actionsCaptured,
    currentSession,
    targetUrl,
    stageCopy,
    workflowSteps,
    workflowStageIndex,
    loadingAction,
    generatedArtifacts,
    panelRef,
    onJumpTo,
    onStartRecording,
    onCheckStatus,
    onStopRecording,
    onConfirmMemory,
    onOpenTrace,
    onQueueAutomation,
    onGenerateRunbook,
    onGenerateArtifact,
    onOpenPanel,
  } = props;

  return (
    <article className={`summary-card relative isolate min-h-[328px] overflow-hidden rounded-[50px] p-8 shadow-[0_28px_84px_rgba(18,31,51,0.1)] ${isRecording ? "is-live" : ""}`} ref={panelRef}>
      <div className="phase-strip grid gap-3 md:grid-cols-4" aria-label="Workflow progress">
        {workflowSteps.map((step, index) => {
          const stepState = index < workflowStageIndex ? "complete" : index === workflowStageIndex ? "active" : "future";
          return (
            <button
              className={`phase-step ${stepState} grid items-center gap-3 rounded-lg border border-slate-200/80 bg-white/50 p-3 text-left"`}
              disabled={stepState === "future"}
              key={step.id}
              onClick={() => {
                if (step.id === "prepare") onJumpTo("overview");
                if (step.id === "record") onJumpTo("overview");
                if (step.id === "review") onOpenPanel("trace");
                if (step.id === "generate") onOpenPanel("runbook");
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

      <div className="stage-header flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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

      <div className="guided-stage-grid mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_clamp(320px,26vw,352px)]">
        <div className="guided-stage-primary grid gap-4">
          {workflowStage === "prepare" && (
            <div className="target-capture-panel rounded-2xl border border-sky-200/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <label className="guided-url-field grid gap-2">
                <span>Target URL</span>
                <input aria-label="Target URL" value={targetUrl} onChange={(event) => props.onTargetUrlChange(event.target.value)} placeholder="http://localhost:5173" />
              </label>
              <div className="helper-inline mt-3">
                <CircleDot {...icon18} aria-hidden="true" />
                <div>
                  <strong>Local helper ready</strong>
                  <span>Chrome recording will start after local confirmation.</span>
                </div>
              </div>
            </div>
          )}

          {workflowStage === "record" && (
            <div className="target-capture-panel live-capture-panel rounded-2xl border border-rose-200/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <div className="live-indicator">
                <CircleDot className="recording-pulse" {...icon18} aria-hidden="true" />
                <div>
                  <strong>Recording browser workflow</strong>
                  <span>Demonstrate the full path once, then stop to structure memory.</span>
                </div>
              </div>
            </div>
          )}

          <div className="metrics grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <span>Status</span>
              <strong className={isRecording ? "red-text" : isCompleted ? "green-text" : ""}>{statusLabel}</strong>
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

          {isCompleted ? (
            <div className="learned-memory-panel rounded-2xl border border-sky-200/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <div className="learned-head flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span>WHAT TRAILWISE LEARNED</span>
                  <h3>Expense approval can be reproduced from a clean browser state.</h3>
                </div>
                <span className={memoryConfirmed ? "inline-flex min-h-6 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600" : "inline-flex min-h-6 items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"}>{memoryConfirmed ? "Confirmed" : "Needs review"}</span>
              </div>
              <ol className="mt-4 grid gap-3 md:grid-cols-3">
                <li>
                  <strong>Initial state</strong>
                  <span>Open the target URL with the local helper connected.</span>
                </li>
                <li>
                  <strong>Operating path</strong>
                  <span>Create an approval request, fill required fields, and submit.</span>
                </li>
                <li>
                  <strong>Expected result</strong>
                  <span>Success confirmation appears and the result state is captured.</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="memory-entry-card grid gap-0 overflow-hidden rounded-2xl border border-sky-200/70 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:grid-cols-3">
              <div>
                <span>Workflow memory</span>
                <strong>{memoryConfirmed ? "Target URL and local helper ready" : "Waiting for recording"}</strong>
              </div>
              <div>
                <span>Initial state</span>
                <strong>{currentSession ? "Target URL and local helper ready" : "Waiting for session"}</strong>
              </div>
              <div>
                <span>Stage result</span>
                <strong>Record one successful workflow path</strong>
              </div>
            </div>
          )}

          <div className="stage-action-bar flex flex-wrap gap-3 rounded-[10px] border border-white/60 bg-white/70 p-2.5">
            {workflowStage === "prepare" && (
              <>
                <MovingBorderButton className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10" onClick={onStartRecording}>
                  Start recording <Play {...icon18} aria-hidden="true" />
                </MovingBorderButton>
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700" onClick={onCheckStatus}>
                  Check helper <Activity {...icon18} aria-hidden="true" />
                </button>
              </>
            )}
            {workflowStage === "record" && (
              <>
                <MovingBorderButton className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10" onClick={onStopRecording}>
                  Stop and structure memory <Square {...icon18} aria-hidden="true" />
                </MovingBorderButton>
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700" onClick={onCheckStatus}>
                  Live status <Activity {...icon18} aria-hidden="true" />
                </button>
              </>
            )}
            {workflowStage === "review" && (
              <>
                <MovingBorderButton className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10" onClick={onConfirmMemory}>
                  Confirm memory <CircleDot {...icon18} aria-hidden="true" />
                </MovingBorderButton>
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700" onClick={() => onOpenTrace()}>
                  Inspect details <Route {...icon18} aria-hidden="true" />
                </button>
              </>
            )}
            {workflowStage === "generate" && (
              <>
                <MovingBorderButton className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10" onClick={onQueueAutomation}>
                  Run robot <Bot {...icon18} aria-hidden="true" />
                </MovingBorderButton>
                <button
                  className={loadingAction === "runbook" ? "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 opacity-70" : "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"}
                  disabled={loadingAction !== null}
                  onClick={() => {
                    if (generatedArtifacts.runbook) {
                      onOpenPanel("runbook");
                    } else {
                      void onGenerateRunbook();
                    }
                  }}
                >
                  {loadingAction === "runbook" ? "Generating..." : generatedArtifacts.runbook ? "Open output" : "Generate Runbook"}
                  <BookOpen {...icon18} aria-hidden="true" />
                </button>
                <button
                  className={loadingAction === "test" ? "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 opacity-70" : "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"}
                  disabled={loadingAction !== null}
                  onClick={() => onGenerateArtifact("test")}
                >
                  Generate Test <FileCode {...icon18} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>

        <aside className="workflow-preview-panel rounded-2xl border border-slate-200/70 bg-slate-900/95 p-6 text-slate-100 shadow-[0_18px_42px_rgba(6,18,43,0.12)]">
          <span>{workflowStage === "generate" ? "READY TO REUSE" : "WHAT TRAILWISE CAPTURES"}</span>
          <h3>
            {workflowStage === "generate"
              ? "This memory can now guide people or a robot run."
              : workflowStage === "review"
                ? "Confirm the summary instead of reading every event."
                : "Record once, then reuse the workflow later."}
          </h3>
          <ul>
            <li>{workflowStage === "generate" ? "Run the automation robot" : "Browser actions and timing"}</li>
            <li>{workflowStage === "generate" ? "Generate Runbook or Test Case" : "Key screen states and stage results"}</li>
            <li>{workflowStage === "generate" ? "Pause for human handoff when needed" : "Sensitive input redaction"}</li>
          </ul>
        </aside>
      </div>

      <div className="trust-strip mt-5 grid gap-0 overflow-hidden rounded-lg border border-sky-200/60 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:grid-cols-3">
        <span>{isCompleted ? "Keyframes extracted" : "Target URL ready"}</span>
        <span>{isCompleted ? "Stage results" : "Local helper ready"}</span>
        <span>{memoryConfirmed ? "Memory saved" : isCompleted ? "Review required" : "Ready to record"}</span>
      </div>
    </article>
  );
}
