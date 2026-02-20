'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ImportGitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (repo: { owner: string; name: string }) => void;
}

export default function ImportGitModal({ isOpen, onClose, onImport }: ImportGitModalProps) {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner.trim() || !repo.trim()) return;

    setIsLoading(true);
    try {
      await onImport({ owner, name: repo });
      setOwner('');
      setRepo('');
      onClose();
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-[500px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Import GitHub Repository</h3>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Owner/Organization</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="e.g., openclaw"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Repository Name</label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="e.g., openclaw-dashboard"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-700"
              disabled={isLoading}
            >
              {isLoading ? 'Importing...' : 'Import Repository'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}