interface ProjectCardProps {
    session: { session_id: string; status: string };
    selected: boolean;
    onOpen: () => void;
}

export default function ProjectCard({
    session,
    selected,
    onOpen
}: ProjectCardProps) {

    return(
        <button
            className={`project-row w-full rounded-xl border px-4 py-3 text-left transition ${selected ? "active border-sky-400/40 bg-sky-500/10" : "border-transparent bg-transparent hover:bg-white/5"}`}
            onClick={onOpen}
        >
            <strong className="block text-[12px] font-semibold text-slate-100">{session.session_id}</strong>
            <span className="mt-1 block text-left text-[11px] text-slate-400">{session.status}</span>
        </button>
    )

}