export const OPENROUTER_MODELS = {
  HAIKU: 'anthropic/claude-3-haiku',
  SONNET: 'anthropic/claude-3.5-sonnet',
} as const;

const COMPLEX_TASKS = [
  'refactor',
  'architecture', 
  'security',
  'optimization'
];

export const getModelForEnvironment = (prompt: string) => {
  // Development altijd Haiku
  if (process.env.NODE_ENV === 'development') {
    return OPENROUTER_MODELS.HAIKU;
  }

  // Productie: check op complexe taken
  const needsSonnet = COMPLEX_TASKS.some(task =>
    prompt.toLowerCase().includes(task)
  );

  return needsSonnet ? OPENROUTER_MODELS.SONNET : OPENROUTER_MODELS.HAIKU;
};

export const callOpenRouter = async (
  prompt: string,
  maxTokens: number = 500
) => {
  const selectedModel = getModelForEnvironment(prompt);
  
  try {
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
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.message}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: selectedModel,
      tokens: data.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
};