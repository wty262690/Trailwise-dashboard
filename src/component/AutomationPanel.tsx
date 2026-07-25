import { type RefObject } from "react";
import { Activity, Bot, GitBranch } from "lucide-react";

interface AutomationPanelProps {
  isCompleted: boolean;
  actionsCaptured: number;
  panelRef?: RefObject<HTMLElement | null>;
  onQueueAutomation: () => void;
  onCheckStatus: () => void;
}

export default function AutomationPanel(props: AutomationPanelProps) {
  const { isCompleted, actionsCaptured, panelRef, onQueueAutomation, onCheckStatus } = props;

  return (
    <article className="automation-card is-emphasized rounded-[14px] border border-slate-200/70 bg-white/80 p-7 shadow-[0_16px_42px_rgba(7,17,31,0.07)]" ref={panelRef}>
      <div className="card-head flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="eyebrow text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">BACKGROUND AUTOMATION</span>
          <h2>Automation robot operator</h2>
          <p>Start a guided robot run from the confirmed workflow memory. Trailwise stays in the background and asks only when handoff is needed.</p>
        </div>
        <span className={isCompleted ? "inline-flex min-h-6 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600" : "inline-flex min-h-6 items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"}>{isCompleted ? "Ready" : "Waiting"}</span>
      </div>

      <div className="automation-grid mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
          <GitBranch size={18} strokeWidth={1.75} aria-hidden="true" />
          <strong className="mt-3 block text-[13px] font-semibold text-slate-900">Workflow memory</strong>
          <span className="mt-2 block text-[12px] leading-5 text-slate-500">{isCompleted ? `${actionsCaptured} actions with stage results` : "Waiting for structured memory"}</span>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
          <Bot size={18} strokeWidth={1.75} aria-hidden="true" />
          <strong className="mt-3 block text-[13px] font-semibold text-slate-900">Robot control</strong>
          <span className="mt-2 block text-[12px] leading-5 text-slate-500">{isCompleted ? "Plan, operate, verify, report" : "Paused until memory is ready"}</span>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
          <Activity size={18} strokeWidth={1.75} aria-hidden="true" />
          <strong className="mt-3 block text-[13px] font-semibold text-slate-900">Human handoff</strong>
          <span className="mt-2 block text-[12px] leading-5 text-slate-500">Stops for login, CAPTCHA, permissions, or confirmation</span>
        </div>
      </div>

      <div className="automation-footer mt-5 flex flex-wrap gap-3">
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={!isCompleted} onClick={onQueueAutomation}>
          Queue robot run <Bot size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700" onClick={onCheckStatus}>
          Check readiness <Activity size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
