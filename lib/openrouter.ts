export const OPENROUTER_MODELS = {
  HAIKU: 'anthropic/claude-3-haiku',
  SONNET: 'anthropic/claude-3.5-sonnet',
} as const;

export const getModelForEnvironment = () => {
  if (process.env.NODE_ENV === 'development') {
    return OPENROUTER_MODELS.HAIKU; // Faster, cheaper model for development
  }
  return OPENROUTER_MODELS.SONNET; // Full model for production
};

export const callOpenRouter = async (
  model: keyof typeof OPENROUTER_MODELS,
  prompt: string,
  maxTokens: number = 1000
) => {
  const selectedModel = getModelForEnvironment();
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to call OpenRouter API');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};