import { Activity, BookOpen, Bot, CircleDot, FileCode, Play, Route, Square } from "lucide-react";
import { type RefObject } from "react";
import { MovingBorderButton } from "./ui/MovingBorderButton";
import type { LoadingAction, Panel, ProjectSession, WorkflowStage } from "./types";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  const [showPreviewInfo, setShowPreviewInfo] = useState(false);

  return (
    <article className={`hide-scrollbar summary-card relative isolate h-[45vh] overflow-auto py-5 shadow-[0_28px_84px_rgba(18,31,51,0.1)] ${isRecording ? "is-live" : ""}`} ref={panelRef}>
      <div
        className="phase-strip grid grid-cols-2 gap-0.5 md:grid-cols-4"
        aria-label="Workflow progress"
      >
        {workflowSteps.map((step, index) => {
          const stepState =
            index < workflowStageIndex
              ? "complete"
              : index === workflowStageIndex
                ? "active"
                : "future";

          return (
            <button
              className={cn(
                "phase-step relative isolate grid items-center overflow-hidden rounded-none bg-white/10 px-5 py-2 text-left",

                index === 0 && "phase-corner-tl rounded-tl-[25px]",
                index === 1 && "phase-corner-tr rounded-tr-[25px]",
                index === 2 && "phase-corner-bl rounded-bl-[25px]",
                index === 3 && "phase-corner-br rounded-br-[25px]",

                index === 0 &&
                  "phase-left md:rounded-l-[50px] md:rounded-r-none",

                (index === 1 || index === 2) &&
                  "phase-middle md:rounded-none",

                index === workflowSteps.length - 1 &&
                  "phase-right md:rounded-r-[50px] md:rounded-l-none",
                stepState
              )}
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
              <div className="flex items-center gap-3">
                <span className="text-white text-[min(5vw,40px)] font-bold ">{index + 1}</span> 
                <div className="grid">
                  <strong className="leading-[20px] relative z-10 font-bold uppercase text-white">
                    {step.label}
                  </strong>

                  <em className="relative z-10 text-[length:var(--fontsize-subtitle)] leading-[var(--leading-subtitle)] text-white/50">
                    {step.detail}
                  </em>
                </div>
              </div>
            </button>
          );
        })}
      </div>


      <div className="guided-stage-grid mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_clamp(320px,26vw,352px)]">
        <div className="guided-stage-primary grid gap-4">
          <AnimatePresence>
          {showPreviewInfo && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="
                z-[0]
                w-full
                absolute
                workflow-preview-panel
                rounded-2xl
                border
                border-slate-200/70
                text-slate-100
                shadow-[0_18px_42px_rgba(6,18,43,0.12)]
              "
            >
            <aside className="lg:relative workflow-preview-panel rounded-2xl border border-slate-200/70 bg-white/85 p-6 text-black font-bold shadow-[0_18px_42px_rgba(6,18,43,0.12)]">
              <span className="text-[length:var(--fontsize-title)]">{workflowStage === "generate" ? "READY TO REUSE" : "WHAT TRAILWISE CAPTURES"}</span>
              <h3 className="text-[length:var(--fontsize-title)]" >
                {workflowStage === "generate"
                  ? "This memory can now guide people or a robot run."
                  : workflowStage === "review"
                    ? "Confirm the summary instead of reading every event."
                    : "Record once, then reuse the workflow later."}
              </h3>
              <ul className="text-[length:var(--fontsize-title)] text-left">
                <li>''{workflowStage === "generate" ? "Run the automation robot" : "Browser actions and timing"}</li>
                <li>''{workflowStage === "generate" ? "Generate Runbook or Test Case" : "Key screen states and stage results"}</li>
                <li>''{workflowStage === "generate" ? "Pause for human handoff when needed" : "Sensitive input redaction"}</li>
              </ul>
            </aside>
            </motion.aside>
          )}</AnimatePresence>

          {workflowStage === "prepare" && (
            <div className="target-capture-panel rounded-t-[30px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6)_0%,transparent_76%)] p-4">
                
                <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowPreviewInfo((prev) => !prev)}
                      className="
                        z-[1] h-6 w-6 p-2
                        inline-flex
                        items-center
                        justify-center
                        rounded-full
                        bg-white/10
                        border
                        border-0.5
                        border-white/20
                        text-sm
                        font-medium
                        text-black
                        transition
                        hover:bg-white/50
                      "
                    >
                      {showPreviewInfo ? "x" : "i"}
                    </button>

                  <span className="leading-[var(--leading-title)] w-[60%] text-left px-2 text-[length:var(--fontsize-title)] stage-eyebrow font-bold uppercase">{stageCopy[workflowStage].title}</span>
                  <span className={`flex items-center text-[var(--text-h)] leading-[min(2vw,15px)] text-[length:var(--fontsize-status)] bg-[var(--text-h)]/20 border rounded-full stage-status px-3 py-1 ${isRecording ? "red recording-pulse" : isCompleted ? "green" : ""}`}>
                    <CircleDot {...icon18} className="px-1" aria-hidden="true" />
                    <div className="text-left">{stageCopy[workflowStage].status}</div>
                  </span>
                </div>

                <p className="text-left leading-[var(--leading-p)] p-2 text-[length:var(--fontsize-p)]">{stageCopy[workflowStage].body}</p>

              <label className="items-center rounded-l-[10px] bg-[radial-gradient(circle_at_left,var(--text-h)_0%,transparent_100%)] flex guided-url-field">
                <span className="text-[length:var(--fontsize-title)] text-[var(--text-dark)] p-2 m-auto leading-4 font-bold text-left uppercase">Target</span>
                <input className="w-full text-[var(--text-dark)] px-5" aria-label="Target URL" value={targetUrl} onChange={(event) => props.onTargetUrlChange(event.target.value)} placeholder="http://localhost:5173" />
                <MovingBorderButton
                  className="
                    flex
                    w-fit
                    items-center
                    justify-center
                    gap-2
                    whitespace-nowrap
                    rounded-[50px]
                    bg-white/10
                    px-4
                    py-2
                    text-[length:var(--fontsize-title)]
                    font-bold
                    text-white
                    shadow-lg
                  "
                  onClick={onStartRecording}
                >
                  Start
                  <Play {...icon18} aria-hidden="true" />
                </MovingBorderButton>
              </label>
             <div className="stage-header flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="text-left">
                  <div className="helper-inline mt-2">
                    <div className="text-[var(--text-light)] text-[length:var(--fontsize-p)]">
                      <span>Chrome recording will start after local confirmation.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {workflowStage === "record" && (
            <div className="target-capture-panel live-capture-panel rounded-2xl border border-rose-200/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              <div className="live-indicator">
                <div>
                  <strong>Recording browser workflow</strong>
                  <span>Demonstrate the full path once, then stop to structure memory.</span>
                </div>
              </div>
            </div>
          )}

          <div className="metrics grid gap-0.5 text-left md:grid-cols-2 xl:grid-cols-4">

          <div
            className="
              grid grid-cols-[140px_1fr]
              items-center
              bg-white/20
              rounded-t-[25px]
              md:rounded-t-none
              md:rounded-tl-[25px]
              xl:rounded-l-[25px]
            "
          >
            <span className="px-4 text-right uppercase font-bold text-[length:var(--fontsize-title)]">
              Status
            </span>

            <strong
              className={`px-4 break-all text-[length:var(--fontsize-p)] leading-[var(--leading-p)] ${
                isRecording ? "red-text" : isCompleted ? "green-text" : ""
              }`}
            >
              {statusLabel}
            </strong>
          </div>

          {/* Duration */}
          <div
            className="
              grid grid-cols-[140px_1fr]
              items-center
              bg-white/20
              md:rounded-tr-[25px]
              xl:rounded-none
            "
          >
            <span className="px-4 text-right uppercase font-bold text-[length:var(--fontsize-title)]">
              Duration
            </span>

            <strong className="px-4 text-[length:var(--fontsize-p)]">
              {formatDuration(durationSeconds)}
            </strong>
          </div>

          {/* Actions */}
          <div
            className="
              grid grid-cols-[140px_1fr]
              items-center
              bg-white/20
              md:rounded-bl-[25px]
              xl:rounded-none
            "
          >
            <span className="px-4 text-right uppercase font-bold text-[length:var(--fontsize-title)]">
              Actions
            </span>

            <strong className="px-4 text-[length:var(--fontsize-p)]">
              {actionsCaptured}
            </strong>
          </div>

          {/* Session */}
          <div
            className="
              grid grid-cols-[140px_1fr]
              items-center
              bg-white/20
              rounded-b-[25px]
              md:rounded-b-none
              md:rounded-br-[25px]
              xl:rounded-r-[25px]
            "
          >
            <span className="px-4 text-right uppercase font-bold text-[length:var(--fontsize-title)]">
              Session
            </span>

            <strong className="px-4 text-[length:var(--fontsize-p)]">
              Active
            </strong>
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
              </ol>
            </div>
          ) : (
            <div className="memory-entry-card grid gap-0 overflow-hidden rounded-2xl border border-sky-200/70 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] grid-cols-3">
              <div>
                <span className="uppercase font-bold">Workflow memory</span>
                <strong>{memoryConfirmed ? "Target URL and local helper ready" : "Waiting for recording"}</strong>
              </div>
              <div>
                <span className="uppercase font-bold">Initial state</span>
                <strong>{currentSession ? "Target URL and local helper ready" : "Waiting for session"}</strong>
              </div>
                <div className="trust-strip mt-5 grid gap-0 overflow-hidden rounded-lg border border-sky-200/60 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:grid-cols-3">
                  <span>{isCompleted ? "Keyframes extracted" : "Target URL ready"}</span>
                  <span>{isCompleted ? "Stage results" : "Local helper ready"}</span>
                  <span>{memoryConfirmed ? "Memory saved" : isCompleted ? "Review required" : "Ready to record"}</span>
                </div>
            </div>
          )}

          <div className="stage-action-bar flex flex-wrap gap-3 rounded-[10px] border border-white/60 bg-white/10 p-2.5">
            {workflowStage === "prepare" && (
              <>
                {/*<MovingBorderButton className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10" onClick={onStartRecording}>
                  Start recording <Play {...icon18} aria-hidden="true" />
                </MovingBorderButton>
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700" onClick={onCheckStatus}>
                  Check helper <Activity {...icon18} aria-hidden="true" />
                </button>*/}
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
      </div>
    </article>
  );
}
