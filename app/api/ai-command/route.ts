import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter, OPENROUTER_MODELS } from '@/lib/openrouter';

interface AICommandRequest {
  projectName: string;
  command: string;
  model: string;
  context?: string;
  apiKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AICommandRequest = await request.json();
    const { projectName, command, model, context, apiKey } = body;

    if (!command.trim()) {
      return NextResponse.json(
        { error: 'Command cannot be empty' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert developer helping to modify and improve the "${projectName}" project. Your role is to:
1. Generate code modifications based on user requests
2. Provide clear, production-ready code snippets
3. Suggest improvements and best practices
4. Keep token usage minimal by being concise
5. Always provide complete, working code
${context ? `\nContext about the project:\n${context}` : ''}`;

    const result = await callOpenRouter(model, systemPrompt, command, 2000, apiKey);
    return NextResponse.json({
      result: result.content,
      model: result.model,
      projectName,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    console.error('AI Command error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process AI command' },
      { status: 500 }
    );
  }
}