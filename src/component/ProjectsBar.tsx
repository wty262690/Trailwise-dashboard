import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectsBar({
  sessions,
  loadSessions,
  onOpen,
  currentSession,
}) {
  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div>
      <div className="section-label">Projects</div>

      {sessions.map((session) => (
      <ProjectCard
        key={session.session_id}
        session={session}
        selected={
          currentSession?.session_id === session.session_id
        }
        onOpen={() => onOpen(session)}
      />
    ))}
    </div>
  );
}