'use client';

import { useState, useCallback } from 'react';
import { Project } from '@/types';
import Sidebar from '@/components/Sidebar';
import MainPanel from '@/components/MainPanel';
import RightPanel from '@/components/RightPanel';
import ImportGitModal from '@/components/ImportGitModal';

type ImportRepo = { owner: string; name: string };

const createProject = ({ owner, name }: ImportRepo): Project => ({
  id: name.toLowerCase(),
  name,
  description: null,
  status: 'pending',
  lastAction: 'Imported',
  updated: new Date().toLocaleString(),
  priority: 'blue',
  type: 'git',
  gitUrl: `https://github.com/${owner}/${name}`,
});

function parseGitUrl(url: string): { owner: string; repo: string } | null {
  try {
    const m = url.match(/github\.com[/:]([^/]+)\/([^/\s.]+)/);
    if (!m) return null;
    return { owner: m[1], repo: m[2] };
  } catch {
    return null;
  }
}

interface GitFile {
  path: string;
  sha: string;
  size?: number;
}

const DEMO_PROJECTS: Project[] = [
  {
    id: 'openclaw',
    name: 'openclaw-dashboard',
    description: 'Personal dev dashboard',
    status: 'active',
    lastAction: 'Merge PR #1',
    updated: new Date().toLocaleString(),
    priority: 'blue',
    type: 'git',
    gitUrl: 'https://github.com/cryptowez/openclaw-dashboard',
  },
  {
    id: 'ioniqai',
    name: 'ioniqai',
    description: 'IoniqAI marketing site',
    status: 'active',
    lastAction: 'Add services section',
    updated: new Date().toLocaleString(),
    priority: 'green',
    type: 'git',
    gitUrl: 'https://github.com/cryptowez/ioniqai',
  },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(DEMO_PROJECTS[0].id);
  const [selectedFile, setSelectedFile] = useState<GitFile | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [files, setFiles] = useState<GitFile[]>([]);
  const [aiLog, setAiLog] = useState<{ prompt: string; response: string }[]>([]);

  const selectedProject = projects.find(p => p.id === selectedProjectId) ?? null;
  const gitCoords = selectedProject?.gitUrl ? parseGitUrl(selectedProject.gitUrl) : null;

  const handleImportProject = (repo: ImportRepo) => {
    const newProject = createProject(repo);
    setProjects(prev => [...prev, newProject]);
    setImportOpen(false);
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setSelectedFile(null);
    setFileContent(null);
    setFiles([]);
  };

  const handleSelectFile = async (file: GitFile) => {
    setSelectedFile(file);
    setFileContent(null);
    if (!gitCoords) return;
    try {
      const res = await fetch(
        `/api/git?action=file&owner=${encodeURIComponent(gitCoords.owner)}&repo=${encodeURIComponent(gitCoords.repo)}&path=${encodeURIComponent(file.path)}&branch=main`
      );
      const data = await res.json();
      setFileContent(res.ok ? data.content : `Error: ${data.error}`);
    } catch (err) {
      setFileContent(`Error: ${err instanceof Error ? err.message : 'Failed to load'}`);
    }
  };

  const handleRefresh = async () => {
    if (!gitCoords) return;
    try {
      const res = await fetch(
        `/api/git?action=list&owner=${encodeURIComponent(gitCoords.owner)}&repo=${encodeURIComponent(gitCoords.repo)}&branch=main`
      );
      const data = await res.json();
      if (res.ok) setFiles(data.files);
    } catch {
      // silently ignore
    }
  };

  const handleAiCommand = useCallback((prompt: string, response: string) => {
    setAiLog(prev => [{ prompt, response }, ...prev].slice(0, 20));
  }, []);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar
        projects={projects}
        selectedId={selectedProjectId}
        onSelectProject={handleSelectProject}
        onImport={() => setImportOpen(true)}
        onNew={() => setImportOpen(true)}
      />
      <MainPanel
        project={selectedProject}
        selectedFile={selectedFile}
        fileContent={fileContent}
        files={files}
        onSelectFile={handleSelectFile}
        onRefresh={handleRefresh}
      />
      <RightPanel
        project={selectedProject}
        gitCoords={gitCoords}
        aiLog={aiLog}
        onAiCommand={handleAiCommand}
      />

      <ImportGitModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImportProject}
      />
    </div>
  );
}