const API = "http://localhost:3000";

async function slackCommand(text) {
  const res = await fetch(`${API}/dev/slack-command`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      team_id: "T_LOCAL",
      channel_id: "C_LOCAL",
      user_id: "U_LOCAL",
    }),
  });

  return res.json();
}

export function startRecording(url) {
  return slackCommand(`start ${url}`);
}

export function stopRecording() {
  return slackCommand("stop");
}

export function statusRecording() {
  return slackCommand("status");
}

export function generateTest() {
  return slackCommand("generate-test");
}

export function generateRunbook() {
  return slackCommand("generate-runbook");
}

