import { GitBranch } from "lucide-react";

interface WorkflowHeaderProps {
  title: string;
  statusLabel: string;
  isRecording: boolean;
  isCompleted: boolean;
  memoryConfirmed: boolean;
  currentSessionStatus?: string;
}

const icon20 = { size: 20, strokeWidth: 1.75 };

export default function WorkflowHeader(props: WorkflowHeaderProps) {
  const { title, statusLabel, isRecording, isCompleted, memoryConfirmed, currentSessionStatus } = props;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56" />
      <div className="pointer-events-none absolute right-[-48px] top-0 h-[180px] w-[560px] opacity-20 bg-[linear-gradient(rgba(216,225,237,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(216,225,237,0.7)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(circle_at_50%_50%,black_0,transparent_76%)]" />
      <div className="relative z-10 mb-6 flex items-center gap-3 p-2">
        <div className="grid h-10 w-10 place-items-center">
          <div
            className="
              absolute
              inset-0
              rounded-xl 
              h-10 w-10
              shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]
              opacity-40
              animate-[shine_2s_linear_infinite]
            "
          />
          <GitBranch {...icon20} aria-hidden="true" />
        </div>
        <div className="w-fullflex flex-wrap items-center gap-2">
          <h1 className="text-[32px] text-left">{title}</h1>
          <span className={isRecording ? "inline-flex min-h-6 items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600" : isCompleted ? "inline-flex min-h-6 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600" : "inline-flex min-h-6 items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"}>{statusLabel}</span>
          <span className={isCompleted ? "inline-flex min-h-6 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600" : "inline-flex min-h-6 items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"}>{memoryConfirmed ? "Memory saved" : isCompleted ? "Review memory" : "Not recorded yet"}</span>
        </div>
      </div>
      <div className="relative z-10 mb-5 text-[12px] leading-4 text-slate-500">Trailwise / Projects / Expense Approval / Trace detail</div>
      
      {currentSessionStatus && (
        <div className="relative z-10 mt-2 text-[12px] text-slate-500">
          <span>Session status: {currentSessionStatus}</span>
        </div>
      )}
    </>
  );
}
