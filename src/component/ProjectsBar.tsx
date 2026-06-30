import { useEffect, useState } from "react";

export default function ProjectsBar() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const res = await fetch("http://localhost:3000/dev/sessions");
    const data = await res.json();

    setSessions(data.sessions);
  }

  return (
    <div>
      <h1>Sessions</h1>

      {sessions.map((session) => (
        <div key={session.session_id}>
          <button>
          <h3>{session.session_id}</h3>
          <p>Status: {session.status}</p>
          </button>
        </div>
      ))}
    </div>
  );
}

