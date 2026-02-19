const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs-extra");
const dotenv = require("dotenv");
const { runProject } = require("./runner");

const { sendOpenclawPrompt } = require("./openclaw");
const github = require("./github");

const HOME = process.env.HOME || "";
const OPENCLAW_DIR = path.join(HOME, ".openclaw");
const WORKSPACE_DIR = path.join(OPENCLAW_DIR, "workspace");
const DASHBOARD_DIR = path.join(OPENCLAW_DIR, "dashboard");
const ENV_PATH = path.join(OPENCLAW_DIR, ".env");
const PROJECTS_PATH = path.join(DASHBOARD_DIR, "projects.json");

dotenv.config({ path: ENV_PATH });

async function ensureState() {
  await fs.ensureDir(WORKSPACE_DIR);
  await fs.ensureDir(DASHBOARD_DIR);
  if (!(await fs.pathExists(ENV_PATH))) await fs.writeFile(ENV_PATH, "", "utf8");
  if (!(await fs.pathExists(PROJECTS_PATH))) await fs.writeJson(PROJECTS_PATH, [], { spaces: 2 });
}

async function readProjects() {
  await ensureState();
  const data = await fs.readJson(PROJECTS_PATH).catch(() => []);
  return Array.isArray(data) ? data : [];
}

async function saveProjects(projects) {
  await fs.writeJson(PROJECTS_PATH, projects, { spaces: 2 });
}

async function readVaultKeys() {
  await ensureState();
  const raw = await fs.readFile(ENV_PATH, "utf8").catch(() => "");
  return raw
    .split("\n")
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#") && l.includes("="))
    .map(l => l.split("=")[0].trim());
}

async function upsertVault(entries) {
  await ensureState();
  const raw = await fs.readFile(ENV_PATH, "utf8").catch(() => "");
  const map = {};
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const k = t.slice(0, t.indexOf("=")).trim();
    const v = t.slice(t.indexOf("=") + 1);
    map[k] = v;
  }
  for (const [k, v] of Object.entries(entries || {})) {
    if (typeof k === "string" && k.trim()) map[k.trim()] = String(v ?? "");
  }
  const out = Object.entries(map).map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
  await fs.writeFile(ENV_PATH, out, "utf8");
}

const app = express();
app.get("/", (_req, res) => {
  res.type("text").send("Command Center API running. Try /api/health");
});
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", async (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/projects", async (_req, res) => {
  const projects = await readProjects();
  res.json(projects);
});
// Preview artifacts served by backend (so dashboard can iframe it)
app.use(
  "/preview",
  require("express").static(require("path").join(require("os").homedir(), ".openclaw", "workspace"), {
    fallthrough: true,
  })
);

