import { callOpenRouter } from '@/lib/openrouter';

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        resolve(func(...args));
      }, waitFor);
    });
  };
};

export const debouncedAICall = debounce(
  async (input: string, callback: (result: string) => void) => {
    const result = await callOpenRouter(
      'claude-3-haiku',
      'You are a helpful coding assistant. Be concise.',
      input,
      300,
    );
    callback(result.content);
  },
  1000, // Wait 1 second before making AI call
);