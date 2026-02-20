'use client';

import { useState } from 'react';
import { Send, Loader } from 'lucide-react';

interface AICommandBoxProps {
  projectName: string;
  onCommand: (command: string) => void;
}

export default function AICommandBox({ projectName, onCommand }: AICommandBoxProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Call OpenRouter API with Haiku/Claude Sonnet
      const response = await fetch('/api/ai-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          command: input,
          model: 'claude-3.5-sonnet', // or haiku for smaller tasks
        }),
      });
      const data = await response.json();
      onCommand(data.result);
      setInput('');
    } catch (error) {
      console.error('AI Command error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Talk to AI for ${projectName}... (e.g., "Add dark mode", "Refactor this component")`}
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
    </div>
  );
}