import { useState, useCallback } from 'react';
import { callOpenRouter } from '@/lib/openrouter';

export const useAICommand = (projectName: string) => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const executeCommand = useCallback(async (command: string) => {
    setIsLoading(true);
    try {
      const result = await callOpenRouter(
        'haiku', // Use faster, smaller model by default
        `Project: ${projectName}. Task: ${command}`,
        500 // Strict token limit
      );
      setResponse(result);
    } finally {
      setIsLoading(false);
    }
  }, [projectName]);

  return { response, isLoading, executeCommand };
};