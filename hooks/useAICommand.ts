import { useState, useCallback } from 'react';
import { callOpenRouter } from '@/lib/openrouter';

export const useAICommand = (projectName: string) => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const executeCommand = useCallback(async (command: string) => {
    setIsLoading(true);
    try {
      const result = await callOpenRouter(
        'claude-3-haiku',
        `You are a coding assistant helping with the "${projectName}" project. Be concise.`,
        command,
        500,
      );
      setResponse(result.content);
    } finally {
      setIsLoading(false);
    }
  }, [projectName]);

  return { response, isLoading, executeCommand };
};