app.post("/api/projects", async (req, res) => {
  try {
    const { name, pathRelative } = req.body || {};
    if (!name || !pathRelative) return res.status(400).json({ error: "name and pathRelative required" });

    const projects = await readProjects();
    const project = {
      id: String(Date.now()),
      name,
      pathRelative,
      createdAt: new Date().toISOString(),
    };

    projects.unshift(project);
    await saveProjects(projects);

    await fs.ensureDir(path.join(WORKSPACE_DIR, pathRelative));

    res.status(201).json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/vault", async (_req, res) => {
  try {
    const keys = await readVaultKeys();
    res.json({ keys });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/vault", async (req, res) => {
  try {
    const { entries } = req.body || {};
    if (!entries || typeof entries !== "object") return res.status(400).json({ error: "entries object required" });
    await upsertVault(entries);
    const keys = await readVaultKeys();
    res.json({ ok: true, keys });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/openclaw/prompt", async (req, res) => {
  try {
    const { prompt, mode, projectId } = req.body || {};

let finalPrompt = prompt;
if (!finalPrompt && mode === "preview" && projectId) {
  finalPrompt = [
    `PROJECT_ID: ${projectId}`,
    `TASK: Generate preview output for the project.`,
    `OUTPUT: Return strict JSON only.`,
  ].join("\n");
}

if (!finalPrompt) return res.status(400).json({ error: "prompt required" });


    const out = await sendOpenclawPrompt(finalPrompt);

    if (!out.ok) return res.status(500).json({ ok: false, error: out.error });
    res.json({ ok: true, output: out });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/github/publish", async (req, res) => {
  try {
    const { projectPathRelative, repoUrl, branch, message } = req.body || {};
    if (!projectPathRelative || !repoUrl) return res.status(400).json({ error: "projectPathRelative and repoUrl required" });
    const out = await github.publishToGitHub({ projectPathRelative, repoUrl, branch, message });
    res.json(out);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/github/pull", async (req, res) => {
  try {
    const { projectPathRelative, repoUrl, branch } = req.body || {};
    if (!projectPathRelative || !repoUrl) return res.status(400).json({ error: "projectPathRelative and repoUrl required" });
    const out = await github.pullFromGitHub({ projectPathRelative, repoUrl, branch });
    res.json(out);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
app.post("/api/projects/:id/run", async (req, res) => {
  const { id } = req.params;
  const mode = req.body?.mode || "build";
  const projectDir = path.join(WORKSPACE_DIR, id);
const { spawn } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

// POST /api/github/import
app.post("/api/github/import", async (req, res) => {
  try {
    const { repoUrl, branch } = req.body || {};
    if (!repoUrl || !branch) return res.status(400).json({ error: "repoUrl and branch required" });

    const repoName = path.basename(repoUrl, ".git");
    const projectDir = path.join(WORKSPACE_DIR, repoName);

    // Als folder al bestaat → git pull, anders clone
    if (await fs.pathExists(projectDir)) {
      const pull = spawn("git", ["pull", "origin", branch], { cwd: projectDir, shell: true });
      let out = "", err = "";
      pull.stdout.on("data", (d) => (out += d.toString()));
      pull.stderr.on("data", (d) => (err += d.toString()));
      pull.on("close", (code) => {
        return res.json({ status: code === 0 ? "success" : "error", log: out + err, projectDir });
      });
    } else {
      const clone = spawn("git", ["clone", "-b", branch, repoUrl, repoName], { cwd: WORKSPACE_DIR, shell: true });
      let out = "", err = "";
      clone.stdout.on("data", (d) => (out += d.toString()));
      clone.stderr.on("data", (d) => (err += d.toString()));
      clone.on("close", (code) => {
        return res.json({ status: code === 0 ? "success" : "error", log: out + err, projectDir });
      });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

  try {
    if (!(await fs.pathExists(projectDir))) {
      return res.status(404).json({ error: "Project not found" });
    }

    const logPath = path.join(projectDir, ".command-center", `run-${mode}.log`);

    const attempt = async () =>
      runProject({ projectDir, mode, logPath });

    let r = await attempt();
// Auto-fix minimal preview file
if (mode === "preview") {
  const devScript = "index.js";
  const devFile = path.join(projectDir, devScript);

  if (!(await fs.pathExists(devFile))) {
    await fs.writeFile(devFile, 'console.log("Preview successful");', "utf8");
  }
}

    if (r.ok) {
      return res.json({ status: "success", mode, logPath, output: r.out });
    }

    // one self-heal attempt (no loops)
    const errorText = (r.err || r.out || "").slice(0, 6000);

    await sendOpenclawPrompt(
  [
    "Fix the project so the runner succeeds.",
    `Target: ${mode} (npm run ${mode === "preview" ? "dev" : "build"})`,
    "Rules:",
    "- Do NOT provide terminal instructions.",
    "- Make changes by rewriting FULL FILES (no partial edits).",
    "- If editing JSON, ensure it parses (JSON.parse).",
    "Failure observed:",
    errorText,
  ].join("\n")
);


    r = await attempt();
    if (r.ok) {
      return res.json({ status: "success", mode, logPath, output: r.out, healed: true });
    }

    return res.status(500).json({
      status: "error",
      mode,
      healed: true,
      logPath,
      message: r.err || r.out || "runner failed",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const port = 8788;


ensureState().then(() => {
  app.listen(port, "127.0.0.1", () => {
    console.log(`[server] listening on http://127.0.0.1:${port}`);
  });
});
