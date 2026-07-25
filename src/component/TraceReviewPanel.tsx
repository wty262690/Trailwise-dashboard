import { type RefObject } from "react";
import type { TraceEventItem } from "./types";
import { MovingBorderButton } from "./ui/MovingBorderButton";
import { CircleDot } from "lucide-react";

const icon18 = { size: 18, strokeWidth: 1.75 };

interface TraceReviewPanelProps {
  workflowStage: string;
  traceEvents: TraceEventItem[];
  selectedStep: number;
  panelRef?: RefObject<HTMLElement | null>;
  setSelectedStep: (step: number) => void;
  onConfirmMemory: () => void;
  visibleEventClass: (event: TraceEventItem) => string;
  visibleEventState: (event: TraceEventItem) => string;
}

export default function TraceReviewPanel(props: TraceReviewPanelProps) {
  const { workflowStage, traceEvents, selectedStep, panelRef, setSelectedStep, onConfirmMemory, visibleEventClass, visibleEventState } = props;

  return (
    <article className={`timeline-card rounded-[14px] border border-slate-200/70 bg-white/80 p-7 shadow-[0_16px_42px_rgba(7,17,31,0.07)] ${workflowStage === "record" || workflowStage === "review" ? "is-emphasized" : "is-secondary"}`} ref={panelRef}>
      <h2>Review structured memory</h2>
      <p>Use this detail view only when you need to inspect the captured actions behind the memory summary.</p>
      <div className="timeline-layout mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_96px]">
        <div className="table overflow-hidden rounded-xl border border-slate-200/70">
          <div className="table-head grid min-h-11 grid-cols-[64px_1fr_132px_116px] items-center border-b border-slate-200/70 bg-slate-50 px-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            <span>Step</span>
            <span>Action</span>
            <span>State</span>
            <span>Time</span>
          </div>
          {traceEvents.map((event) => (
            <button className={selectedStep === event.step ? "table-row selected grid min-h-[52px] w-full grid-cols-[64px_1fr_132px_116px] items-center border-b border-slate-200/70 bg-slate-50 px-5 text-left" : "table-row grid min-h-[52px] w-full grid-cols-[64px_1fr_132px_116px] items-center border-b border-slate-200/70 bg-white px-5 text-left"} key={event.step} onClick={() => setSelectedStep(event.step)}>
              <span>{event.step}</span>
              <strong>{event.action}</strong>
              <em className={visibleEventClass(event)}>{visibleEventState(event)}</em>
              <span>{event.time}</span>
            </button>
          ))}
          <div className="p-4">
            <MovingBorderButton className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white" onClick={onConfirmMemory}>
              Confirm memory <CircleDot {...icon18} aria-hidden="true" />
            </MovingBorderButton>
          </div>
        </div>
        <div className="flow-map grid min-h-[248px] content-start gap-3 rounded-xl border border-slate-200/70 bg-white p-4">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">Stage map</span>
          <em className={selectedStep === 1 ? "active" : ""}>Nav</em>
          <em className={selectedStep === 3 ? "active" : ""}>Input</em>
          <em className={selectedStep === 4 ? "active" : ""}>Submit</em>
          <em className={selectedStep >= 5 ? "active" : ""}>Verify</em>
        </div>
      </div>
    </article>
  );
}
