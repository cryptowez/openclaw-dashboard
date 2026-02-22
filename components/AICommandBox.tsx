'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ModelKey, DEFAULT_MODEL } from '@/lib/openrouter';
import ModelSelector from './ModelSelector';

interface AICommandBoxProps {
  projectName: string;
  onCommand: (command: string, response: string) => void;
}

export const AICommandBox: React.FC<AICommandBoxProps> = ({ projectName, onCommand }) => {
  const [command, setCommand] = useState('');
  const [model, setModel] = useState<ModelKey>(DEFAULT_MODEL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          command,
          model,
          apiKey: typeof window !== 'undefined' ? localStorage.getItem('vault_openrouter_key') ?? '' : '',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Request failed');
      }

      const data = await res.json();
      onCommand(command, data.result);
      setCommand('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">AI Command — {projectName}</span>
        <ModelSelector value={model} onChange={setModel} disabled={isLoading} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500"
          placeholder="Describe what you want to build or change…"
          rows={3}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as any);
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !command.trim()}
          className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded flex items-center gap-2 text-sm"
        >
          <Send className="h-4 w-4" />
          {isLoading ? 'Working…' : 'Send'}
        </button>
      </form>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default AICommandBox;