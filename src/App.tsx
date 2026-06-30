import { useState } from "react";
import { startRecording, stopRecording } from "./api/trailwise";
import ProjectsBar from "./component/ProjectsBar"
export default function App() {
  const [url, setUrl] = useState("http://localhost:5173");
  const [message, setMessage] = useState("");
  const [projectName, setProjectName] = useState("Project0");

  async function handleStart() {
    try {
      const result = await startRecording(url);

      console.log(result);
      setMessage(result.text ?? JSON.stringify(result));
      if(result.text[0]=='R') window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      setMessage("Start failed");
    }
  }

  async function handleStop() {
    try {
      const result = await stopRecording();

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
      <ProjectsBar></ProjectsBar>
      <section>
        <h2>PROJECT DETAIL</h2>
        <h1>{projectName}</h1>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://localhost:5173"
        />

        <button onClick={handleStart}>Start Recording</button>
        <button onClick={handleStop}>Stop Recording</button>
        <button onClick={handleStop}>Stop Recording</button>
        <button onClick={handleStop}>Stop Recording</button>

        <section>
          <p>{message}</p>
        </section>
      </section>
    </div>
  );
}


