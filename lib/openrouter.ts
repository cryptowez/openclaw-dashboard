export const OPENROUTER_MODELS = {
  HAIKU: 'anthropic/claude-3-haiku',
  CLAUDE_45: 'anthropic/claude-3.5-haiku',
  SONNET: 'anthropic/claude-3.5-sonnet',
} as const;

export async function callOpenRouter(
  model: string,
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 2000
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenRouter API error');
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || '',
    tokensUsed: data.usage?.total_tokens || 0,
    model,
  };
}