import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "./api";
import { buildOrchestratorPrompt } from "./OrchestratorPrompt";
import { Sidebar } from "./components/Sidebar";
import "./styles.css";

type Project = { id: string; name: string; pathRelative: string; createdAt?: string };

const AGENTS = ["Orchestrator","Frontend-Agent","Backend-Agent","Integration-Agent","Reporting-Agent"];
const SUB_AGENTS = ["Frontend-Agent","Backend-Agent","Meta-Ads-Agent","Google-Ads-Agent","Ad-Creatives-Agent","Integration-Agent","Reporting-Agent"];

export default function App() {
  const [active, setActive] = useState("overview");

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const project = useMemo(() => projects.find(p => p.id === projectId) || null, [projects, projectId]);

  const [agent, setAgent] = useState("Orchestrator");
  const [subAgents, setSubAgents] = useState<string[]>(["Frontend-Agent","Backend-Agent","Integration-Agent","Reporting-Agent"]);

  const [userPrompt, setUserPrompt] = useState("");
  const [log, setLog] = useState<string>("");

  const [previewUrl, setPreviewUrl] = useState("http://127.0.0.1:8788/preview/test-project/index.html");
  const [fullscreen, setFullscreen] = useState(false);

  const [healthOk, setHealthOk] = useState<boolean>(false);

  const [vaultKey, setVaultKey] = useState("OPENCLAW_GATEWAY_TOKEN");
  const [vaultVal, setVaultVal] = useState("");
  const [vaultKeys, setVaultKeys] = useState<string[]>([]);

  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [commitMsg, setCommitMsg] = useState("publish");

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectPath, setNewProjectPath] = useState("");

  async function refreshAll() {
    try {
      const ps = await apiGet<Project[]>("/api/projects");
      setProjects(ps);
    } catch (e: any) {
      setLog(prev => prev + `\n[UI] projects error: ${e?.message || e}\n`);
    }

    try {
      const v = await apiGet<{keys:string[]}>("/api/vault");
      setVaultKeys(v.keys || []);
    } catch {}

    try {
      const h = await apiGet<{ok:boolean}>("/api/health");
      setHealthOk(Boolean(h.ok));
    } catch {
      setHealthOk(false);
    }
  }

  useEffect(() => { refreshAll(); }, []);

  async function addProject() {
    if (!newProjectName || !newProjectPath) {
      setLog(prev => prev + `\n[UI] Provide project name + pathRelative.\n`);
      return;
    }
    const created = await apiPost<Project>("/api/projects", { name: newProjectName, pathRelative: newProjectPath });
    setProjects(prev => [created, ...prev]);
    setProjectId(created.id);
    setNewProjectName("");
    setNewProjectPath("");
  }

  async function saveVault() {
    if (!vaultKey || !vaultVal) return;
    await apiPost("/api/vault", { entries: { [vaultKey]: vaultVal } });
    setVaultVal("");
    const v = await apiGet<{keys:string[]}>("/api/vault");
    setVaultKeys(v.keys || []);
    setLog(prev => prev + `\n[UI] vault saved: ${vaultKey}\n`);
  }

  async function runPrompt() {
    if (!project) {
      setLog(prev => prev + `\n[UI] Select a project first.\n`);
      return;
    }
    const finalPrompt = buildOrchestratorPrompt(userPrompt, {
      projectName: project.name,
      agent,
      subAgents
    });

    setLog(prev => prev + `\n[UI] sending prompt...\n`);
    const res = await apiPost<{ok:boolean;output?:string;error?:string}>("/api/openclaw/prompt", {
      prompt: finalPrompt,
      agent,
      subAgents,
      projectId: project.id
    });

    if (!res.ok) {
      setLog(prev => prev + `\n[ERROR] ${res.error}\n`);
      return;
    }
    if (res.output) setLog(prev => prev + `\n${res.output}\n`);
  }

  // UI BODY WILL BE RESTORED IN NEXT STEP — for now keep it minimal but functional
  return (
    <div className="app-shell">
      <Sidebar active={active} onSelect={setActive} />
      <div className="app-content">
        <div style={{ padding: 12, border: "2px solid rgba(255,255,255,0.2)", borderRadius: 12, marginBottom: 12 }}>
          <b>UI recovered.</b> Next step will restore the full dashboard JSX into cards.
        </div>

        <button onClick={refreshAll}>Refresh</button>
        <button onClick={runPrompt} style={{ marginLeft: 8 }}>Run Prompt</button>
<div style={{ marginTop: 12, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, overflow: "hidden" }}>
  <div style={{ padding: 10, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
    <b>Preview</b>
  </div>
  <iframe
    src={previewUrl}
    style={{ width: "100%", height: fullscreen ? "80vh" : "45vh", border: "0" }}
    title="Project Preview"
  />
</div>

        <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{log}</pre>
      </div>
    </div>
  );
}
