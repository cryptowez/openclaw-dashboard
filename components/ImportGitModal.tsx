'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function ImportGitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [priority, setPriority] = useState('red');
  const [repo, setRepo] = useState(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Import from GitHub
    console.log({ url, priority, repo });
    onClose();
  };

  const parseGitUrl = () => {
    try {
      const parsed = new URL(url);
      const [, owner, name] = parsed.pathname.split('/');
      setRepo({ owner, name });
    } catch (err) {
      setRepo(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Import from GitHub</h3>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">GitHub URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                parseGitUrl();
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              required
            />
          </div>
          {repo && (
            <div className="mb-4">
              <div>
                Owner: <span className="font-mono">{repo.owner}</span>
              </div>
              <div>
                Repository: <span className="font-mono">{repo.name}</span>
              </div>
            </div>
          )}
          <div className="mb-6">
            <label className="block text-sm mb-2">Priority</label>
            <div className="flex gap-4">
              {['red', 'orange', 'blue', 'green'].map((color) => (
                <label key={color} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={color}
                    checked={priority === color}
                    onChange={(e) => setPriority(e.target.value)}
                    className="accent-current"
                  />
                  <span className={`h-4 w-4 rounded-full bg-${color}-500`}></span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Import Repository
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}