'use client';

import { useState } from 'react';
import { FileText, RefreshCw, ChevronRight } from 'lucide-react';
import { Project } from '@/types';

interface GitFile {
  path: string;
  sha: string;
  size?: number;
}

interface MainPanelProps {
  project: Project | null;
  selectedFile: GitFile | null;
  fileContent: string | null;
  files: GitFile[];
  onSelectFile: (file: GitFile) => void;
  onRefresh: () => void;
}

export default function MainPanel({
  project,
  selectedFile,
  fileContent,
  files,
  onSelectFile,
  onRefresh,
}: MainPanelProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
      {/* Top bar */}
      <div className="px-4 py-2 border-b border-gray-800 flex items-center gap-3 text-sm text-gray-400 shrink-0">
        <span className="font-medium text-white">{project?.name ?? 'No project selected'}</span>
        {project?.type === 'git' && project.gitUrl && (
          <span className="text-xs text-blue-400 truncate">{project.gitUrl}</span>
        )}
        <button
          onClick={onRefresh}
          title="Refresh file tree"
          className="ml-auto p-1 hover:bg-gray-800 rounded"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Two-pane: file tree + code view */}
      <div className="flex flex-1 overflow-hidden">
        {/* File tree */}
        <div className="w-48 shrink-0 border-r border-gray-800 overflow-y-auto py-2">
          <p className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wider">Files</p>
          {files.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-600">
              {project ? 'Pull to load files' : 'Select a project'}
            </p>
          ) : (
            files.map((f) => (
              <button
                key={f.path}
                onClick={() => onSelectFile(f)}
                className={`w-full text-left px-3 py-1 text-xs flex items-center gap-1.5 hover:bg-gray-800 truncate ${
                  selectedFile?.path === f.path
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400'
                }`}
              >
                <FileText className="h-3 w-3 shrink-0" />
                <span className="truncate">{f.path}</span>
              </button>
            ))
          )}
        </div>

        {/* Code view */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedFile ? (
            <>
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-400 flex items-center gap-2 shrink-0">
                <ChevronRight className="h-3 w-3" />
                {selectedFile.path}
              </div>
              <pre className="flex-1 overflow-auto p-4 text-xs text-gray-300 font-mono whitespace-pre">
                {fileContent ?? 'Loading…'}
              </pre>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
