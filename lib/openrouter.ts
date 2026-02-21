export const OPENROUTER_MODELS = {
  HAIKU: 'anthropic/claude-3-haiku',
  SONNET: 'anthropic/claude-3.5-sonnet'
};

export const callOpenRouter = async (
  prompt: string,
  maxTokens: number = 500
) => {
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
        model: OPENROUTER_MODELS.HAIKU,
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
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
      tokens: data.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};