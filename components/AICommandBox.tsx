'use client';

import React, { useState, useEffect } from 'react';
import { getOrFetch, clearExpiredCache } from '@/lib/cache';
import { callOpenRouter } from '@/lib/openrouter';

interface AICommandBoxProps {
  projectName: string;
  onCommand: (command: string, response: string) => void;
}

const CACHE_TTL = '15m';
const BATCH_DELAY = 2000;

export const AICommandBox: React.FC<AICommandBoxProps> = ({ projectName, onCommand }) => {
  const [commands, setCommands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const batchTimer = setTimeout(async () => {
      if (commands.length === 0) return;
      
      setIsLoading(true);
      try {
        const cacheKey = `${projectName}:${commands.join('+')}`;
        const { content, tokens } = await getOrFetch(cacheKey, async () => {
          const response = await callOpenRouter(`Update for ${projectName}: ${commands.join(' + ')}`, 500);
          return response;
        }, CACHE_TTL);
        
        onCommand(commands.join(' + '), content);
        setCommands([]);
        console.log(`Tokens used: ${tokens}`);
      } finally {
        setIsLoading(false);
      }
    }, BATCH_DELAY);

    return () => clearTimeout(batchTimer);
  }, [projectName, commands, onCommand]);

  const handleCommandInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommands(e.target.value.split('\n'));
    clearExpiredCache();
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <textarea
        className="w-full bg-gray-800 border border-gray-700 rounded p-2"
        placeholder="Enter commands..."
        onChange={handleCommandInput}
        disabled={isLoading}
      />
      <button
        onClick={() => {}} // No need to call manually
        disabled={isLoading || commands.length === 0}
        className="mt-2 px-4 py-2 bg-blue-600 rounded"
      >
        {isLoading ? 'Processing...' : 'Execute'}
      </button>
    </div>
  );
};