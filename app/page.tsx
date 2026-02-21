'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Plus } from 'lucide-react';
import { Project } from '@/types';

// Lazy loaded components
const AICommandBox = dynamic(() => import('@/components/AICommandBox'), {
  loading: () => <div className="text-sm text-gray-400 p-4">Loading AI…</div>,
  ssr: false,
});
const GitOpsPanel = dynamic(() => import('@/components/GitOpsPanel'), { ssr: false });
const CodePreviewModal = dynamic(() => import('@/components/CodePreviewModal'));
const ProjectDetailsModal = dynamic(() => import('@/components/ProjectDetailsModal'));
const ImportGitModal = dynamic(() => import('@/components/ImportGitModal'));

// Helpers
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

const DEMO_PROJECTS: Project[] = [
  {
    id: 'alpha',
    name: 'Project Alpha',
    description: 'A demo project showcasing the OpenClaw dashboard features.',
    status: 'active',
    lastAction: 'Deploy to production',
    updated: '2/20/2026, 6:30:00 AM',
    priority: 'red',
    type: 'new',
  },
  {
    id: 'beta',
    name: 'Project Beta',
    description: 'A project imported from GitHub for testing purposes.',
    status: 'pending',
    lastAction: 'Code review',
    updated: '2/20/2026, 6:15:00 AM',
    priority: 'orange',
    type: 'git',
    gitUrl: 'https://github.com/demo/beta',
  },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [projectDetailsOpen, setProjectDetailsOpen] = useState(false);
  const [aiLog, setAiLog] = useState<{ prompt: string; response: string }[]>([]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleImportProject = (repo: ImportRepo) => {
    const newProject = createProject(repo);
    setProjects([...projects, newProject]);
    setImportOpen(false);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProjectId(project.id);
    setCodePreviewOpen(true);
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setProjectDetailsOpen(false);
    setSelectedProjectId(null);
  };

  const handleProjectUpdate = (projectId: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, ...updatedProject } : p));
    setProjectDetailsOpen(false);
  };

  const handleAiCommand = useCallback((prompt: string, response: string) => {
    setAiLog(prev => [{ prompt, response }, ...prev].slice(0, 20));
  }, []);

  // Parse git coords from a project gitUrl
  const gitCoords = selectedProject?.gitUrl ? parseGitUrl(selectedProject.gitUrl) : null;

  return (
    <div className="p-6">
      {/* Top Section */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-400">Usage</p>
          <p className="text-2xl font-bold">23.5K</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-400">Budget</p>
          <p className="text-2xl font-bold">100K</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <button
            onClick={() => setImportOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Import
          </button>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
            Deploy
          </button>
        </div>
      </div>

      {/* Selected-project workspace */}
      {selectedProject && (
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* AI Command Box with model selector */}
          <div className="space-y-3">
            <AICommandBox projectName={selectedProject.name} onCommand={handleAiCommand} />
            {/* AI response log */}
            {aiLog.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-400 uppercase">AI Responses</p>
                {aiLog.map((entry, i) => (
                  <div key={i} className="border-b border-gray-800 pb-3 last:border-0">
                    <p className="text-xs text-gray-500 mb-1">▶ {entry.prompt}</p>
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">{entry.response}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Git Ops Panel — only for git projects */}
          {gitCoords && (
            <GitOpsPanel
              owner={gitCoords.owner}
              repo={gitCoords.repo}
              branch="main"
            />
          )}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className={`bg-gray-900 border rounded-lg p-6 hover:border-gray-600 transition text-left ${
              selectedProjectId === project.id ? 'border-blue-500' : 'border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  project.status === 'active'
                    ? 'bg-green-900 text-green-300'
                    : project.status === 'pending'
                    ? 'bg-yellow-900 text-yellow-300'
                    : project.status === 'blocked'
                    ? 'bg-red-900 text-red-300'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">Last action: {project.lastAction}</p>
            <p className="text-gray-500 text-xs">Updated: {project.updated}</p>
            {project.type === 'git' && project.gitUrl && (
              <p className="text-xs text-blue-400 mt-1 truncate">⎇ {project.gitUrl}</p>
            )}
          </button>
        ))}
      </div>

      {/* Modals */}
      <ImportGitModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImportProject}
      />

      {selectedProject && (
        <>
          <CodePreviewModal
            isOpen={codePreviewOpen}
            onClose={() => setCodePreviewOpen(false)}
            projectName={selectedProject.name}
            files={[
              {
                name: 'package.json',
                language: 'json',
                content: `{ "name": "${selectedProject.name}", "version": "1.0.0" }`,
              },
              {
                name: 'README.md',
                language: 'markdown',
                content: `# ${selectedProject.name}\nProject dashboard`,
              },
            ]}
          />
          
          <ProjectDetailsModal
            project={selectedProject}
            isOpen={projectDetailsOpen}
            onClose={() => setProjectDetailsOpen(false)}
            onDelete={handleProjectDelete}
            onUpdate={handleProjectUpdate}
          />
        </>
      )}
    </div>
  );
}