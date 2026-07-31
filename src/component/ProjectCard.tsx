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
        className={`
            flex
            h-full
            w-full
            flex-col
            items-center
            justify-start
            rounded-[30px]
            border
            px-4
            py-6
            transition
            //bg-[linear-gradient(to_bottom,var(--text-h)_10%,transparent_60%)]
            ${
            selected
                ? "active border-sky-400/100 bg-[linear-gradient(to_bottom,rgba(14,165,233,0.9)_10%,transparent_100%)]"
                : "border-transparent bg-transparent bg-[linear-gradient(to_left_bottom,rgba(14,165,233,0.5)_0%,transparent_70%)]"
            }
        `}
        onClick={onOpen}
        >
        <strong
            className="
                block
                w-full
                break-all
                text-[length:var(--fontsize-lx)]
                leading-[var(--leading-lx)]
                font-bold
                text-black
            "
            >
            {session.session_id}
            </strong>

        <span 
            className="
                mt-1 
                block 
                text-[length:var(--fontsize-subtitle)] 
                leading-[var(--leading-subtitle)]
                text-black
                line-clamp-2
                break-all
                ">
            {session.status}
        </span>
        </button>
    )

}