'use client';

import { useState } from 'react';
import { Folders, Settings, Plus, X, Import } from 'lucide-react';
import ImportGitModal from './ImportGitModal';

export default function Sidebar() {
  const [showImportModal, setShowImportModal] = useState(false);

  const handleImport = (repo: { owner: string; name: string }) => {
    // Handle import logic here
    console.log('Importing repository:', repo);
    setShowImportModal(false);
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Top Section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">OpenClaw</h1>
          <button className="p-2 hover:bg-gray-800 rounded">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
          >
            <Import className="h-4 w-4" />
            Import
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">PROJECTS</h2>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 bg-gray-800 text-white"
            >
              <Folders className="h-4 w-4" />
              Project Alpha
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 text-gray-400"
            >
              <Folders className="h-4 w-4" />
              Project Beta
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 text-gray-400"
            >
              <Folders className="h-4 w-4" />
              Project Gamma
            </a>
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-800" />
          <div>
            <div className="text-sm font-medium">User Name</div>
            <div className="text-xs text-gray-400">user@example.com</div>
          </div>
        </div>
      </div>

      {showImportModal && (
        <ImportGitModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </aside>
  );
}