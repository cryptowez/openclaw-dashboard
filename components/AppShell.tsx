'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import ProjectWorkspace from './ProjectWorkspace';
import { Project } from '@/types';
import { ModelKey, DEFAULT_MODEL } from '@/lib/openrouter';

export interface Tab {
  id: string;
  name: string;
  gitUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

type ImportRepo = { owner: string; name: string };

const makeProject = ({ owner, name }: ImportRepo): Project => ({
  id: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  description: null,
  status: 'pending',
  lastAction: 'Imported',
  updated: new Date().toLocaleString(),
  priority: 'blue',
  type: 'git',
  gitUrl: `https://github.com/${owner}/${name}`,
});

const DEMO_PROJECTS: Project[] = [
  {
    id: 'openclaw',
    name: 'openclaw',
    description: 'OpenClaw dashboard — self-hosted Emergent alternative.',
    status: 'active',
    lastAction: 'Deploy to production',
    updated: '2/20/2026, 6:30:00 AM',
    priority: 'red',
    type: 'git',
    gitUrl: 'https://github.com/cryptowez/openclaw-dashboard',
  },
  {
    id: 'ioniqai',
    name: 'ioniqai',
    description: 'IoniqAI project.',
    status: 'pending',
    lastAction: 'Code review',
    updated: '2/20/2026, 6:15:00 AM',
    priority: 'orange',
    type: 'git',
    gitUrl: 'https://github.com/demo/ioniqai',
  },
  {
    id: 'darkpeptide',
    name: 'darkpeptide',
    description: 'Dark Peptide project.',
    status: 'pending',
    lastAction: 'Initial commit',
    updated: '2/19/2026, 11:00:00 AM',
    priority: 'blue',
    type: 'new',
  },
];

export default function AppShell() {
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [model, setModel] = useState<ModelKey>(DEFAULT_MODEL);
  const [aiLogs, setAiLogs] = useState<Map<string, Message[]>>(new Map());

  // Open or focus a project tab
  const openProject = useCallback((project: Project) => {
    setTabs(prev => {
      if (prev.find(t => t.id === project.id)) return prev;
      return [...prev, { id: project.id, name: project.name, gitUrl: project.gitUrl }];
    });
    setActiveTab(project.id);
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      return next;
    });
    setActiveTab(prev => {
      if (prev !== id) return prev;
      const remaining = tabs.filter(t => t.id !== id);
      return remaining.length > 0 ? remaining[remaining.length - 1].id : 'home';
    });
  }, [tabs]);

  const handleNewProject = useCallback(() => {
    const name = `project-${Date.now()}`;
    const p: Project = {
      id: name,
      name,
      description: null,
      status: 'pending',
      lastAction: 'Created',
      updated: new Date().toLocaleString(),
      priority: 'blue',
      type: 'new',
    };
    setProjects(prev => [p, ...prev]);
    openProject(p);
  }, [openProject]);

  const handleImportProject = useCallback((repo: ImportRepo) => {
    const p = makeProject(repo);
    setProjects(prev => {
      if (prev.find(x => x.id === p.id)) return prev;
      return [p, ...prev];
    });
    openProject(p);
  }, [openProject]);

  const addMessage = useCallback((projectId: string, msg: Message) => {
    setAiLogs(prev => {
      const existing = prev.get(projectId) ?? [];
      const next = new Map(prev);
      next.set(projectId, [...existing, msg]);
      return next;
    });
  }, []);

  const activeProject = projects.find(p => p.id === activeTab);
  const activeMessages = aiLogs.get(activeTab) ?? [];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <Topbar
        tabs={tabs}
        activeTab={activeTab}
        onTabSelect={setActiveTab}
        onTabClose={closeTab}
        model={model}
        onModelChange={setModel}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          projects={projects}
          activeTab={activeTab}
          onProjectClick={openProject}
          onNewProject={handleNewProject}
          onImportProject={handleImportProject}
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'home' ? (
            <HomeView
              projects={projects}
              onProjectClick={openProject}
              onNewProject={handleNewProject}
              onImportProject={handleImportProject}
              model={model}
              onModelChange={setModel}
            />
          ) : activeProject ? (
            <ProjectWorkspace
              project={activeProject}
              messages={activeMessages}
              onAddMessage={(msg) => addMessage(activeProject.id, msg)}
              model={model}
              onModelChange={setModel}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Project not found.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Home View ────────────────────────────────────────────────────────────────

interface HomeViewProps {
  projects: Project[];
  onProjectClick: (p: Project) => void;
  onNewProject: () => void;
  onImportProject: (repo: { owner: string; name: string }) => void;
  model: ModelKey;
  onModelChange: (m: ModelKey) => void;
}

import { Send, GitBranch, Plus } from 'lucide-react';
import { OPENROUTER_MODELS } from '@/lib/openrouter';

function HomeView({ projects, onProjectClick, onNewProject, model, onModelChange }: HomeViewProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentTab, setRecentTab] = useState<'tasks' | 'apps'>('tasks');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    // Create a new project and open it
    onNewProject();
    setPrompt('');
    setIsLoading(false);
  };

  return (
    <div
      className="flex-1 h-full overflow-y-auto flex flex-col items-center justify-start pt-24 px-6"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* Heading */}
      <h1 className="text-3xl font-semibold text-white mb-8 tracking-tight text-center">
        What will you build today?
      </h1>

      {/* Prompt box */}
      <div className="w-full max-w-2xl bg-[#111] border border-gray-800 rounded-md overflow-hidden mb-8">
        <form onSubmit={handleSend}>
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-white placeholder-gray-500 resize-none focus:outline-none min-h-[96px]"
            placeholder="Describe what you want to build or change…"
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={isLoading}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <select
                value={model}
                onChange={e => onModelChange(e.target.value as ModelKey)}
                className="bg-[#0d0d0d] border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none"
              >
                {Object.keys(OPENROUTER_MODELS).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <Send className="h-3 w-3" />
              {isLoading ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </div>

      {/* Recent projects */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-4 border-b border-gray-800 pb-2">
          <button
            onClick={() => setRecentTab('tasks')}
            className={`text-xs font-medium pb-1 ${recentTab === 'tasks' ? 'text-white border-b border-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Recent Tasks
          </button>
          <button
            onClick={() => setRecentTab('apps')}
            className={`text-xs font-medium pb-1 ${recentTab === 'apps' ? 'text-white border-b border-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Deployed Apps
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => onProjectClick(p)}
              className="bg-[#111] border border-gray-800 rounded-md p-4 text-left hover:border-gray-600 transition group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-white truncate">{p.name}</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    p.status === 'active'
                      ? 'bg-green-900 text-green-300'
                      : p.status === 'pending'
                      ? 'bg-yellow-900 text-yellow-300'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              {p.description && (
                <p className="text-xs text-gray-500 truncate mb-2">{p.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-600">{p.updated}</span>
                <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                  Open →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
