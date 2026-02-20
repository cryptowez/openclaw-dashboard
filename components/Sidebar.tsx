import { useState } from 'react';
import Link from 'next/link';
import { Folder, Plus, Database } from 'lucide-react';
import { projects } from '../lib/mock';
import PriorityButtons from './PriorityButtons';
import CreateProjectModal from './CreateProjectModal';
import ImportGitModal from './ImportGitModal';

interface SidebarProps {
  selectedPriority: string | null;
  onSelectPriority: (priority: string | null) => void;
}

export default function Sidebar({ selectedPriority, onSelectPriority }: SidebarProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="w-64 bg-gray-900 h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-8 w-8 bg-blue-500 rounded-full"></div>
        <div className="text-xl font-bold">IoniqAI</div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Projects</h2>
          <div className="relative">
            <button onClick={() => setShowAddMenu(!showAddMenu)} className="p-2 hover:bg-gray-800 rounded">
              <Plus className="h-4 w-4" />
            </button>
            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                <button onClick={() => { setShowCreateModal(true); setShowAddMenu(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center gap-2 rounded-t-lg">
                  <Plus className="h-4 w-4" /> New Project
                </button>
                <button onClick={() => { setShowImportModal(true); setShowAddMenu(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center gap-2 rounded-b-lg">
                  <span>🔗</span> Import from GitHub
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded"
            >
              <Folder className="h-4 w-4" />
              <span>{project.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Priority</h2>
        <PriorityButtons
          selectedPriority={selectedPriority as any}
          onSelect={onSelectPriority as any}
        />
      </div>
      
      <Link
        href="/vault"
        className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded mt-auto"
      >
        <Database className="h-4 w-4" />
        <span>Vault</span>
      </Link>

      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showImportModal && (
        <ImportGitModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}