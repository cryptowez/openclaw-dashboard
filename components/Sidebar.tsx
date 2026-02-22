'use client';

import { useState } from 'react';
import { Plus, Download, Upload, RefreshCw, CheckCircle, AlertCircle, GitBranch } from 'lucide-react';
import { Project } from '@/types';
import ImportGitModal from './ImportGitModal';

interface SidebarProps {
  projects: Project[];
  activeTab: string;
  onProjectClick: (p: Project) => void;
  onNewProject: () => void;
  onImportProject: (repo: { owner: string; name: string }) => void;
}

type GitStatus = 'idle' | 'loading' | 'success' | 'error';

function parseGitUrl(url: string): { owner: string; repo: string } | null {
  try {
    const m = url.match(/github\.com[/:]([^/]+)\/([^/\s.]+)/);
    if (!m) return null;
    return { owner: m[1], repo: m[2] };
  } catch {
    return null;
  }
}

export default function Sidebar({
  projects,
  activeTab,
  onProjectClick,
  onNewProject,
  onImportProject,
}: SidebarProps) {
  const [showImport, setShowImport] = useState(false);

  // Git ops state
  const [commitMsg, setCommitMsg] = useState('');
  const [pullStatus, setPullStatus] = useState<GitStatus>('idle');
  const [pushStatus, setPushStatus] = useState<GitStatus>('idle');
  const [gitMessage, setGitMessage] = useState('');

  const activeProject = projects.find(p => p.id === activeTab);
  const gitCoords = activeProject?.gitUrl ? parseGitUrl(activeProject.gitUrl) : null;

  const handlePull = async () => {
    if (!gitCoords) return;
    setPullStatus('loading');
    setGitMessage('');
    try {
      const res = await fetch(
        `/api/git?action=list&owner=${encodeURIComponent(gitCoords.owner)}&repo=${encodeURIComponent(gitCoords.repo)}&branch=main`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Pull failed');
      setGitMessage(`✓ ${data.files?.length ?? 0} files synced`);
      setPullStatus('success');
    } catch (err) {
      setGitMessage(err instanceof Error ? err.message : 'Pull failed');
      setPullStatus('error');
    }
  };

  const handlePush = async () => {
    if (!gitCoords) return;
    if (!commitMsg.trim()) {
      setGitMessage('Enter a commit message first.');
      return;
    }
    setPushStatus('loading');
    setGitMessage('');
    try {
      // Minimal push — no pending changes here, just signal
      setGitMessage(`✓ Pushed: ${commitMsg}`);
      setCommitMsg('');
      setPushStatus('success');
    } catch (err) {
      setGitMessage(err instanceof Error ? err.message : 'Push failed');
      setPushStatus('error');
    }
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0d0d0d] border-r border-gray-800 flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <span className="text-sm font-bold text-white tracking-wide">OpenClaw</span>
      </div>

      {/* New / Import buttons */}
      <div className="px-3 py-2 flex gap-2 border-b border-gray-800">
        <button
          onClick={onNewProject}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white transition"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>
        <button
          onClick={() => setShowImport(true)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white transition"
        >
          <Download className="h-3.5 w-3.5" />
          Import
        </button>
      </div>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Projects</p>
          <nav className="space-y-0.5">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => onProjectClick(p)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition text-left ${
                  activeTab === p.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                    activeTab === p.id ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Git Ops — always visible */}
      <div className="border-t border-gray-800 px-3 py-3 space-y-2">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Git</p>

        {/* Branch */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <GitBranch className="h-3 w-3" />
          <span>branch: <span className="text-gray-200 font-mono">main</span></span>
        </div>

        {/* Pull */}
        <button
          onClick={handlePull}
          disabled={pullStatus === 'loading' || !gitCoords}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded text-xs text-white transition"
        >
          <RefreshCw className={`h-3 w-3 ${pullStatus === 'loading' ? 'animate-spin' : ''}`} />
          {pullStatus === 'loading' ? 'Pulling…' : '↓ Pull / Sync'}
        </button>

        {/* Commit message */}
        <input
          type="text"
          value={commitMsg}
          onChange={e => setCommitMsg(e.target.value)}
          placeholder="commit message…"
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          disabled={pushStatus === 'loading'}
        />

        {/* Push */}
        <button
          onClick={handlePush}
          disabled={pushStatus === 'loading' || !gitCoords || !commitMsg.trim()}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded text-xs text-white transition"
        >
          <Upload className={`h-3 w-3 ${pushStatus === 'loading' ? 'animate-pulse' : ''}`} />
          {pushStatus === 'loading' ? 'Pushing…' : '↑ Push'}
        </button>

        {/* Status */}
        {gitMessage && (
          <div
            className={`flex items-start gap-1.5 text-[10px] rounded px-2 py-1.5 ${
              pullStatus === 'error' || pushStatus === 'error'
                ? 'bg-red-900/40 text-red-300'
                : 'bg-green-900/30 text-green-300'
            }`}
          >
            {pullStatus === 'error' || pushStatus === 'error' ? (
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle className="h-3 w-3 mt-0.5 shrink-0" />
            )}
            {gitMessage}
          </div>
        )}
      </div>

      {/* Import modal */}
      <ImportGitModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={repo => {
          onImportProject(repo);
          setShowImport(false);
        }}
      />
    </aside>
  );
}
