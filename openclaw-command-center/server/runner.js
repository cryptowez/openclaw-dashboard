const { spawn } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

function runCmd(cmd, args, opts) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { ...opts, shell: false });
    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += d.toString()));
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("close", (code) => resolve({ code, out, err }));
  });
}

async function runProject({ projectDir, mode, logPath }) {
  await fs.ensureDir(path.dirname(logPath));

  const i = await runCmd("npm", ["install"], { cwd: projectDir });
  await fs.writeFile(logPath, `== npm install ==\n${i.out}\n${i.err}\n`, "utf8");
  if (i.code !== 0) return { ok: false, step: "install", ...i };

  const cmd = mode === "preview" ? ["run", "dev"] : ["run", "build"];
  const r = await runCmd("npm", cmd, { cwd: projectDir });
  await fs.appendFile(
    logPath,
    `== npm ${cmd.join(" ")} ==\n${r.out}\n${r.err}\n`,
    "utf8"
  );

  if (r.code !== 0) return { ok: false, step: mode, ...r };
  return { ok: true, step: mode, ...r };
}

module.exports = { runProject };
