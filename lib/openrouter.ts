export const OPENROUTER_MODELS = {
  HAIKU: 'anthropic/claude-3-haiku',
  SONNET: 'anthropic/claude-3.5-sonnet'
} as const;

const COMPLEXITY_THRESHOLDS = {
  simple: 500,
  complex: 1000
};

export const getModelForPrompt = (prompt: string): keyof typeof OPENROUTER_MODELS => {
  const promptLength = prompt.length;

  if (promptLength <= COMPLEXITY_THRESHOLDS.simple) {
    return 'HAIKU';
  } else {
    return 'SONNET';
  }
};

export const callOpenRouter = async (
  prompt: string,
  maxTokens: number = 500
) => {
  const selectedModel = getModelForPrompt(prompt);
  
  try {
    const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://github.com/cryptowez/openclaw-dashboard',
        'X-Title': 'OpenClaw Dashboard'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODELS[selectedModel],
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenRouter error:', error);
      throw new Error(error.message);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: selectedModel,
      tokens: data.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};