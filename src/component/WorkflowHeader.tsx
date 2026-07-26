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
      <div className="relative z-10 mb-6 flexgap-3 p-2">
        <div className="w-fullflex flex-wrap items-center gap-2">
          <h2 className="w-[80%] text-[min(5vw,17px)] text-left leading-10 letter-spacing-[1vw] uppercase text-white/20">{title=='Create New Projec' ? 'add project' : 'workflow'}</h2>
          <h1 className="w-[80%] text-[min(6vw,30px)] text-left leading-10 letter-spacing-[1vw] uppercase my-2">{title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex text-left min-h-6 rounded-full px-2.5 py-1 font-semibold border text-[min(11px,2vw)] ${
              isCompleted
                ? "text-white border-emerald-200 bg-emerald-400"
                : "text-white border-amber-400 bg-[rgba(250,190,0,0.3)]"
            }`}
          >
            {memoryConfirmed
              ? "completed recording"
              : isCompleted
                ? "complete recording"
                : currentSessionStatus? currentSessionStatus : "not recorded record data yet"}
          </span>
          <span className={`inline-flex text-left min-h-6 rounded-full px-2.5 py-1 font-semibold border text-[min(11px,2vw)] ${
                isCompleted
                ? "text-white border-emerald-200 bg-emerald-400"
                : "text-white border-amber-400 bg-[rgba(250,190,0,0.3)]"
                }`}>{memoryConfirmed ? "Memory saved" : isCompleted ? "Review memory" : "not recorded memory yet"}</span>
          </div>
        </div>
      </div>
      {/*<div className="relative z-10 mb-5 text-[12px] leading-4 text-slate-500">Trailwise / Projects / Expense Approval / Trace detail</div>*/}
      {/*currentSessionStatus && (
        <div className="relative z-10 mt-2 text-[12px] text-slate-500">
          <span>Session status: {currentSessionStatus}</span>
        </div>
      )*/}
    </>
  );
}
