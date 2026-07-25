import type { TraceEventItem } from "./types";

interface WorkflowInspectorProps {
  selectedEvent: TraceEventItem | null;
  currentSessionId?: string;
  targetUrl: string;
  traceLoading: boolean;
}

export default function WorkflowInspector(props: WorkflowInspectorProps) {
  const { selectedEvent, currentSessionId, targetUrl, traceLoading } = props;

  return (
    <aside className="inspector sticky top-24 min-h-[752px] rounded-[14px] border border-slate-200/70 bg-white/80 p-8 shadow-[0_16px_42px_rgba(7,17,31,0.07)]">
      <div className="eyebrow text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">MEMORY DETAIL</div>

      {selectedEvent ? (
        <div className="inspector-content mt-4" key={`${currentSessionId}-${selectedEvent.step}`}>
          <div className="inspector-title flex items-center justify-between gap-4">
            <h2>{selectedEvent.action}</h2>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">Selected</span>
          </div>

          <p>
            Event {selectedEvent.step} from session {currentSessionId}.
          </p>

          <div className="inspector-section mt-6 border-t border-slate-200/70 pt-6">
            <dl className="grid gap-4 sm:grid-cols-[132px_minmax(0,1fr)]">
              <dt>Time</dt>
              <dd>{selectedEvent.time}</dd>

              <dt>Selector</dt>
              <dd>{selectedEvent.selector}</dd>

              <dt>Result</dt>
              <dd>{selectedEvent.result}</dd>

              <dt>Target</dt>
              <dd>{targetUrl}</dd>
            </dl>
          </div>
        </div>
      ) : (
        <div className="inspector-content mt-4">
          <div className="inspector-title flex items-center justify-between gap-4">
            <h2>{traceLoading ? "Loading workflow memory..." : "No workflow memory"}</h2>
          </div>

          <p>{traceLoading ? "Loading the selected project's recorded events." : "This project has no confirmed recording details yet."}</p>
        </div>
      )}
    </aside>
  );
}
