import { type RefObject } from "react";
import { Bot, Copy } from "lucide-react";
import { MovingBorderButton } from "./ui/MovingBorderButton";

interface RunbookPanelProps {
  workflowStage: string;
  memoryConfirmed: boolean;
  runbookText: string;
  copied: boolean;
  panelRef?: RefObject<HTMLElement | null>;
  onCopyRunbook: () => void;
  onConfirmRunBook: () => void;
}

export default function RunbookPanel(props: RunbookPanelProps) {
  const { workflowStage, memoryConfirmed, runbookText, copied, panelRef, onCopyRunbook, onConfirmRunBook } = props;

  return (
    <article className={`runbook-card rounded-[14px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_16px_42px_rgba(7,17,31,0.07)] ${workflowStage === "generate" ? "is-emphasized" : "is-secondary"}`} ref={panelRef}>
      <div className="card-head mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2>Outputs from workflow memory</h2>
          <p>Generated from workflow memory, with initial state and expected stage results preserved.</p>
        </div>
        <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700" disabled={!memoryConfirmed} onClick={onCopyRunbook}>
          Copy runbook <Copy size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <div className="code-panel overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="code-tabs flex h-10 items-center gap-2 border-b border-slate-800/80 bg-slate-900/70 px-3">
          <span>workflow_memory.md</span>
          <span>runbook.md</span>
          <button aria-label="Copy" className={copied ? "copied ml-auto" : "ml-auto"} onClick={onCopyRunbook}>
            <Copy size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <pre className="min-h-[152px] whitespace-pre-wrap p-4 text-sm text-slate-200">{runbookText}</pre>
      </div>
      <div className="mt-4">
        <MovingBorderButton className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white" onClick={onConfirmRunBook}>
          Confirm Run Book <Bot size={18} strokeWidth={1.75} aria-hidden="true" />
        </MovingBorderButton>
      </div>
    </article>
  );
}
