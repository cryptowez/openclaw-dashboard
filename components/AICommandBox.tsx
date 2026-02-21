'use client';

import React from 'react';
import { getOrFetch } from '@/lib/cache';
import { callOpenRouter } from '@/lib/openrouter';

interface AICommandBoxProps {
  projectName: string;
  onCommand: (command: string, response: string) => void;
}

export const AICommandBox: React.FC<AICommandBoxProps> = ({ projectName, onCommand }) => {
  const [commands, setCommands] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const batchCommands = async () => {
    if (commands.length === 0) return;
    
    setIsLoading(true);
    try {
      const cacheKey = `${projectName}:${commands.join('+')}`;
      const response = await getOrFetch(cacheKey, () => 
        callOpenRouter('simple', `Update for ${projectName}: ${commands.join(' + ')}`, 500)
      );
      onCommand(commands.join(' + '), response);
      setCommands([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <textarea
        className="w-full bg-gray-800 border border-gray-700 rounded p-2"
        placeholder="Enter commands..."
        onChange={(e) => setCommands(e.target.value.split('\n'))}
        disabled={isLoading}
      />
      <button
        onClick={batchCommands}
        disabled={isLoading || commands.length === 0}
        className="mt-2 px-4 py-2 bg-blue-600 rounded"
      >
        {isLoading ? 'Processing...' : 'Execute'}
      </button>
    </div>
  );
};