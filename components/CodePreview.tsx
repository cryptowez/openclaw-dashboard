'use client';

import { useState } from 'react';
import { X, Copy, Monitor, FilePlus, FileText, Globe } from 'lucide-react';
import MonacoEditor from 'react-monaco-editor';
import { Project } from '../types';

interface CodePreviewProps {
  project: Project | null;
  onClosePreview: () => void;
}

export default function CodePreview({ project, onClosePreview }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'tree' | 'editor' | 'preview'>('tree');

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Select a project to view code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      {/* Top bar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-800">
        <button onClick={() => setActiveTab('tree')} className={`px-3 py-1.5 rounded flex items-center gap-2 ${activeTab === 'tree' ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
          <FilePlus className="h-4 w-4" /> File Tree
        </button>
        <button onClick={() => setActiveTab('editor')} className={`px-3 py-1.5 rounded flex items-center gap-2 ${activeTab === 'editor' ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
          <FileText className="h-4 w-4" /> Code Editor
        </button>
        <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 rounded flex items-center gap-2 ${activeTab === 'preview' ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
          <Globe className="h-4 w-4" /> Preview
        </button>
        <div className="ml-auto text-sm text-gray-400">
          {project.name}
        </div>
        <button onClick={onClosePreview} className="p-2 hover:bg-gray-800 rounded">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'tree' && (
          <div className="grid grid-cols-[200px_1fr] gap-4 h-full">
            {/* File tree */}
            <div className="bg-gray-900 rounded p-3 border border-gray-800">
              <div className="text-xs font-semibold mb-2 text-gray-400">FILES</div>
              <div className="space-y-1 text-sm">
                {project.files.map((file) => (
                  <div key={file.path} className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">
                    {file.type === 'file' ? (
                      <FileText className="h-4 w-4 inline-block mr-2" />
                    ) : (
                      <FilePlus className="h-4 w-4 inline-block mr-2" />
                    )}
                    {file.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Code editor */}
            <div className="bg-gray-900 rounded p-4 border border-gray-800 font-mono text-sm overflow-auto">
              <MonacoEditor
                language="typescript"
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
                value={project.files.find((f) => f.name === 'index.tsx')?.content || ''}
              />
            </div>
          </div>
        )}
        {activeTab === 'preview' && (
          <div className="bg-white rounded h-full">
            <iframe src={project.previewUrl || 'about:blank'} className="w-full h-full rounded" title="Preview" />
          </div>
        )}
      </div>
    </div>
  );
}