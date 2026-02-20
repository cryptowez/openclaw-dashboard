'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('red');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add to projects array
    console.log({ name, description, priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create New Project</h3>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-20"
            />
          </div>
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}