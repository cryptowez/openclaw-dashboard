import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface AICommandRequest {
  projectName: string;
  command: string;
  model: string;
  context?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AICommandRequest = await request.json();
    const { projectName, command, model, context } = body;

    if (!command.trim()) {
      return NextResponse.json(
        { error: 'Command cannot be empty' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert developer helping to modify and improve the "${projectName}" project. Your role is to: 
1. Generate code modifications based on user requests
2. Provide clear, production-ready code snippets
3. Suggest improvements and best practices
4. Keep token usage minimal by being concise
5. Always provide complete, working code
${context ? `\nContext about the project:\n${context}` : ''}`;

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: command },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || 'OpenRouter API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    return NextResponse.json({
      result: aiResponse,
      model,
      projectName,
      tokensUsed: data.usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error('AI Command error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI command' },
      { status: 500 }
    );
  }
}