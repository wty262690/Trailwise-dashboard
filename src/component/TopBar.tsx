import { PanelsTopLeft, Search } from "lucide-react";

const icon18 = { size: 18, strokeWidth: 1.75 };

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 grid h-14 w-full items-center gap-4 border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur md:grid-cols-[minmax(168px,232px)_minmax(280px,520px)_minmax(0,1fr)_auto]">
      <button
        className={`grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition ${sidebarOpen ? "border-sky-200 bg-sky-50 text-slate-900" : "hover:border-slate-300"}`}
        aria-label={sidebarOpen ? "Collapse workspace sidebar" : "Open workspace sidebar"}
        onClick={onToggleSidebar}
      >
        <PanelsTopLeft {...icon18} aria-hidden="true" />
      </button>
      <img className="block h-8 w-40 object-contain object-left" src="src/assets/trailwise-logo-exact.svg" alt="Trailwise" />
      <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200/80 bg-white/70 px-3 text-sm text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.84)]">
        <Search {...icon18} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">Search recordings, runbooks, actions...</span>
        <kbd className="text-[11px] text-slate-400">Cmd K</kbd>
      </label>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Top navigation">
        <a className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-slate-900" href="#">Product</a>
        <a className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-slate-900" href="#">Runs</a>
        <a className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-slate-900" href="#">Data</a>
        <a className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-slate-900" href="#">Docs</a>
      </nav>
      <span className="inline-flex min-h-6 items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-600">Helper ready</span>
    </header>
  );
}
