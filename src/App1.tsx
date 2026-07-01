import { useState } from "react";
import { startRecording, stopRecording, generateTest, generateRunbook } from "./api/trailwise";
import { deleteSession } from "./api/trailwise";
import ProjectsBar from "./component/ProjectsBar"
import ProjectDelete from "./component/ProjectDelete";

export default function App() {
  const [url, setUrl] = useState("http://localhost:5173");
  const [message, setMessage] = useState("");
  const [projectName, setProjectName] = useState("CREATE YOUR PROJECT");
  const [currentSession, setCurrentSession] = useState(null);


  const [sessions, setSessions] = useState([]);

  async function loadSessions() {
    const res = await fetch("http://localhost:3000/dev/sessions");
    const data = await res.json();

    setSessions(data.sessions.filter((s) => s.status !== "deleted"));
  }

  async function handleDelete(session) {
    if (!session) return;

    await deleteSession(session.session_id);
    await loadSessions();

    setCurrentSession(null);
    setProjectName("CREATE YOUR PROJECT");
  }

  async function handleStart() {
    try {
      const result = await startRecording(url);

      console.log(result);

      setMessage(result.text ?? JSON.stringify(result));

      await loadSessions();

      const match = result.text?.match(/Session:\s*(\S+)/);
      const sessionId = match?.[1];

      if (sessionId) {
        const res = await fetch("http://localhost:3000/dev/sessions");
        const data = await res.json();
        const newSession = data.sessions.find(
          (s) => s.session_id === sessionId
        );

        setCurrentSession(newSession);
        setProjectName(newSession.session_id);
      }

      if (result.text?.[0] === "R") {
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error(err);
      setMessage("Start failed");
    }
  }

  async function handleStop() {
    try {
      const result = await stopRecording(currentSession.session_id);

      console.log(result);
      setMessage(result.text ?? JSON.stringify(result));
    } catch (err) {
      console.error(err);
      setMessage("Stop failed");
    }
  }
    async function handleGrunbook() {
    try {
      const result = await generateRunbook(currentSession.session_id);

      console.log(result);
      setMessage(result.text ?? JSON.stringify(result));
    } catch (err) {
      console.error(err);
      setMessage("Stop failed");
    }
  }
    async function handleGtest() {
    try {
      const result = await generateTest(currentSession.session_id);

      console.log(result);
      setMessage(result.text ?? JSON.stringify(result));
    } catch (err) {
      console.error(err);
      setMessage("Stop failed");
    }
  }

  return (
    <div>
      <section>
        <h1>Trailwise</h1>
        <h2>Workspace console</h2>
      </section>

      <ProjectsBar
        sessions={sessions}
        loadSessions={loadSessions}
        onOpen={(session) => {
          setCurrentSession(session);
          setProjectName(session.session_id);
        }}
      />

      <section>
        <h2>PROJECT DETAIL</h2>
        <h1>
        {projectName}
        </h1>
  
        <ProjectDelete
          session={currentSession}
          onDelete={handleDelete}
        />              

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://localhost:5173"
        />

        <button onClick={handleStart}>Start Recording</button>
        <button onClick={handleStop}>Stop Recording</button>
        <button onClick={handleGtest}>Generate</button>
        <button onClick={handleGrunbook}>Run Book</button>

        <section>
          <h2>STATUS</h2>
          <p>{message}</p>
        </section>
      </section>
    </div>
  );
}


