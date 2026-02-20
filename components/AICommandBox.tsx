'use client';

import { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { openRouter } from '../lib/openrouter';

export default function AICommandBox() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const completion = await openRouter.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 2048,
        temperature: 0.7,
      });
      setResponse(completion.data.choices[0].text);
    } catch (err) {
      console.error('Error fetching AI response:', err);
      setResponse('Error fetching AI response. Please try again.');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  return (
    <div className="border-t border-gray-800 p-4 bg-gray-950 flex items-center">
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
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 rounded-r px-4 py-2 absolute right-0 top-0 h-full"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
      {response && (
        <div className="bg-gray-800 rounded-lg p-4 ml-4 max-w-md">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm">{response}</pre>
        </div>
      )}
    </div>
  );
}