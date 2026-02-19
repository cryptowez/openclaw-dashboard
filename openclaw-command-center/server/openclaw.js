const { spawn } = require("child_process");

function runOpenclawAgent({ prompt }) {
  return new Promise((resolve, reject) => {
    const agentId = process.env.OPENCLAW_AGENT_ID || "main";
    const timeoutSec = String(process.env.OPENCLAW_AGENT_TIMEOUT || 600);
    const thinking = process.env.OPENCLAW_THINKING || "minimal";

    const args = [
      "agent",
      "--agent", agentId,
      "--message", prompt,
      "--json",
      "--timeout", timeoutSec,
      "--thinking", thinking
    ];

    const child = spawn("openclaw", args, {
      env: {
        ...process.env,
        // make sure token is available to the CLI if it needs it
        OPENCLAW_GATEWAY_TOKEN: process.env.OPENCLAW_GATEWAY_TOKEN || "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let out = "";
    let err = "";
    child.stdout.on("data", d => (out += d.toString()));
    child.stderr.on("data", d => (err += d.toString()));

    child.on("error", (e) => reject(new Error(`openclaw spawn failed: ${e.message}`)));

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`openclaw agent failed (code ${code}): ${err || out}`));
      }
      const text = out.trim();
      try {
        resolve(JSON.parse(text));
      } catch {
        resolve({ ok: true, raw: text });
      }
    });
  });
}

async function sendOpenclawPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") throw new Error("prompt required");
  return await runOpenclawAgent({ prompt });
}

module.exports = { sendOpenclawPrompt };
