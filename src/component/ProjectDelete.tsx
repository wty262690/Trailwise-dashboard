interface ProjectDeleteProps {
  session: { session_id: string } | null;
  onDelete: (session: { session_id: string }) => void;
}

export default function ProjectDelete({ session, onDelete }: ProjectDeleteProps) {
  if (!session) return null;

  return (
    <button className="btn red rounded-full border border-red-500 py-1.5 px-8" onClick={() => onDelete(session)}>
      Delete This Project
    </button>
  );
}
