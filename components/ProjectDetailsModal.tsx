'use client';

import { useState } from 'react';
import { X, Lock, Edit, Trash } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (projectId: string) => void;
  onUpdate: (projectId: string, updatedProject: Partial<Project>) => void;
}

export default function ProjectDetailsModal({ project, isOpen, onClose, onDelete, onUpdate }: ProjectDetailsModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [priority, setPriority] = useState<Project['priority']>(project.priority);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(project.id, { name, description, priority });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <h3 className="text-xl font-semibold">🔒 Project Details</h3>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-2">
                <Edit className="h-4 w-4" /> Edit
              </button>
            )}
            <button onClick={() => onDelete(project.id)} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 flex items-center gap-2">
              <Trash className="h-4 w-4" /> Delete
            </button>
            <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Project Name</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              />
            ) : (
              <div className="font-mono text-sm">{name}</div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-20"
              />
            ) : (
              <div className="font-mono text-sm">{description || 'No description'}</div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-2">Priority</label>
            {isEditing ? (
              <div className="flex gap-4">
                {(['red', 'orange', 'blue', 'green'] as const).map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={color}
                      checked={priority === color}
                      onChange={(e) => setPriority(e.target.value as Project['priority'])}
                      className="accent-current"
                    />
                    <span className={`h-4 w-4 rounded-full bg-${color}-500`}></span>
                    <span className="capitalize">{color}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded bg-${project.priority}-500 text-white`}>
                <span className={`h-4 w-4 rounded-full bg-${project.priority}-500`}></span>
                <span className="capitalize">{project.priority}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-800 pt-4 mt-4">
            <h4 className="font-semibold mb-3">Project Information</h4>
            <div className="mb-3">
              <label className="block text-sm mb-2">Type</label>
              <div className="font-mono text-sm">{project.type}</div>
            </div>
            {project.type === 'git' && (
              <div>
                <label className="block text-sm mb-2">GitHub URL</label>
                <div className="font-mono text-sm">{project.gitUrl}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}