export default function ProjectCard({
    session,
    selected,
    onOpen
}) {

    return(
        <button
            className={`project-row ${
                selected ? "active" : ""
            }`}
            onClick={onOpen}
        >
            <strong>{session.session_id}</strong>

            <span style={{ textAlign: "left" }}>{session.status}</span>
        </button>
    )

}