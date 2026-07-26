import { forwardRef } from "react";
import { Activity, BookOpen, CircleDot, Copy, FileCode, Play, Route, Square } from "lucide-react";

const icon18 = { size: 18, strokeWidth: 1.75 };

type Panel = "overview" | "trace" | "runbook";
type WorkflowStage = "prepare" | "record" | "review" | "generate";
type LoadingAction = "test" | "runbook" | null;

type StageCopyRecord = Record<
  WorkflowStage,
  { eyebrow: string; title: string; body: string; status: string }
>;

interface WorkflowSummaryCardProps {
  workflowStage: WorkflowStage;
  workflowSteps: Array<{ id: WorkflowStage; label: string; detail: string }>;
  stageCopy: StageCopyRecord;
  statusLabel: string;
  durationSeconds: number;
  actionsCaptured: number;
  isRecording: boolean;
  isCompleted: boolean;
  loadingAction: LoadingAction;
  formatDuration: (value: number) => string;
  onBeginRecording: () => void;
  onCheckStatus: () => void;
  onStopRecording: () => void;
  onGenerateArtifact: (kind: Exclude<LoadingAction, null>) => void;
  onJumpTo: (panel: Panel) => void;
  onCopyRunbook: () => void;
}

const WorkflowSummaryCard = forwardRef<HTMLElement, WorkflowSummaryCardProps>(function WorkflowSummaryCard(
  {
    workflowStage,
    workflowSteps,
    stageCopy,
    statusLabel,
    durationSeconds,
    actionsCaptured,
    isRecording,
    isCompleted,
    loadingAction,
    formatDuration,
    onBeginRecording,
    onCheckStatus,
    onStopRecording,
    onGenerateArtifact,
    onJumpTo,
    onCopyRunbook,
  },
  ref,
) {
  const workflowStageIndex = workflowSteps.findIndex((step) => step.id === workflowStage);

  return (
    <article
      className={`summary-card stage-${workflowStage} ${isRecording ? "is-live" : ""}`}
      ref={ref}
    >
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
                if (step.id === "prepare") onJumpTo("overview");
                if (step.id === "record") onJumpTo("overview");
                if (step.id === "review") onJumpTo("trace");
                if (step.id === "generate") onJumpTo("runbook");
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

      <div className="stage-action-bar">
        {workflowStage === "prepare" && (
          <>
            <button className="btn dark primary-action" onClick={onBeginRecording}>
              Start recording <Play {...icon18} aria-hidden="true" />
            </button>
            <button className="btn light" onClick={onCheckStatus}>
              Check status <Activity {...icon18} aria-hidden="true" />
            </button>
          </>
        )}
        {workflowStage === "record" && (
          <>
            <button className="btn dark primary-action" onClick={onStopRecording}>
              Stop recording <Square {...icon18} aria-hidden="true" />
            </button>
            <button className="btn light" onClick={onCheckStatus}>
              Live status <Activity {...icon18} aria-hidden="true" />
            </button>
          </>
        )}
        {workflowStage === "review" && (
          <>
            <button className="btn dark primary-action" onClick={() => onJumpTo("trace")}>
              Inspect trace <Route {...icon18} aria-hidden="true" />
            </button>
            <button
              className={loadingAction === "test" ? "btn light loading" : "btn light"}
              disabled={loadingAction !== null}
              onClick={() => onGenerateArtifact("test")}
            >
              Generate Test <FileCode {...icon18} aria-hidden="true" />
            </button>
            <button
              className={loadingAction === "runbook" ? "btn light loading" : "btn light"}
              disabled={loadingAction !== null}
              onClick={() => onGenerateArtifact("runbook")}
            >
              Generate Runbook <BookOpen {...icon18} aria-hidden="true" />
            </button>
            <button className="btn light" onClick={onCheckStatus}>
              Status <Activity {...icon18} aria-hidden="true" />
            </button>
          </>
        )}
        {workflowStage === "generate" && (
          <>
            <button className="btn dark primary-action" onClick={() => onJumpTo("runbook")}>
              Open output <BookOpen {...icon18} aria-hidden="true" />
            </button>
            <button className="btn light" onClick={onCopyRunbook}>
              Copy runbook <Copy {...icon18} aria-hidden="true" />
            </button>
            <button className="btn light" onClick={onCheckStatus}>
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
  );
});

export default WorkflowSummaryCard;
