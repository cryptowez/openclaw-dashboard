'use client';

import { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { OPENROUTER_MODELS, callOpenRouter } from '@/lib/openrouter';

interface AICommandBoxProps {
  projectName: string;
  onCommand: (command: string, response: string) => void;
}

export default function AICommandBox({ projectName, onCommand }: AICommandBoxProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<typeof OPENROUTER_MODELS[keyof typeof OPENROUTER_MODELS]>(OPENROUTER_MODELS.HAIKU);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const { content, tokensUsed } = await callOpenRouter(selectedModel, `You are an expert developer helping to modify and improve the "${projectName}" project. Your role is to: 1. Generate code modifications based on user requests 2. Provide clear, production-ready code snippets 3. Suggest improvements and best practices 4. Keep token usage minimal by being concise 5. Always provide complete, working code`, input, 2000);
      onCommand(input, content);
      setInput('');
    } catch (error) {
      console.error('AI Command error:', error);
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
          onChange={(e) => setSelectedModel(e.target.value as typeof OPENROUTER_MODELS[keyof typeof OPENROUTER_MODELS])}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
        >
          {Object.values(OPENROUTER_MODELS).map((model) => (
            <option key={model} value={model}>
              {model.split('/')[1]} ({model.split('/')[0] === 'anthropic/claude-3-haiku' ? 'Fast' : 'Powerful'})
            </option>
          ))}
        </select>
      </div>
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