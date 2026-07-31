import ProjectsBar from "./ProjectsBar";

interface WorkspaceSidebarProps {
  sessions: any[];
  currentSession: any;
  loadSessions: () => Promise<void>;
  onOpenSession: (session: any) => void;
}

export default function WorkspaceSidebar({
  sessions,
  currentSession,
  loadSessions,
  onOpenSession,
}: WorkspaceSidebarProps) {
  return (
    <aside className="absolute inset-0 z-0 h-screen w-screen overflow-y-auto bg-slate-950/95 p-8 text-slate-100 shadow-2xl md:h-full md:border-r md:border-slate-800/60 md:bg-slate-950/90">
      {/*<div className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-200">ACME WORKSPACE</div>*/}
      {/*<div className="mt-2 text-[12px] text-slate-400">4 projects / local helper on</div>*/}

      <ProjectsBar
        sessions={sessions}
        loadSessions={loadSessions}
        currentSession={currentSession}
        onOpen={onOpenSession}
      />

      {/*<div className="my-7 h-px bg-white/10" />
      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between gap-3">
          <strong className="text-[12px] font-semibold text-slate-100">Local helper</strong>
          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">Ready</span>
        </div>
        <p className="mt-3 text-[12px] leading-5 text-slate-400">Mac confirmation is required before the browser recording starts.</p>
        <span className="mt-4 block h-1.5 overflow-hidden rounded-full bg-slate-700/80">
          <i className="block h-full w-[82%] rounded-full bg-emerald-400" />
        </span>
      </div>*/}
    </aside>
  );
}
