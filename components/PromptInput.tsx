'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function PromptInput({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === '') return;
    onSubmit(prompt.trim());
    setPrompt('');
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 p-4 flex items-center">
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="bg-gray-800 rounded-l px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 rounded-r px-4 py-2 absolute right-0 top-0 h-full"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}