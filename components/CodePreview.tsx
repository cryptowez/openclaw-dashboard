'use client';

import { useState } from 'react';
import { X, Copy, Monitor } from 'lucide-react';
import MonacoEditor from 'react-monaco-editor';

export default function CodePreview({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'tree' | 'editor' | 'preview'>('tree');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-4xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Code Preview</h3>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-full">
          <div className="w-1/4 border-r border-gray-700 pr-4">
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">File Tree</h4>
              <div className="space-y-2">
                {/* File tree goes here */}
              </div>
            </div>
          </div>
          <div className="w-3/4 pl-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  className={`px-2 py-1 rounded ${activeTab === 'tree' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                  onClick={() => setActiveTab('tree')}
                >
                  File Tree
                </button>
                <button
                  className={`px-2 py-1 rounded ${activeTab === 'editor' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                  onClick={() => setActiveTab('editor')}
                >
                  Code Editor
                </button>
                <button
                  className={`px-2 py-1 rounded ${activeTab === 'preview' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Browser Preview
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-800 rounded">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded">
                  <Monitor className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-[calc(100%-64px)]">
              {activeTab === 'tree' && (
                <div>File tree goes here</div>
              )}
              {activeTab === 'editor' && (
                <MonacoEditor
                  language="typescript"
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              )}
              {activeTab === 'preview' && (
                <div>Browser preview goes here</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}