'use client';

import { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { OPENROUTER_MODELS } from '@/lib/openrouter';

interface AICommandBoxProps {
  projectName: string;
  onCommand: (command: string, response: string) => void;
}

export default function AICommandBox({ projectName, onCommand }: AICommandBoxProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(OPENROUTER_MODELS.HAIKU);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          command: input,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setResponse(data.result);
        onCommand(input, data.result);
        setInput('');
      }
    } catch (error) {
      console.error('AI Command error:', error);
      setResponse('Error: Failed to process command');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex gap-2 mb-3">
        <label className="text-sm text-gray-400">Model:</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
        >
          <option value={OPENROUTER_MODELS.HAIKU}>Haiku (Fast)</option>
          <option value={OPENROUTER_MODELS.CLAUDE_45}>Claude 3.5</option>
          <option value={OPENROUTER_MODELS.SONNET}>Sonnet (Powerful)</option>
        </select>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Talk to AI for ${projectName}...`}
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-700 flex items-center gap-2"
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
      {response && (
        <div className="bg-gray-800 border border-gray-700 rounded p-3 max-h-40 overflow-y-auto">
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}