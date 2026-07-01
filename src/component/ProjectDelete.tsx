export default function ProjectDelete({ session, onDelete }) {
  if (!session) return null;

  return (
    <button className="btn red"onClick={() => onDelete(session)}>
      Delete
    </button>
  );
}