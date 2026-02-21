'use client';

import { Settings, Plus, GitBranch, Folder } from 'lucide-react';
import { Project } from '@/types';

interface SidebarProps {
  projects: Project[];
  selectedId: string | null;
  onSelectProject: (id: string) => void;
  onImport: () => void;
  onNew: () => void;
}

export default function Sidebar({
  projects,
  selectedId,
  onSelectProject,
  onImport,
  onNew,
}: SidebarProps) {
  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <span className="font-bold text-white">OpenClaw</span>
        <button title="Settings">
          <Settings className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Actions */}
      <div className="px-3 py-2 flex gap-2 border-b border-gray-800">
        <button
          onClick={onImport}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs py-1.5 rounded flex items-center justify-center gap-1"
        >
          <GitBranch className="h-3 w-3" /> Import
        </button>
        <button
          onClick={onNew}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs py-1.5 rounded flex items-center justify-center gap-1"
        >
          <Plus className="h-3 w-3" /> New
        </button>
      </div>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto py-2">
        <p className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wider">Projects</p>
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProject(p.id)}
            className={`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-gray-800 ${
              selectedId === p.id ? 'bg-gray-800 text-white' : 'text-gray-400'
            }`}
          >
            <Folder className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{p.name}</span>
            {p.type === 'git' && (
              <GitBranch className="h-3 w-3 ml-auto text-gray-600 shrink-0" />
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}