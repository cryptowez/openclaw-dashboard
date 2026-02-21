'use client';

import dynamic from 'next/dynamic';
import { Project } from '@/types';
import GitOpsPanel from './GitOpsPanel';

const AICommandBox = dynamic(() => import('@/components/AICommandBox'), {
  loading: () => <div className="text-sm text-gray-400 p-4">Loading AI…</div>,
  ssr: false,
});

interface AiLogEntry {
  prompt: string;
  response: string;
}

interface GitCoords {
  owner: string;
  repo: string;
}

interface RightPanelProps {
  project: Project | null;
  gitCoords: GitCoords | null;
  aiLog: AiLogEntry[];
  onAiCommand: (prompt: string, response: string) => void;
}

export default function RightPanel({
  project,
  gitCoords,
  aiLog,
  onAiCommand,
}: RightPanelProps) {
  return (
    <aside className="w-80 shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col h-full overflow-hidden">
      {/* AI Command */}
      <div className="px-3 py-3 border-b border-gray-800 shrink-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">AI Command</p>
        {project ? (
          <AICommandBox projectName={project.name} onCommand={onAiCommand} />
        ) : (
          <p className="text-xs text-gray-600">Select a project first</p>
        )}
      </div>

      {/* AI Responses */}
      <div className="flex-1 overflow-y-auto px-3 py-3 border-b border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">AI Responses</p>
        {aiLog.length === 0 ? (
          <p className="text-xs text-gray-600">No responses yet</p>
        ) : (
          <div className="space-y-3">
            {aiLog.map((entry, i) => (
              <div key={i} className="border-b border-gray-800 pb-3 last:border-0">
                <p className="text-xs text-gray-500 mb-1">▶ {entry.prompt}</p>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                  {entry.response}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Git Ops */}
      <div className="px-3 py-3 shrink-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Git Ops</p>
        {gitCoords ? (
          <GitOpsPanel
            owner={gitCoords.owner}
            repo={gitCoords.repo}
            branch="main"
            compact
          />
        ) : (
          <p className="text-xs text-gray-600">No git project selected</p>
        )}
      </div>
    </aside>
  );
}
