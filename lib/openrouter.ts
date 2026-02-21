// All models available via OpenRouter, grouped by capability tier
export const OPENROUTER_MODELS: Record<string, string> = {
  // Fast / low-cost
  'claude-3-haiku':    'anthropic/claude-3-haiku',
  'claude-3.5-haiku':  'anthropic/claude-3.5-haiku',
  'gpt-4o-mini':       'openai/gpt-4o-mini',
  'gemini-flash-1.5':  'google/gemini-flash-1.5',
  // Balanced
  'claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet',
  'gpt-4o':            'openai/gpt-4o',
  'gemini-pro-1.5':    'google/gemini-pro-1.5',
  // Powerful / complex
  'claude-3-opus':     'anthropic/claude-3-opus',
  'o3-mini':           'openai/o3-mini',
  'deepseek-r1':       'deepseek/deepseek-r1',
  'llama-3.1-70b':     'meta-llama/llama-3.1-70b-instruct',
} as const;

export type ModelKey = keyof typeof OPENROUTER_MODELS;

export const DEFAULT_MODEL: ModelKey = 'claude-3.5-sonnet';

// Auto-pick a model based on prompt length when no explicit model is given
export const getModelForPrompt = (prompt: string): ModelKey => {
  return prompt.length <= 500 ? 'claude-3-haiku' : 'claude-3.5-sonnet';
};

export const callOpenRouter = async (
  model: string,
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 2000
) => {
  const resolvedModel = OPENROUTER_MODELS[model] ?? model;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://github.com/cryptowez/openclaw-dashboard',
      'X-Title': 'OpenClaw Dashboard',
    },
    body: JSON.stringify({
      model: resolvedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message ?? 'OpenRouter API error');
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content as string,
    model: resolvedModel,
    tokensUsed: data.usage?.total_tokens ?? 0,
  };
};